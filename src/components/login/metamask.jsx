import React, {useEffect, useState} from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import {useEthersSigner } from './ethersNew';
import {ethers} from "ethers";
import {createSiweMessage} from "../../utils/sign";
import {useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import requests from "../../requests";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { SEEDAO_USER_DATA, SELECT_WALLET } from "../../utils/constant";
import { Authorizer } from "casbin.js";
import { readPermissionUrl } from "../../requests/user";
import { WalletType } from "../../wallet/wallet";
import { clearStorage } from "../../utils/auth";

export default function  Metamask({callback}){
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const { open } = useWeb3Modal();
    const { isConnected,address } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();
    const [msg,setMsg] = useState();
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);
    const [connectWallet,setConnectWallet] = useState(false);

    const signer = useEthersSigner({chainId:chain});


    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])

    useEffect(()=>{
        dispatch({ type: AppActionType.SET_ACCOUNT, payload: address });
    },[address])

    useEffect(()=>{
        if(!signer || !connectWallet || !address) return;
        dispatch({ type: AppActionType.SET_PROVIDER, payload: signer });
        sign()
    },[signer,connectWallet])

    const onClick = async () =>{
        try{
            localStorage.setItem(SELECT_WALLET, 'METAMASK');
            clearStorage();
            disconnect();
            // store.dispatch(saveLoading(true));
            await open();
            setConnectWallet(true);
        }catch (e) {
            console.error("connect",e)
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
            callback();
        }

    }

    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const sign = async() =>{
        if(!isConnected || !signer.provider)return;
        try{
            const eip55Addr = ethers.utils.getAddress(address);
            const {chainId} =  await signer.provider.getNetwork();
            let nonce = await getMyNonce(address);
            const siweMessage = createSiweMessage(eip55Addr, chainId, nonce, 'Welcome to SeeDAO!');
            setMsg(siweMessage)
            let signData = await signer.signMessage(siweMessage);
            setSignInfo(signData)
            setConnectWallet(false);
        }catch (e) {
            setConnectWallet(true);
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
            disconnect();
            console.error("sign error:",e)
            callback()
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/home');

    },[result])


    const LoginTo = async () =>{

        const { host} = window.AppConfig;
        let obj = {
            wallet: address,
            message: msg,
            signature: signInfo,
            domain: host,
            wallet_type: 'EOA',
            is_eip191_prefix: true,
        };
        try{
            let res = await requests.user.login(obj);
            setResult(res.data)

            const now = Date.now();
            res.data.token_exp = now + res.data.token_exp * 1000;
            dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

            // config permission authorizer
            const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
            await authorizer.setUser(address.toLowerCase());
            dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
            dispatch({ type: AppActionType.SET_WALLET_TYPE, payload:WalletType.EOA });
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
            ReactGA.event("login_success",{
                type: "metamask",
                account:"account:"+address
            });

        }catch (e){
            console.error("Login to",e)
            dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
            localStorage.removeItem(SEEDAO_USER_DATA);
            clearStorage();
            dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: null });
            dispatch({ type: AppActionType.SET_AUTHORIZER, payload: null });
            dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: null });
            disconnect();
            ReactGA.event("login_failed",{type: "metamask"});
        }
        finally {
            callback();
        }
    }

    useEffect(() => {
        onClick()
    }, []);

    return null;
}
