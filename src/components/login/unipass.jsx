import { UniPassProvider } from "@unipasswallet/ethereum-provider";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import {createSiweMessage} from "../../utils/sign";
import {useNavigate} from "react-router-dom";
import ReactGA from "react-ga4";
import styled from "styled-components";
import UnipassIcon from 'assets/images/wallet/unipass.svg';
import requests from "../../requests";

const upProvider = new UniPassProvider({
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

export default function Unipass(){
    const navigate = useNavigate();
    const [addr,setAddr] = useState();
    const [provider,setProvider] = useState();
    const [msg,setMsg] = useState(null);
    const [signInfo,setSignInfo] = useState();
    const [result,setResult] = useState(null);
    const AppConfig = {
        host: 'superapp.seedao.tech',
        origin: 'https://superapp.seedao.tech',
    }


    const getP = async() =>{
        try{

            await upProvider.connect();
            const provider = new ethers.providers.Web3Provider(upProvider, "any");
            setProvider(provider);
        }catch (e){
            console.error(e)
        }


    }

    useEffect(()=>{
        if(!provider)return;
        connect();
    },[provider])

    const connect = async() =>{

        try{
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAddr(address)
            // store.dispatch(saveAccount(address))
        }catch (e) {
            console.error(e)
        }
    }


    useEffect(()=>{

        if(!addr) return;
        signMessage()
    },[addr])


    const getMyNonce = async(wallet) =>{
        let rt = await requests.user.getNonce(wallet);
        return rt.data.nonce;
    }

    const signMessage = async() =>{
        try{
            let nonce = await getMyNonce(addr);
            const eip55Addr = ethers.utils.getAddress(addr);

            const siweMessage = createSiweMessage(eip55Addr, 1, nonce, 'Welcome to SeeDAO!');
            setMsg(siweMessage)
            const signer = provider.getSigner();
            let res = await signer.signMessage(siweMessage);
            setSignInfo(res)


        }catch (e) {
            console.error(e)
            // store.dispatch(saveAccount(null))
            setAddr(null)
            await upProvider.disconnect();
        }

    }

    useEffect(()=>{
        if(!signInfo) return;
        LoginTo()
    },[signInfo])


    const LoginTo = async () =>{


        const { host} = AppConfig;
        let obj = {
            wallet: addr,
            message: msg,
            signature: signInfo,
            domain: host,
            wallet_type: 'AA',
            is_eip191_prefix: true
        };
        try{
            let rt = await requests.user.login(obj);
            // store.dispatch(saveUserToken(rt.data));
            // store.dispatch(saveWalletType("unipass"));
            setResult(rt.data)
            ReactGA.event("login_success",{
                type: "unipass",
                account:"account:"+addr
            });
        }catch (e){
            console.error(e)
            ReactGA.event("login_failed",{type: "unipass"});
        }

    }

    useEffect(()=>{
        if(!result)return;
        navigate('/home');

    },[result])

    return <div>
        <WalletOption  onClick={()=>getP()}>
            <span>Unipass</span>
            <span>
                <img src={UnipassIcon} alt="" width="28px" height="28px" />
              </span>
        </WalletOption>
    </div>
}
