import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import ApplicationStatusTagNew from "./applicationStatusTagNew";
import { useNavigate, useParams } from "react-router-dom";
import BackerNav from "../../components/common/backNav";
import Page from "../../components/pagination";

import { formatTime } from "../../utils/time";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { getAuditList, getSBTlist, operateAudit } from "../../requests/cityHall";
import publicJs from "../../utils/publicJs";
import SbtModal from "./sbtModal";
import ConfirmModal from "../../components/modals/confirmModal";
import useToast, { ToastType } from "../../hooks/useToast";

const Box = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
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
    .approve,.reject{
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


  const {
    state:{
      sbtToken
    },
    dispatch,
  } = useAuthContext();

  const handleGoto = (url:string) =>{
    navigate(url);
  }
  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
     let rt = await getAuditList(sbtToken,page,pageSize,type!)
      const {page:pageNum,size,rows,total} = rt.data;
      setList(rows);
      setPage(pageNum);
      setTotal(total);
      setPageSize(size);

      console.log(rt.data);
    } catch (error) {
      logError('getCloseProjectApplications failed:', error);
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
      console.error(arr);
      setSbtList(arr);
    }catch(error){
      console.log(error);
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
    console.log(currentItem.ID);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{

      let rt = await operateAudit(sbtToken,currentItem.ID,operateType)
      console.log(rt);

      showToast(t('Msg.ApproveSuccess'), ToastType.Success);

    }catch(error){
      console.error(error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
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


  return <Box>
    {/*<TopLine>*/}
    {/*  <li>*/}
    {/*    <Button onClick={() => handleGoto("/sbt/create")} className="btn-com">*/}
    {/*      {t("city-hall.SendCompleted")}*/}
    {/*    </Button>*/}
    {/*  </li>*/}
    {/*  <li>*/}
    {/*    <ExportButton onClick={() => handleGoto("/sbt/apply")}>{t("Project.Export")}</ExportButton>*/}
    {/*  </li>*/}
    {/*</TopLine>*/}
    <BackerNav title={switchType()} to="/city-hall/governance" />
    {
      show &&    <SbtModal handleClose={handleClose} detail={detailDisplay}  />
    }
    {
      showConfirm &&     <ConfirmModal
        msg={operateType === "approve"?t('sbt.approveSBT'):t('sbt.rejectSBT')}
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
            <td>{publicJs.AddressToShow(item.applicant,5)}</td>
            <td>{publicJs.AddressToShow(item.approver,5)}</td>
            <td > <MoreButton onClick={() => handleDetail(item)}>{t('application.Detail')}</MoreButton></td>
            <td ><ApplicationStatusTagNew status={item.status} /></td>
            <td >
              {
                type === "pending" && <DistributeBox>
                <div className="approve" onClick={()=>handleShowModal("approve",item)}>{t("sbt.approve")}</div>
                <div className="reject" onClick={()=>handleShowModal("reject",item)}>{t("sbt.reject")}</div>

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
