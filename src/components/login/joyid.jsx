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
import styled from "styled-components";
import JoyIdImg from 'assets/images/wallet/joyid.png';


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
    const [account, setAccount] = useState();
    const [sig, setSig] = useState("");
    const [msg,setMsg] = useState();
    const [result,setResult] = useState(null);

    const AppConfig = {
        host: 'superapp.seedao.tech',
        origin: 'https://superapp.seedao.tech',
    }


    useEffect(() => {
        const redirectHome = () => {
            const _address = localStorage.getItem("joyid-address");
            if (_address) {
                setAccount(_address);
                return;
            }
            let state;
            try {
                state = connectCallback();
                if (state?.address) {
                    setAccount(state.address);
                    // store.dispatch(saveAccount(state.address))
                    localStorage.setItem("joyid-address", state.address);
                    return true;
                }
            } catch (error) {
                console.error("callback:", error);
                localStorage.removeItem("joyid-status")
            }
        };

        const redirectSignMessage = () => {
            let state;
            try {
                state = signMessageCallback();
                setSig(state.signature);
                return true;
            } catch (error) {
                console.error("callback sign:", error);
                localStorage.removeItem("joyid-status")
            }
        };
        redirectHome();
        redirectSignMessage();
    }, []);

    const buildRedirectUrl = (action) => {
        const url = new URL(`${window.location.origin}/home`);
        url.searchParams.set("action", action);
        return url.href;
    }

    useEffect(()=>{
        let action = localStorage.getItem("joyid-status")
        if(!account || action !== "login" ) return;
        onSignMessageRedirect()
    },[account])

    useEffect(()=>{
        if(!sig || !account) return;
        LoginTo()
    },[sig,account])


    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const onSignMessageRedirect = async() => {
        localStorage.setItem("joyid-status","sign")
        let nonce = await getMyNonce(account);
        const eip55Addr = ethers.utils.getAddress(account);

        const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
        setMsg(siweMessage)
        localStorage.setItem("joyid-msg",siweMessage)

        const url = buildRedirectUrl("sign-message");
        signMessageWithRedirect(url, siweMessage, account, {
            state: msg,
        });
    };


    const onConnectRedirect = () => {
        localStorage.setItem("joyid-status","login")
        const url = buildRedirectUrl("connect");
        connectWithRedirect(url, {
            rpcURL: "https://eth.llamarpc.com",
            network: {
                chainId: 1,
                name: "Ethereum Mainnet",
            },
        });

    };


    const LoginTo = async () =>{
        localStorage.setItem("joyid-status",null)
        const { host} = AppConfig;
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
            let rt = await requests.user.login(obj);
            // store.dispatch(saveUserToken(rt.data));
            // store.dispatch(saveWalletType("joyid"));
            ReactGA.event("login_success",{
                type: "joyid",
                account:"account:"+account
            });
            setResult(rt.data)
        }catch (e){
            console.error(e)
            ReactGA.event("login_failed",{type: "joyid"});
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/board');

    },[result])

    return <div>
        <WalletOption onClick={()=>onConnectRedirect()}>
            <span>JoyID</span>
            <span>
                <img src={JoyIdImg} alt="" width="28px" height="28px" />
              </span>
        </WalletOption>
    </div>
}


