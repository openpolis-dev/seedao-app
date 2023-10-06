import {
    connectWithRedirect,
    connectCallback,
    signMessageWithRedirect,
    signMessageCallback,
} from "@joyid/evm";
import  {useEffect, useState} from "react";
import {ethers} from "ethers";
import {createSiweMessage} from "../../utils/sign";
import {useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import requests from "../../requests";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { Authorizer } from "casbin.js";
import { readPermissionUrl } from "../../requests/user";
import { WalletType } from "../../wallet/wallet";
import { SELECT_WALLET } from "../../utils/constant";

export default function Joyid({callback}){

    const navigate = useNavigate();
    const { dispatch } = useAuthContext();


    const buildRedirectUrl = (action) => {
        const url = new URL(`${window.location.origin}/home`);
        url.searchParams.set("action", action);
        return url.href;
    }

    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const onSignMessageRedirect = async(account) => {
        try{
            console.log("onSignMessageRedirect", account)
            let nonce = await getMyNonce(account);
            const eip55Addr = ethers.utils.getAddress(account);

            const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
            localStorage.setItem("joyid-msg",siweMessage)

            const url = buildRedirectUrl("sign-message");
            signMessageWithRedirect(url, siweMessage, account, {
                state: siweMessage,
            });
        }catch (e) {
            console.log("onSignMessageRedirect", e)
        }

    };


    const onConnectRedirect = () => {
        localStorage.setItem(SELECT_WALLET, 'JOYID');
        const url = buildRedirectUrl("connect");
        connectWithRedirect(url, {
            rpcURL: "https://eth.llamarpc.com",
            network: {
                chainId: 1,
                name: "Ethereum Mainnet",
            },
        });


    };


    const LoginTo = async (sig) =>{
        console.log("LoginTo", sig)
        // localStorage.setItem("joyid-status",null)
        const { host} = window.AppConfig;
        const account = localStorage.getItem("joyid-address");
        let ms =  localStorage.getItem("joyid-msg")
        let obj = {
            wallet: account,
            message: ms,
            signature: sig,
            domain: host,
            wallet_type: 'EOA',
            is_eip191_prefix: true
        };
        try{
            let res = await requests.user.login(obj);
            console.log("loginTo res", res)
            dispatch({ type: AppActionType.SET_ACCOUNT, payload: account })


            const now = Date.now();
            res.data.token_exp = now + res.data.token_exp * 1000;
            dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

            // config permission authorizer
            const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
            await authorizer.setUser(account.toLowerCase());
            dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
            dispatch({ type: AppActionType.SET_WALLET_TYPE, payload:WalletType.EOA });
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });

            ReactGA.event("login_success",{
                type: "joyid",
                account:"account:"+account
            });

        }catch (e){
            console.error("LoginTo joyid",e)
            ReactGA.event("login_failed",{type: "joyid"});
        } finally {
            callback()
            navigate('/home')
        }
    }

    useEffect(() => {
        try {
            let connectState = connectCallback();
            console.log("connect" + connectState.address)
            if (connectState.address) {
                localStorage.setItem("joyid-address", connectState.address);
                onSignMessageRedirect(connectState.address)
                return
            }
            let signState = signMessageCallback()
            console.log("sign", signState)
            if (signState.signature) {
                LoginTo(signState.signature)
                return;
            }

            navigate('/home')
            callback()

        } catch (e) {
            let search = window.location.search;
            if (search && search.indexOf("Rejected") >= 0) {
                navigate('/home')
                callback()
                return;
            }
            onConnectRedirect()
        }

    }, []);

    return null
}


