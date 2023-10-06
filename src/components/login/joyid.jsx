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

export default function Joyid(){

    const navigate = useNavigate();
    const [account, setAccount] = useState();
    const [sig, setSig] = useState("");
    const [msg,setMsg] = useState();
    const [result,setResult] = useState(null);
    const { dispatch } = useAuthContext();

    useEffect(() => {

        console.log("%c fdsafdafd","color:#f0f");
        const redirectHome = () => {

            const _address = localStorage.getItem("joyid-address");
            const provider =   new ethers.providers.StaticJsonRpcProvider('https://eth.llamarpc.com');
            dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
            localStorage.setItem(SELECT_WALLET, 'JOYID');
            if (_address) {
                setAccount(_address);


                dispatch({ type: AppActionType.SET_ACCOUNT, payload: _address });
                return;
            }
            let state;
            try {
                state = connectCallback();
                if (state?.address) {
                    setAccount(state.address);
                    // store.dispatch(saveAccount(state.address))
                    dispatch({ type: AppActionType.SET_ACCOUNT, payload: state.address });
                    localStorage.setItem("joyid-address", state.address);
                    return true;
                }
            } catch (error) {
                console.log("callback:", error);
                localStorage.removeItem("joyid-status")
            }
        };

        const redirectSignMessage = () => {
            let state;
            try {
                state = signMessageCallback();
                console.log("===signMessageCallback===",state)
                setSig(state.signature);
                return true;
            } catch (error) {
                console.log("callback sign:", error);
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
        console.error(sig,account)
        if(!sig || !account) return;
        LoginTo()
    },[sig,account])


    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const onSignMessageRedirect = async() => {
        try{
            localStorage.removeItem("joyid-msg")
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
        }catch (e) {
            localStorage.removeItem("joyid-status");
            localStorage.removeItem("joyid-msg");
            localStorage.removeItem("joyid-address");
            localStorage.removeItem("select_wallet");
            localStorage.removeItem("select_wallet");
            window.location.reload();
        }

    };


    const onConnectRedirect = () => {
        localStorage.setItem(SELECT_WALLET, 'JOYID');
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
        const { host} = window.AppConfig;
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
            // store.dispatch(saveUserToken(rt.data));
            // store.dispatch(saveWalletType("joyid"));

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
            setResult(res.data)
        }catch (e){
            console.error("LoginTo joyid",e)
            ReactGA.event("login_failed",{type: "joyid"});
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/home');

    },[result])

    let action = localStorage.getItem("joyid-status")
    let qr = window.location.search;
    useEffect(() => {
        if(!action && !account && qr.indexOf("Rejected") === -1){
            onConnectRedirect()
        }

    }, [action,account,qr]);


    return null
}


