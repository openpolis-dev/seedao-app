import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WindowPlus } from 'react-bootstrap-icons';

const AppCard = ({ icon, name, link, id }: { icon: React.ReactElement; name: string; link: string; id: string }) => {
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
      <div className="iconBox">{icon}</div>
      <div>{name}</div>
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
  background-size: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding-block: 15px;
  background-color: var(--bs-box--background);
  border: 1px solid var(--bs-border-color);
  margin-bottom: 20px;
  .iconBox {
    font-size: 24px;
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
