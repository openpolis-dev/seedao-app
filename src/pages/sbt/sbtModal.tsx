import styled from "styled-components";
import BasicModal from "../../components/modals/basicModal";
import { useTranslation } from "react-i18next";
import { IApplicationDisplay } from "../../type/application.type";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastType } from "../../hooks/useToast";
import sns from "@seedao/sns-js";

import { AppActionType, useAuthContext } from "../../providers/authProvider";
import LoadingImg from "../../assets/Imgs/loading.png";
import getConfig from "../../utils/envCofnig";
import PublicJs from "../../utils/publicJs";


const ContentBox = styled.ul`
  //background: var(--bs-body-bg);
  //  padding: 20px;
  //  border-radius: 10px;
  //  width: 500px;
    height: 300px;
    width: 450px;
    overflow-y: auto;
    li{
        margin-bottom: 10px;
        border-bottom: 1px solid var(--bs-border-color);
        padding-bottom: 10px;
        color: var( --menu-color);
    }
`

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  img {
    user-select: none;
    width: 40px;
    height: 40px;
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface Iprops {
  handleClose: () => void;
  detail: string[]
}


export default function SbtModal({handleClose,detail}:Iprops){
  const { t } = useTranslation();
  const [loading,setLoading] = useState(false);

  const [address,setAddress] = useState<string[]>([]);

  useEffect(() => {
    getAddress()
  },[])

  const getAddress = async() =>{

    const to_be_address:any[] = [];
    detail.forEach((item) => {
      const str = item.trim();
      if (str && ethers.utils.isAddress(str)) {
        to_be_address.push(str);
      }
    });
    setLoading(true)
    try{
      const unique_list = Array.from(new Set(to_be_address));

      // let result = await sns.names(unique_list,getConfig().NETWORK.rpcs[0])
      const result = await PublicJs.splitWallets(unique_list);
      const arr = (result as any).filter((item:any)=>item.indexOf("seedao")>-1)
      setAddress(arr);
    }catch(error){
      console.error(error);
    }finally {
      setLoading(false)
    }
  }

  return <BasicModal handleClose={handleClose} title={t("sbt.receivers")}>
    <ContentBox>
      {
        loading &&     <Box>
          <img src={LoadingImg} alt="" />
        </Box>
      }
      {
        address.map((item,index)=> (<li key={index}>{item}</li>))
      }


    </ContentBox>
  </BasicModal>
}
