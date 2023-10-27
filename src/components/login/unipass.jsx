import { UniPassProvider } from "@unipasswallet/ethereum-provider";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import {createSiweMessage} from "../../utils/sign";
import {useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import requests from "../../requests";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { Authorizer } from "casbin.js";
import { readPermissionUrl } from "../../requests/user";
import { WalletType } from "../../wallet/wallet";
import { SELECT_WALLET } from "../../utils/constant";
import { clearStorage } from "../../utils/auth";

import styled from "styled-components";
import UnipassIcon from "../../assets/images/wallet/unipass.svg";
import OneSignal from 'react-onesignal';

const WalletOption = styled.li`
    display: flex;
    align-items: center;
    padding: 14px 28px;
    border-radius: 16px;
    margin-bottom: 16px;
    cursor: pointer;
    background:  var(--home-right);
    color: var(--bs-body-color_active);
    font-family: 'Poppins-SemiBold';
    font-weight: 600;
    font-size: 16px;
    &:hover {
        background-color: var(--home-right_hover);
    }
    img {
        width:32px;
        height: 32px;
        margin-right: 20px;
    }
`;

export const upProvider = new UniPassProvider({
    chainId: 1,
    returnEmail: false,
    appSetting: {
        appName: 'test dapp',
        appIcon: 'your icon url',
    },
    rpcUrls: {
        mainnet: "https://eth.llamarpc.com",
        // polygon: "https://polygon.llamarpc.com",
        // bscTestnet:"https://data-seed-prebsc-1-s1.binance.org:8545"
    },
});


export default function Unipass(){
    const navigate = useNavigate();
    const [msg,setMsg] = useState(null);
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);
    const [provider, setProvider] = useState()
    const [account, setAccount] = useState()
    const { dispatch } = useAuthContext();

    const getP = async() =>{
        try{
            localStorage.setItem(SELECT_WALLET, 'UNIPASS');
            await upProvider.disconnect();
            await upProvider.connect();
            const provider = new ethers.providers.Web3Provider(upProvider, "any");
            setProvider(provider)
        }catch (e){
            console.error("get Provider",e)
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
        }
    }

    useEffect(()=>{
        if(provider){
            connect();
        }
    },[provider])

    const connect = async() =>{
        try{

            clearStorage();
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address)
            await signMessage(address)
            // setAddr(address)
        }catch (e) {
            console.error("connect",e)
        }
    }

    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const signMessage = async(account) =>{
        try{
            console.log("signMessage", account)
            let nonce = await getMyNonce(account);
            const eip55Addr = ethers.utils.getAddress(account);
            console.error(eip55Addr)

            const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
            setMsg(siweMessage)
            console.log("siweMessage", siweMessage)
            const signer = provider.getSigner();
            let res = await signer.signMessage(siweMessage);
            setSignInfo(res)
        }catch (e) {
            console.error("signMessage",e)
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
            // setAddr(null)
            await upProvider.disconnect();
        }

    }

    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])


    const LoginTo = async () =>{


        const { host} = window.AppConfig;
        let obj = {
            wallet: account,
            message: msg,
            signature: signInfo,
            domain: host,
            wallet_type: WalletType.AA,
            is_eip191_prefix: true
        };
        try{
            let res = await requests.user.login(obj);
            console.log("LoginTo", res)
            setResult(res.data)
            dispatch({ type: AppActionType.SET_ACCOUNT, payload: account })

            const now = Date.now();
            res.data.token_exp = now + res.data.token_exp * 1000;
            dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });
            dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
            const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
            await authorizer.setUser(account.toLowerCase());
            dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
            dispatch({ type: AppActionType.SET_WALLET_TYPE, payload:WalletType.AA });
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
            ReactGA.event("login_success",{
                type: "unipass",
                account:"account:"+account
            });
            try {
              await OneSignal.login(account.toLocaleLowerCase());
            } catch (error) {
              console.error('OneSignal login error', error);
            }
        }catch (e){
            console.error(e)
            ReactGA.event("login_failed",{type: "unipass"});
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/home');

    },[result])


    return <WalletOption onClick={() => getP()}>
        <img src={UnipassIcon} alt=""/>
        <span>Unipass</span>
    </WalletOption>

}
