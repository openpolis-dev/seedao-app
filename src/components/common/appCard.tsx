import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WindowPlus } from 'react-bootstrap-icons';
import DefaultImg from '../../assets/Imgs/dark/default.png';
import DefaultImgLight from '../../assets/Imgs/light/default.png';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import AddImg from '../../assets/Imgs/dark/addWhite.svg';
import AddImgLight from '../../assets/Imgs/light/add.svg';
import LinkImg from '../../assets/Imgs/link.svg';
import React from 'react';
import { loginChat } from "../../requests/chatAI";
import useToast, { ToastType } from "../../hooks/useToast";

const AppCard = ({
  icon,
  name,
  link,
  Nolink,
  id,
  desc,
  hiddenFields,
  handleShow,
 disabled
}: {
  icon?: any;
  name: string;
  link: string;
  id: string;
  Nolink?: boolean;
  desc?: string;
  disabled?: boolean;
  hiddenFields?: string[];
  handleShow?: (arg0: string) => void;
}) => {
  const navigate = useNavigate();
  const {
    state: { theme, userData,account },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const {  showToast } = useToast();

  const getApiKey = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      let rt = await loginChat();
      console.log(rt.data.apiKey)
      navigate(link)
    }catch(error:any){
      console.log(error);
      showToast(`${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }finally{
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }
  const handleClickEvent = async () => {
    if (id === 'coming-soon' || (disabled && id==='module-sbt')) {
      return;
    } else if (id.startsWith('module-')) {
      if(id === "module-ai"){
        if(account){
          await getApiKey()
        }else{
          showToast(t("Credit.CardLogin"), ToastType.Danger);
        }

      }else{
        navigate(link);
      }
    } else if (id.startsWith('resource-')) {
      if ((hiddenFields && hiddenFields?.length && userData) || !(hiddenFields && hiddenFields?.length)) {
        const url = link.split('https://tally.so/r/')[1];
        // navigate(`/resources/detail/${url}`);
        handleShow && handleShow(url);
      } else {
        dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      }
    } else {
      window.open(link, '_blank');
    }
  };
  return (
    <AppCardStyle className={disabled && id==='module-sbt'?"disabled boxApp":"boxApp"} onClick={handleClickEvent} Nolink={Nolink?.toString()}>
      <div className="iconBox">
        <img src={icon ? icon : theme ? DefaultImg : DefaultImgLight} alt="" />
        <div className="inner" />
      </div>
      <div className="Rht">
        <div className="title">{name}</div>
        <div className="desc">{desc}</div>
      </div>
      <div className="link">
        <img src={LinkImg} alt="" />
      </div>
    </AppCardStyle>
  );
};

export default AppCard;

export const EmptyAppCard = ({ theme }: any) => {
  const { t } = useTranslation();
  return (
    <AppCardStyleEmp>
      <div className="flexBox">
        <div className="iconBox2">
          <img src={theme ? AddImg : AddImgLight} alt="" />
        </div>
        <div className="tips">{t('resources.wait2add')}</div>
      </div>
    </AppCardStyleEmp>
  );
};
interface Iprops {
  Nolink?: any;
}

const AppCardStyle = styled.div<Iprops>`
  padding: 14px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: var(--bs-box--background);
  border: 1px solid var(--border-box);
  box-shadow: var(--box-shadow);
  width: 100%;
  height: 100%;
  position: relative;
  .link {
    display: none;
  }
  &:hover {
    background-color: var(--home-right_hover);
    .link {
      display: ${(props) => (props.Nolink === 'true' ? 'none' : 'block')};
      //display: block;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .iconBox {
    border-radius: 16px;

    overflow: hidden;
    width: 88px;
    height: 88px;
    flex-shrink: 0;
    position: relative;
    .inner {
      background: #fff;
      width: 88px;
      height: 88px;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 17px;
    }
    img {
      position: relative;
      z-index: 8;
      width: 88px;
      height: 88px;
      object-fit: cover;
      object-position: center;
    }
  }
  .Rht {
    flex-grow: 1;
    box-sizing: border-box;
    padding-left: 12px;
  }
  .title {
    color: var(--bs-body-color_active);
    font-family: 'Poppins-SemiBold';
    font-size: 16px;
  }
  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: 8px;
    font-size: 12px;
  }
  .flexBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .tips {
    font-size: 12px;
    font-family: Poppins-Regular;
    font-weight: 400;
    color: #1a1323;
    line-height: 18px;
    margin-top: 8px;
    color: var(--bs-body-color_active);
  }
    &.disabled{
        opacity: 0.5!important;
        cursor: not-allowed;
    }

  @media (max-width: 1024px) {
    padding-block: 10px;
    gap: 5px;
    font-size: 14px;
    .iconBox {
      font-size: 20px;
    }
  }
`;

const AppCardStyleEmp = styled(AppCardStyle)`
 cursor: auto;
  &:hover {
    background-color: var(--bs-box--background);
  }
`;
