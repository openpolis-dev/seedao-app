import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WindowPlus } from 'react-bootstrap-icons';
import DefaultImg from '../../assets/Imgs/dark/default.png';
import DefaultImgLight from '../../assets/Imgs/light/default.png';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import AddImg from '../../assets/Imgs/dark/add.svg';
import AddImgLight from '../../assets/Imgs/light/add.svg';

const AppCard = ({
  icon,
  name,
  link,
  id,
  desc,
  hiddenFields,
  handleShow,
}: {
  icon?: any;
  name: string;
  link: string;
  id: string;
  desc?: string;
  hiddenFields?: string[];
  handleShow?: (arg0: string) => void;
}) => {
  const navigate = useNavigate();
  const {
    state: { theme, userData },
    dispatch,
  } = useAuthContext();
  const handleClickEvent = () => {
    if (id.startsWith('module-')) {
      navigate(link);
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
    <AppCardStyle className="boxApp" onClick={handleClickEvent}>
      <div className="iconBox">
        <img src={icon ? icon : theme ? DefaultImg : DefaultImgLight} alt="" />
        <div className="inner" />
      </div>
      <div className="Rht">
        <div className="title">{name}</div>
        <div className="desc">{desc}</div>
      </div>
    </AppCardStyle>
  );
};

export default AppCard;

export const EmptyAppCard = ({ theme }: any) => {
  const { t } = useTranslation();
  return (
    <AppCardStyle>
      <div className="flexBox">
        <div className="iconBox2">
          <img src={theme ? AddImg : AddImgLight} alt="" />
        </div>
        <div className="tips">{t('resources.wait2add')}</div>
      </div>
    </AppCardStyle>
  );
};

const AppCardStyle = styled.div`
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

  &:hover {
    background-color: var(--home-right_hover);
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

  @media (max-width: 1024px) {
    padding-block: 10px;
    gap: 5px;
    font-size: 14px;
    .iconBox {
      font-size: 20px;
    }
  }
`;
