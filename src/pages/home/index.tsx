import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { GOV_NODE_CONTRACT, SGN_CONTRACT } from 'utils/constant';
import BgImg from '../../assets/images/topBg.png';
import HomeBg from '../../assets/images/homebg.png';
import { People, ShieldCheck, Grid1x2, Calendar } from 'react-bootstrap-icons';

const CITY_HALL = 'https://seedao.notion.site/07c258913c5d4847b59271e2ae6f7c66';
const CITY_HALL_MEMBERS = 'https://www.notion.so/3913d631d7bc49e1a0334140e3cd84f5';

const Box = styled.div`
  background: #f0f3f8;
`;

const BannerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 2.5rem 4rem;
  background: url(${BgImg}) no-repeat right;
  background-size: auto 100%;
  @media (max-width: 1024px) {
    padding: 40px 25px 30px;
    background: url(${BgImg}) no-repeat bottom right;
    background-size: auto 80%;
  }
`;

const LFtBox = styled.div`
  width: 59%;
  .tit {
    font-size: 2.5rem;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.2em;
    font-family: 'Jost-ExtraBold';
    text-shadow: 5px 5px #f5f5f5;
  }
  .tips {
    background: #fff;
    padding: 2rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    width: 80%;
    font-size: 1.2rem;
    line-height: 1.4em;
    span {
      padding: 2px 5px;
      font-weight: bold;
      margin-right: 5px;
      //background: #f1f1f1;
    }
  }
  @media (min-width: 1780px) {
    .tit {
      font-size: 3.5rem;
    }
  }

  @media (max-width: 1024px) {
    .tit {
      font-size: 30px;
    }
    .tips {
      padding: 20px;
      font-size: 14px;
    }
  }
`;

const ActiveBox = styled.div`
  margin: 0 2rem;
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  a {
    float: right;
    font-weight: normal;
    font-size: 1rem;
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

const LineBox = styled.div`
  background: url(${HomeBg}) center no-repeat;
  background-size: 100%;
  background-attachment: fixed;
  margin-bottom: 40px;
  .inner {
    background: rgba(161, 110, 255, 0.7);
    padding: 10px;
  }
  ul {
    display: flex;
    align-items: center;
    width: 100%;
  }
  li {
    width: 33.33333%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  .num {
    font-size: 3rem;
    font-weight: bold;
    margin-right: 1.5rem;
    font-family: 'Jost-Bold';
  }
  @media (max-width: 1024px) {
    .num {
      font-size: 24px;
    }
  }
`;

const CityBox = styled.div`
  margin: 1rem 2rem;
`;

const LinkBox = styled(Row)`
  //display: flex;
  //align-items: center;
  //justify-content: space-between;
  margin-bottom: 80px;
  padding-left: 0;

  .inn {
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 30px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .lft {
    background: #eef1f7;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 22px;
    font-weight: bold;
    color: var(--bs-primary);
  }
  .tit {
    font-size: 1.2rem;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .tBtm {
    font-size: 0.8rem;
  }
  @media (max-width: 1024px) {
    .inn {
      margin-bottom: 20px;
      padding: 20px;
    }
    .tit {
      font-size: 18px;
      margin-bottom: 0;
    }
  }
`;

const EventCardStyle = styled.div`
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

const getDatafromNftscan = (contract: string, base?: string) => {
  return axios.get(`${base || 'https://polygonapi.nftscan.com'}/api/v2/statistics/collection/${contract}`, {
    headers: {
      'X-API-KEY': process.env.NEXT_PUBLIC_NFTSCAN_KEY,
    },
  });
};

const EventCard = ({ icon, name, link, id }: { icon: React.ReactElement; name: string; link: string; id: string }) => {
  const navigate = useNavigate();
  const handleClickEvent = () => {
    if (id === 'online') {
      navigate('/online-event');
    } else {
      window.open(link, '_blank');
    }
  };
  return (
    <EventCardStyle className="boxBg" onClick={handleClickEvent}>
      <div className="iconBox">{icon}</div>
      <div>{name}</div>
    </EventCardStyle>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const [sgnHolders, setSgnHolders] = useState(0);
  const [governNodes, setGovernNodes] = useState(0);
  const [onboardingHolders, setOnboardingHolders] = useState(0);
  const [onNewHolders, setNewHolders] = useState(0);

  const events = useMemo(() => {
    return [
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

  useEffect(() => {
    const handleSgnHolders = async () => {
      try {
        const res = await getDatafromNftscan(SGN_CONTRACT, 'https://restapi.nftscan.com');
        setSgnHolders(res.data?.data?.items_total || 0);
      } catch (error) {
        console.error('[SBT] get sgn owners failed', error);
      }
    };
    if (process.env.NODE_ENV !== 'development') handleSgnHolders();
  }, []);

  useEffect(() => {
    const handleGovNodes = async () => {
      try {
        const res = await getDatafromNftscan(GOV_NODE_CONTRACT, 'https://restapi.nftscan.com');
        setGovernNodes(res.data?.data?.owners_total || 0);
      } catch (error) {
        console.error('[SBT] get gov nodes failed', error);
      }
    };
    if (process.env.NODE_ENV !== 'development') handleGovNodes();
  }, []);

  const sbtHolders = useMemo(() => {
    const SBT_155 = 9;
    return governNodes + onboardingHolders + onNewHolders + SBT_155;
  }, [governNodes, onboardingHolders, onNewHolders]);

  useEffect(() => {
    const getOnboardingHolders = async () => {
      try {
        const res = await getDatafromNftscan('0x0D9ea891B4C30e17437D00151399990ED7965F00');
        setOnboardingHolders(res.data?.data?.owners_total || 0);
      } catch (error) {
        console.error('[SBT] get onboading holders failed', error);
      }
    };
    const getNewHolders = async () => {
      try {
        const res = await getDatafromNftscan('0x2221F5d189c611B09D7f7382Ce557ec66365C8fc');
        setNewHolders(res.data?.data?.owners_total || 0);
      } catch (error) {
        console.error('[SBT] get new-sbt holders failed', error);
      }
    };
    if (process.env.NODE_ENV !== 'development') {
      getOnboardingHolders();
      getNewHolders();
    }
  }, []);

  return (
    <Box>
      <BannerBox>
        <LFtBox>
          <div className="tit">{t('Home.Slogan')}</div>
          <div className="tips">
            <span>{t('Home.SloganVison')}:</span>
            {t('Home.SloganDesc')}
          </div>
        </LFtBox>
      </BannerBox>
      <LineBox>
        <div className="inner">
          <ul>
            <li>
              <div className="num">{sgnHolders}</div>
              <div>{t('Home.SGNHolder')}</div>
            </li>
            <li>
              <div className="num">{governNodes}</div>
              <div>{t('Home.GovernNode')}</div>
            </li>
            <li>
              <div className="num">{sbtHolders}</div>
              <div>{t('Home.SBTHolder')}</div>
            </li>
          </ul>
        </div>
      </LineBox>
      <ActiveBox>
        <TitBox>{t('Home.Apps')}</TitBox>
        <Row>
          {events.map((item, idx) => (
            <Col key={idx}>
              <EventCard {...item} />
            </Col>
          ))}
        </Row>
      </ActiveBox>
      <CityBox>
        <TitBox>{t('Home.Publicity')}</TitBox>
        <LinkBox>
          <Col onClick={() => window.open(CITY_HALL, '_blank')}>
            <div className="inn fst">
              <div className="lft">
                <ShieldCheck />
              </div>
              <div>
                <div className="tit">{t('Home.CityHall')}</div>
                <div className="tBtm">{CITY_HALL}</div>
              </div>
            </div>
          </Col>
          <Col onClick={() => window.open(CITY_HALL_MEMBERS, '_blank')}>
            <div className="inn snd">
              <div className="lft">
                <People />
              </div>
              <div>
                <div className="tit">{t('Home.CityHallMembers')}</div>
                <div className="tBtm">{CITY_HALL_MEMBERS}</div>
              </div>
            </div>
          </Col>
        </LinkBox>
      </CityBox>
    </Box>
  );
}
