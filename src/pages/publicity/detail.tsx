import styled, { css } from "styled-components";
import BasicModal from "../../components/modals/basicModal";
import { IPushDisplay } from "../../type/push.type";
import React, { useEffect, useState } from "react";
import { getPublicityDetail } from "../../requests/publicity";
import { formatTime } from "../../utils/time";
import sns from "@seedao/sns-js";
import getConfig from "../../utils/envCofnig";
import { MdPreview } from "md-editor-rt";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
export const PushItemBottomLeft = styled.div`
  .name {
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;


const PushModal = styled(BasicModal)`
  padding: 0;
  width: 480px;
`;

export const PushItemTop = styled.div`
  padding: 16px 24px;
`;

const ClipStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const PushItemTitle = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  line-height: 22px;
  &.clip {
    ${ClipStyle}
  }
`;

export const PushItemContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--bs-body-color);
  margin-block: 8px;
  &.clip {
    ${ClipStyle}
  }
`;

export const PushItemBottom = styled.div`
  border-top: 1px solid var(--bs-border-color);
  display: flex;
  justify-content: space-between;
  padding-block: 9px;
  margin-inline: 24px;
  align-items: center;
`;

interface IProps {
  handleClose: () => void;
  id:number
}

export default function DetailModal({handleClose,id}: IProps){

  const [detail, setDetail] = useState<any>({});
  const [snsName,setSnsName] = useState<string>();
  const {
    state: { theme },
    dispatch,
  } = useAuthContext();


  useEffect(() => {
    if(!id)return;
    getEdit()
  }, [id]);

  const getEdit = async()=>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      let rt = await getPublicityDetail(id);
      setDetail(rt.data)
      getSnS(rt.data.creator.toLowerCase())
    }catch(error){
      console.error(error)
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }

  }

  const getSnS = async(account:string) =>{
    let rt = await sns.name(account,getConfig().NETWORK.rpcs[0])
    setSnsName(rt)
  }


   return <PushModal handleClose={handleClose}>
     <PushItemTop>
       <PushItemTitle>{detail?.title}</PushItemTitle>

       <PushItemContent>
         <MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail.content || ''} />
       </PushItemContent>

     </PushItemTop>
     <PushItemBottom>
       <PushItemBottomLeft>
         <div className="name">{snsName || detail?.creator}</div>
         <div className="date">{formatTime(detail?.createAt * 1000)}</div>
       </PushItemBottomLeft>
     </PushItemBottom>
   </PushModal>;
}
