import {
    connectWithRedirect,
    connectCallback,
    signMessageWithRedirect,
    signMessageCallback,
} from "@joyid/evm";
import React, {useEffect} from "react";
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
import JoyIdImg from "../../assets/Imgs/home/JOYID.png";
import styled from "styled-components";
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

export default function Joyid(){

    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const JOY_ID_URL ="https://app.joy.id";

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
                joyidAppURL: `${JOY_ID_URL}/?prefer=login`,
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
            joyidAppURL: `${JOY_ID_URL}/?prefer=login`,
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
            dispatch({ type: AppActionType.SET_WALLET_TYPE, payload:WalletType.AA });
            dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });

            ReactGA.event("login_success",{
                type: "joyid",
                account:"account:"+account
            });
            try {
              await OneSignal.login(account.toLocaleLowerCase());
            } catch (error) {
              console.error('OneSignal login error', error);
            }
        }catch (e){
            console.error("LoginTo joyid",e)
            ReactGA.event("login_failed",{type: "joyid"});
        } finally {
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

        } catch (e) {
            let search = window.location.search;
            if (search && search.indexOf("Rejected") >= 0) {
                navigate('/home')
                return;
            }
            // onConnectRedirect()
        }

    }, []);

    return <WalletOption onClick={() => onConnectRedirect()}>
        <img src={JoyIdImg} alt=""/>
        <span>JoyID Passkey</span>

    </WalletOption>

}


