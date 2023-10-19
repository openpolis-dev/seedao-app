import styled from 'styled-components';
import { ContainerPadding } from '../assets/styles/global';
import React, { useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import DeschoolIcon from '../assets/images/apps/deschool.png';
import AaanyIcon from '../assets/images/apps/AAAny.svg';
import Cascad3Icon from '../assets/images/apps/cascad3.svg';
import DaolinkIcon from '../assets/images/apps/daolink.svg';
import Wormhole3Icon from '../assets/images/apps/wormhole3.svg';
import MetaforoIcon from '../assets/images/apps/metaforo.png';
import { Calendar, Grid1x2 } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Links from 'utils/links';
import SeedIcon from '../assets/images/seed.png';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const AppIcon = styled.img`
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

const FstTop = styled.div`
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

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
export default function Resources() {
  const { t } = useTranslation();

  const events = useMemo(() => {
    return [
      {
        id: 'Deschool',
        name: 'Deschool',
        link: 'https://deschool.app/origin/plaza',
        icon: <AppIcon src={DeschoolIcon} alt="" />,
      },
      {
        id: 'AAAny',
        name: 'AAAny',
        link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
        icon: <AppIcon src={AaanyIcon} alt="" />,
      },
      {
        id: 'Cascad3',
        name: 'Cascad3',
        link: 'https://www.cascad3.com/',
        icon: <AppIcon src={Cascad3Icon} alt="" style={{ height: '20px' }} />,
      },
      {
        id: 'DAOLink',
        name: 'DAOLink',
        link: 'https://m.daolink.space',
        icon: <AppIcon src={DaolinkIcon} alt="" />,
      },
      {
        id: 'Wormhole3',
        name: 'Wormhole3',
        link: 'https://alpha.wormhole3.io',
        icon: <AppIcon src={Wormhole3Icon} alt="" style={{ height: '20px' }} />,
      },
      {
        id: 'Metaforo',
        name: 'Metaforo',
        link: 'https://www.metaforo.io',
        icon: <AppIcon src={MetaforoIcon} alt="" />,
      },
      {
        id: 'online',
        name: t('Home.OnlineEvent'),
        link: 'https://calendar.google.com/calendar/u/4?cid=YzcwNGNlNTA5ODUxMmIwYjBkNzA3MjJlNjQzMGFmNDIyMWUzYzllYmM2ZDFlNzJhYTcwYjgyYzgwYmI2OTk5ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
        icon: <Calendar />,
      },
      {
        id: 'offline',
        name: t('Home.OfflineEvent'),
        link: 'https://seeu.network/',
        icon: <Grid1x2 />,
      },
    ];
  }, [t]);

  return (
    <OuterBox>
      <InnerBox>
        <FstTop>
          <Button>{t('general.apply')}</Button>
        </FstTop>
        <Row>
          {events.map((item, idx) => (
            <Col key={idx} sm={12} md={6} lg={4} xl={3}>
              <AppCard {...item} />
            </Col>
          ))}
          <Col sm={12} md={6} lg={4} xl={3}>
            <AppCard icon={<AppIcon src={SeedIcon} alt="" />} name="Seed" link={Links.seed} id="seed" />
          </Col>
        </Row>
      </InnerBox>
    </OuterBox>
  );
}
