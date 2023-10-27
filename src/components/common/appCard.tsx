import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WindowPlus } from 'react-bootstrap-icons';

const AppCard = ({
  icon,
  name,
  link,
  id,
  desc,
}: {
  icon?: any;
  name: string;
  link: string;
  id: string;
  desc?: string;
}) => {
  const navigate = useNavigate();
  const handleClickEvent = () => {
    if (id === 'online') {
      navigate('/online-event');
    } else if (id === 'pub') {
      navigate('/pub');
    } else {
      window.open(link, '_blank');
    }
  };
  return (
    <AppCardStyle className="boxBg" onClick={handleClickEvent}>
      <div className="iconBox">
        <img src={icon} alt="" />
      </div>
      <div className="Rht">
        <div className="title">{name}</div>
        <div className="desc">
          Our Vision:Creating an alternative human living space in cyberspace outside the region of the nation-states.
        </div>
      </div>
    </AppCardStyle>
  );
};

export default AppCard;

export const EmptyAppCard = () => {
  const { t } = useTranslation();
  return (
    <AppCardStyle>
      <div className="iconBox">{<WindowPlus />}</div>

      <div>{t('resources.wait2add')}</div>
    </AppCardStyle>
  );
};

export const AppIcon = styled.img`
  height: 30px;
`;

const AppCardStyle = styled.div`
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: var(--bs-box--background);
  border: 1px solid var(--bs-border-color);
  margin-bottom: 20px;
  .iconBox {
    img {
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

  @media (max-width: 1024px) {
    padding-block: 10px;
    gap: 5px;
    font-size: 14px;
    .iconBox {
      font-size: 20px;
    }
  }
`;
