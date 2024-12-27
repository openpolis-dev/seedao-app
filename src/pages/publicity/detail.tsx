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
import { Trans, useTranslation } from "react-i18next";
import defaultImg from "../../assets/Imgs/defaultAvatar.png";
import ProfileComponent from "../../profile-components/profile";
import publicJs from "../../utils/publicJs";
import useQuerySNS from "../../hooks/useQuerySNS";


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
    display: flex;
    align-items: center;
    margin-top: 10px;
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

const CardStyle = styled.div`
  font-size: 14px;
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  border-radius: 8px !important;
  padding: 32px;
`;

const BlockTab = styled.ul`


    //cursor: pointer;
    color: var(--bs-body-color_active);
    //&:hover {
    //  background-color: var(--bs-menu-hover);
    //}
    .action-content {
        flex: 1;
        padding-bottom: 10px;
        //border-bottom: 1px solid var(--bs-border-color);
        display: flex;
        align-items: center;
        gap: 4px;
    }
`;

const Aciton = styled.li`
  display: flex;
  gap: 16px;
  align-items: center;
  //cursor: pointer;
  color: var(--bs-body-color_active);
  //&:hover {
  //  background-color: var(--bs-menu-hover);
  //}
  .action-content {
    flex: 1;
    padding-bottom: 10px;
    //border-bottom: 1px solid var(--bs-border-color);
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const TitleBlock = styled.span`
  color: #2f8fff;
`;

const TitleBlock2 = styled.span`
    //color: var(--sns-font-color);
    opacity: 0.6;

`;

const TagBox = styled.div`
  margin-top: 10px;
    font-size: 14px;
    background: rgb(36, 175, 255);
    color: #fff;
    display: inline-block;
    padding: 3px 5px;
    border-radius: 4px;
`




export default function DetailPublicity(){
  const navigate = useNavigate();
  const { t} = useTranslation();
  const [detail, setDetail] = useState<any>({});
  const [log, setLog] = useState<any[]>([]);
  const [snsName,setSnsName] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const { getMultiSNS } = useQuerySNS();

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

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
      let rt= await getPublicityDetail(id!);
      setDetail(rt.data.Detail)
      setLog(rt.data.Log)
      handleSNS(rt.data.Log.filter((d:any) => !!d.eidtor).map((d:any) => d.eidtor));
      getSnS(rt.data.Detail.creator.toLowerCase())
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

  const formatSNS = (wl: string) => {
    const wallet = wl.toLowerCase();
    const name = snsMap.get(wallet) || wallet;
    console.log(snsMap)
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };


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
           title={ t('Home.information')}
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
       <div>
         <TagBox>
           S{detail?.season}{t("city-hall.CityHallMembers")}
         </TagBox>

       </div>
       <InfoBox>
         <UserBox onClick={() => handleProfile()}>
           <img src={detail?.avatar ? detail?.avatar : defaultImg} alt="" />
           <span className="name">{snsName}</span>
         </UserBox>
         {detail?.updateAt && <div className="date">{formatTime(detail?.updateAt * 1000)}</div>}
       </InfoBox>
     </ThreadHead>

     <ContentOuter>
       <PushItemContent>
         <MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail.content || ''} />
       </PushItemContent>
     </ContentOuter>

     <CardStyle>
       <BlockTab>
         {log.map((item, index) => (
           <Aciton key={index}>
             <div className="action-content">
               <TitleBlock>{formatSNS(item?.eidtor)}</TitleBlock>
               <div>
                 <Trans
                   //@ts-ignore
                   i18nKey={item?.isCreate ? 'city-hall.HistoryCreate' : 'city-hall.HistoryEdit'}
                   values={{ title: detail?.title, time: formatTime(item?.updateAt * 1000) }}
                   components={{
                     title: <TitleBlock2 />,
                   }}
                 />
               </div>
             </div>
           </Aciton>
         ))}
       </BlockTab>
     </CardStyle>

   </Page>;
}
