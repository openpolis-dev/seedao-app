import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import ApplicationStatusTagNew from "./applicationStatusTagNew";
import { useNavigate, useParams } from "react-router-dom";
import BackerNav from "../../components/common/backNav";
import Page from "../../components/pagination";
import { Button } from 'react-bootstrap';

import { formatTime } from "../../utils/time";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { distribute, getAuditList, getSBTlist, operateAudit } from "../../requests/cityHall";
import publicJs from "../../utils/publicJs";
import SbtModal from "./sbtModal";
import ConfirmModal from "../../components/modals/confirmModal";
import useToast, { ToastType } from "../../hooks/useToast";
import { ethers } from "ethers";
import SBTabi from "../../assets/abi/SBT.json";
import {BookmarkCheck,BookmarkX} from "lucide-react"
import { IUser } from "../../type/user.type";
import useQuerySNS from "../../hooks/useQuerySNS";
import getConfig from "../../utils/envCofnig";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { amoy } from 'utils/chain';
import CopyBox from "../../components/copy";
import CopyIconSVG from "../../assets/Imgs/copy.svg";
import { isNotOnline } from "../../utils";

type UserMap = { [w: string]: IUser };

const Box = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
    button{
        padding: 5px 20px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .lineFlex{
        display: flex;
        align-items: center;
        gap: 5px;
    }
`;


const TopLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 16px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;

const MoreButton = styled.div`
    padding-inline: 26px;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    display: inline-block;
    background: var(--bs-box--background);
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--bs-border-color);
    font-size: 14px;
`;

const FlexLine = styled.div`
  display: flex;
    align-items: center;
    gap:10px;
    img{
        width: 50px;
        height: 50px;
        object-fit: cover;
        object-position: center;
    }
`

const DistributeBox = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    &>div{
        color: #fff;
        padding: 3px 10px;
        font-size: 12px;
        border-radius: 4px;
    }
    .approve{
        background: #5200FF;
    }
    .reject{
        background: #FF7193;
  
    }
    .success{
        background: #1f9e14;
    }
`



export default function SbtList(){
  const { t } = useTranslation();
  const[list,setList]= useState([]);
  const navigate = useNavigate();
  const {type} = useParams();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [detailDisplay, setDetailDisplay] = useState<string[]>([]);
  const [sbtList, setSbtList] = useState<any[]>([]);
  const [ show,setShow] = useState(false);
  const [showConfirm,setShowConfirm] = useState(false);
  const [operateType, setOperateType] = useState<string>("");
  const [currentItem,setCurrentItem] = useState<any>(null);
  const { showToast } = useToast();
  const [userMap, setUserMap] = useState<UserMap>({});
  const { getMultiSNS } = useQuerySNS();
  const [snsMap,setSnsMap] = useState<any>(null);

  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const {
    state:{
      sbtToken,account
    },
    dispatch,
  } = useAuthContext();

  const handleGoto = (url:string) =>{
    navigate(url);
  }

  useEffect(() => {
    if(isNotOnline()){
      if (chain && switchNetwork && chain?.id !== amoy.id) {
        switchNetwork(amoy.id);
        return;
      }
    }



  }, []);


  useEffect(() => {

    getSns()
  }, [userMap,list]);

  const getSns = async ()=>{

    const _wallets: string[] = [];
    Object.keys(userMap).forEach((key) => {
      if (userMap[key]) {
        _wallets.push(key);
      }
    });
    const wallets = Array.from(new Set(_wallets));

    let snsMap = await getMultiSNS(wallets);
    setSnsMap(snsMap)


  }
  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
     let rt = await getAuditList(sbtToken,page,pageSize,type!)
      const {page:pageNum,size,rows,total} = rt.data;
      const userData: UserMap = {};

      rows.forEach((r:any) => {
        userData[(r.applicant || '').toLowerCase()] = r;
        userData[(r.approver || '').toLowerCase()] = r;
      });

      setUserMap(userData);

      setList(rows);
      setPage(pageNum);
      setTotal(total);
      setPageSize(size);
    } catch (error:any) {
      logError('getCloseProjectApplications failed:', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };


  useEffect(() => {
    if(!sbtToken)return;
    getNftList()
  }, [sbtToken]);

  const getNftList = async () =>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const rt = await getSBTlist(sbtToken)
      let arr = [];

      for (let i = 0; i < rt.data.length; i++) {
        let item = rt.data[i];
        const imageUrl = await publicJs.getImage(item.nft_image);
        item.image = imageUrl;
        arr.push(item)
      }
      setSbtList(arr);
    }catch(error:any){
      console.log(error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }

  useEffect(() => {
    if(!sbtToken || !type)return;
    getRecords();
  }, [page, pageSize,sbtToken,type]);

  const switchType = () =>{
    let str
    switch (type){
      case "pending":
       str = t('sbt.Audit');
        break;
      case "approved":
       str = t('sbt.Grant');
        break;
      case "minted":
       str = t('sbt.history');
        break;
        case "rejected":
       str = t('sbt.rejected');
        break;
      default:
        str = "";
        break;
    }
    return str;
  }

  const handlePage = (num: number) => {
    setPage(num);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const returnImg = (item:any) =>{

    if(!sbtList.length)return;

    const sbtItem = sbtList.find((sbt:any) => sbt.nft_id == item.nft_id && sbt.organization_contract_id == item.organization_contract_id&& sbt.organization_id == item.organization_id );

    return <FlexLine>
                <img src={sbtItem?.image} alt="" />
                <span>{sbtItem?.nft_name}</span>
              </FlexLine>
  }

  const handleClose= () =>{
    setShow(false);
  }

  const handleDetail = (item:any) =>{
    const arr = item.receivers.split(",");
    setDetailDisplay(arr)
    setShow(true);
  }

  const handleOperate = async() =>{
    if(!sbtToken || !operateType || !currentItem)return;
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{

      if(operateType === "approve" || operateType === "reject" ){
        if(currentItem.applicant.toLowerCase() === account!.toLowerCase()){
          showToast(t('sbt.tips'), ToastType.Danger);
          return;
        }

        await operateAudit(sbtToken,currentItem.ID,operateType)
      }else if(operateType === "distribute"){
        const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);

        const signer = web3Provider.getSigner()
        const contract = new ethers.Contract(currentItem.nft_contract_address, SBTabi, signer);
        const {receivers,nft_id} = currentItem;
        const receiversArr = receivers.split(",");
        const result = await contract.mintToBatchAddress(receiversArr,nft_id,1,"0x");

        const receipt = await result.wait();

        console.log("receipt",receipt);
        await distribute(sbtToken,currentItem.ID,result.hash)
      }
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);

      setTimeout(()=>{
        getRecords()
      },1500)

    }catch(error:any){
      let e = JSON.parse(JSON.stringify(error))
      showToast(error?.response?.data?.msg || e?.message || e?.reason || t('Msg.ApproveFailed'), ToastType.Danger);
    }finally {
      setShowConfirm(false);
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }

  }

  const handleShowModal = (typeStr:string,item:any) =>{
    setOperateType(typeStr)
    setShowConfirm(true)
    setCurrentItem(item)
  }

  const returnTips = () =>{
    let str =""
     switch(operateType){
       case "approve":
         str= t('sbt.approveSBT')
         break;
       case "reject":
         str= t('sbt.rejectSBT')
         break;
       case "distribute":
         str= t('sbt.distributeSBT')
           break;
     }

     return str
  }

  const returnSns = (str:string) =>{
    if( snsMap?.get(str?.toLowerCase())?.endsWith(".seedao")){
      return  snsMap?.get(str?.toLowerCase())
    }else{
      return  publicJs.AddressToShow(str,5)
    }

  }


  return <Box>

    <BackerNav title={switchType()} to="/city-hall/governance" />

    {
      (type === "rejected" || type === "minted") &&  <TopLine>

        <li>
          <Button variant={type === "minted"?"primary":"outline-primary"} onClick={() => handleGoto("/sbt/list/minted")} className="btn-com">
            <BookmarkCheck size={17} />
            {t("sbt.minted")}
          </Button>
        </li>
        <li>
          <Button variant={type === "rejected"?"primary":"outline-primary"}  onClick={() => handleGoto("/sbt/list/rejected")} className="btn-com">
            <BookmarkX size={17} />
            {t("sbt.rejected")}
          </Button>
        </li>
      </TopLine>
    }

    {
      show && <SbtModal handleClose={handleClose} detail={detailDisplay} />
    }
    {
      showConfirm && <ConfirmModal
        msg={returnTips()}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleOperate}
      />
    }

    <table className="table" cellPadding="0" cellSpacing="0">
      <thead>
      <tr>
        <th>SBT</th>
        <th>{t("sbt.createAt")}</th>
        <th >{t("sbt.applicant")}</th>
        <th >{t("sbt.Auditor")}</th>
        <th>{t("sbt.receivers")}</th>
        {
          type === "minted" && <th>Tx Hash</th>
        }

        <th>{t("sbt.status")}</th>
        <th></th>
      </tr>
      </thead>

      <tbody>
      {list.map((item:any,index) => (
          <tr key={index}>
            <td>
              {returnImg(item)}
            </td>
            <td>{formatTime(item.CreatedAt)}</td>
            <td>{returnSns(item?.applicant)}</td>
            <td>{returnSns(item?.approver)}</td>
            <td > <MoreButton onClick={() => handleDetail(item)}>{t('application.Detail')}</MoreButton></td>
            {
              type === "minted" && <td>
              <div className="lineFlex">
                {publicJs.AddressToShow(item.mint_tx_hash, 4)} <CopyBox text={item.mint_tx_hash} dir="right">
                <img src={CopyIconSVG} alt="" />
              </CopyBox>
              </div>
          </td>
            }
            <td ><ApplicationStatusTagNew status={item.status} /></td>
            <td >
              {
                type === "pending" && <DistributeBox>
                <div className="approve" onClick={()=>handleShowModal("approve",item)}>{t("sbt.approve")}</div>
                <div className="reject" onClick={()=>handleShowModal("reject",item)}>{t("sbt.reject")}</div>

                </DistributeBox>
              }

              {
                type === "approved" && <DistributeBox>
                  <div className="success" onClick={()=>handleShowModal("distribute",item)}>发放</div>
                </DistributeBox>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div>
      <Page
        itemsPerPage={pageSize}
        total={total}
        current={page}
        handleToPage={handlePage}
        handlePageSize={handlePageSize}
      />
    </div>
  </Box>
}
