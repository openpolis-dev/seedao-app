import {
    connectWithRedirect,
    connectCallback,
    signMessageWithRedirect,
    signMessageCallback,
} from "@joyid/evm";
import React, {useEffect, useState} from "react";
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
import JoyIdImg from "../../assets/images/wallet/joyid.png";
import styled from "styled-components";
import OneSignal from 'react-onesignal';


const WalletOption = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  padding: 10px 28px;
  border-radius: 8px;
  margin-block: 10px;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f1f1;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: #f5f5f5;
  }
  img {
    width: 28px;
    height: 28px;
  }
`;

export default function Joyid(){

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
        <span>JoyID</span>
        <span>
                    <img src={JoyIdImg} alt="" width="28px" height="28px" />
                  </span>
    </WalletOption>

}


