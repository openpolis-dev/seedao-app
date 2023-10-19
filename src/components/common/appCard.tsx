import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AppCard = ({ icon, name, link, id }: { icon: React.ReactElement; name: string; link: string; id: string }) => {
  const navigate = useNavigate();
  const handleClickEvent = () => {
    if (id === 'online') {
      navigate('/online-event');
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

export const AppIcon = styled.img`
  height: 30px;
`;

const AppCardStyle = styled.div`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background-size: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding-block: 30px;
  background-color: #fff;
  margin-bottom: 20px;
  .iconBox {
    font-size: 24px;
  }

  @media (max-width: 1024px) {
    padding-block: 20px;
    gap: 5px;
    font-size: 14px;
    .iconBox {
      font-size: 20px;
    }
  }
`;
