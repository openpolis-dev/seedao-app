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
import { useNavigate, useParams } from "react-router-dom";
import { ContainerPadding } from "../../assets/styles/global";
import BackerNav from "../../components/common/backNav";
import { useTranslation } from "react-i18next";
import defaultImg from "../../assets/Imgs/defaultAvatar.png";
import ProfileComponent from "../../profile-components/profile";


const Page = styled.div`
  ${ContainerPadding};
`;

const FixedBox = styled.div`
  background-color: var(--bs-box-background);
  position: sticky;
  margin: -24px 0 0 -32px;
  width: calc(100% + 64px);
  top: 0;
  height: 64px;
  z-index: 95;
  box-sizing: border-box;
  box-shadow: var(--proposal-box-shadow);
  border-top: 1px solid var(--bs-border-color);
  svg {
  }
`;

const FlexInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 100%;
`;

const ThreadHead = styled.div`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-bottom: 24px;
  padding: 16px 32px;
  border-radius: 8px;
  margin-top: 24px;
  .title {
    font-size: 24px;
    font-family: 'Poppins-Bold';
    color: var(--bs-body-color_active);
    line-height: 30px;
    letter-spacing: 0.12px;
  }
`;

const InfoBox = styled.div`
  gap: 16px;
    margin-top: 20px;
  .date {
    font-size: 12px;
  }
`;

const UserBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }

  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
    cursor: default;
  }
`;

const ContentOuter = styled.div`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-bottom: 24px;
  border-radius: 8px;
`;




const ClipStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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



export default function DetailPublicity(){
  const navigate = useNavigate();
  const { t} = useTranslation();
  const [detail, setDetail] = useState<any>({});
  const [snsName,setSnsName] = useState<string>();
  const [showModal, setShowModal] = useState(false);

  const {
    state: { theme },
    dispatch,
  } = useAuthContext();
  const { id } = useParams();

  useEffect(() => {
    if(!id)return;
    getEdit()
  }, [id]);

  const getEdit = async()=>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      let rt = await getPublicityDetail(id!);
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

  const handleProfile = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };


   return <Page>

     {showModal && <ProfileComponent address={detail?.creator} theme={theme} handleClose={handleClose} />}
     <FixedBox>
       <FlexInner>
         <BackerNav
           title={ t('city-hall.Publicity')}
           to=""
           onClick={() => navigate(-1)}
           mb="0"
         />
       </FlexInner>
     </FixedBox>
     <ThreadHead>
       <div className="title">
           {detail?.title}
       </div>
       <InfoBox>
         <UserBox onClick={() => handleProfile()}>
           <span className="name">{snsName}</span>
         </UserBox>
         {detail?.createAt && <div className="date">{formatTime(detail?.createAt * 1000)}</div>}
       </InfoBox>
     </ThreadHead>

     <ContentOuter>
       <PushItemContent>
         <MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail.content || ''} />
       </PushItemContent>
     </ContentOuter>
=

   </Page>;
}
