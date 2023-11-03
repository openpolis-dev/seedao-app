import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { GOV_NODE_CONTRACT, SEED_CONTRACT } from 'utils/constant';

import AppCard from 'components/common/appCard';
import Links from 'utils/links';
import BgImg from '../../assets/Imgs/home/banner.png';
import CityHallImg from '../../assets/Imgs/home/cityHall.png';
import MembersImg from '../../assets/Imgs/home/members.png';

import SGNImg from '../../assets/Imgs/dark/sgnHome.png';
import SbtImg from '../../assets/Imgs/dark/sbt.png';
import GovernImg from '../../assets/Imgs/dark/govern.png';
import SGNImgLight from '../../assets/Imgs/light/sgnHome.png';
import SbtImgLight from '../../assets/Imgs/light/sbt.png';
import GovernImgLight from '../../assets/Imgs/light/govern.png';
import { useAuthContext } from '../../providers/authProvider';
import ArrowImg from '../../assets/Imgs/arrow.png';
import LinkImg from '../../assets/Imgs/link.svg';
import { useNavigate } from 'react-router-dom';

const CITY_HALL = 'https://seedao.notion.site/07c258913c5d4847b59271e2ae6f7c66';
const CITY_HALL_MEMBERS = 'https://www.notion.so/3913d631d7bc49e1a0334140e3cd84f5';

const Box = styled.div`
  background: var(--bs-background);
  .lline {
    display: flex;
    margin: 60px 20px;
  }
`;

const BannerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 349px;
  background: #19131f url(${BgImg}) no-repeat right center;
  background-size: auto 100%;
  border-radius: 16px;
  box-sizing: border-box;
  margin: 24px 32px 60px;
`;

const ActiveBox = styled.div`
  margin: 0 40px 0 0;
`;

const TitBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: var(--bs-body-color_active);
    font-family: 'Poppins-Bold';
  }
  .toGo {
    font-size: 14px;
    cursor: pointer;
    img {
      margin-left: 5px;
    }
  }
`;

const LineBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;

  dl {
    width: 33.33333%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    margin-right: 14px;
  }
  .num {
    font-family: 'Poppins-SemiBold';
    color: var(--bs-body-color_active);
    font-size: 40px;
    font-weight: bold;
  }
  .tips {
    color: var(--home-center-color);
    font-size: 16px;
  }
  @media (max-width: 1024px) {
    .num {
      font-size: 24px;
    }
  }
`;

const CityBox = styled.div`
  margin: 0;
`;

const LinkBox = styled(Row)`
  display: flex;
  flex-direction: column;
  .inn {
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--home-right);
    border: 1px solid var(--bs-border-color);
    padding: 30px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
    .link {
      position: absolute;
      right: 20px;
      top: 20px;
      display: none;
    }
    &:hover {
      background-color: var(--home-right_hover);
      .link {
        display: block;
      }
    }
  }
  .lft {
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    font-size: 22px;
    font-weight: bold;
    color: var(--bs-primary);
  }
  .tit {
    font-size: 14px;
    margin-bottom: 5px;
    font-family: 'Poppins-SemiBold';
    color: var(--bs-body-color_active);
  }
  .tBtm {
    font-size: 12px;
    word-break: break-all;
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

const FontBox = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 600px;
  .tit {
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 54px;
    letter-spacing: 2px;
    .colorful {
      display: inline-block;
      color: green;
      background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(52, 48, 237, 1)), to(rgba(190, 121, 244, 1)));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    span {
      font-family: 'Poppins-Bold' !important;
    }
  }
  .tips {
    margin-top: 5px;
    font-size: 16px;
    letter-spacing: 1px;
  }
`;

const getDatafromNftscan = (contract: string, base?: string) => {
  return axios.get(`${base || 'https://polygonapi.nftscan.com'}/api/v2/statistics/collection/${contract}`, {
    headers: {
      'X-API-KEY': process.env.REACT_APP_NFTSCAN_KEY,
    },
  });
};

export default function Home() {
  const { t } = useTranslation();
  const [seedHolders, setSEEDHolders] = useState(0);
  const [governNodes, setGovernNodes] = useState(0);
  const [onboardingHolders, setOnboardingHolders] = useState(0);
  const [onNewHolders, setNewHolders] = useState(0);

  const navigate = useNavigate();

  const {
    state: { theme },
  } = useAuthContext();

  const events = useMemo(() => {
    // @ts-ignore
    return Links.apps.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  useEffect(() => {
    const handleSEEDHolders = async () => {
      try {
        const res = await getDatafromNftscan(SEED_CONTRACT, 'https://restapi.nftscan.com');
        setSEEDHolders(res.data?.data?.items_total || 0);
      } catch (error) {
        console.error('[SBT] get sgn owners failed', error);
      }
    };
    if (process.env.NODE_ENV !== 'development') handleSEEDHolders();
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

  const togo = (url: string) => {
    navigate(url);
  };

  return (
    <Box>
      <BannerBox>
        <FontBox>
          <div className="tit">
            <span className="colorful">{t('Home.Slogan1')}</span>
            <span>{t('Home.Slogan2')}</span>
            <span className="colorful">{t('Home.Slogan3')}</span>
          </div>
          <div className="tips">
            {t('Home.SloganVison')}:{t('Home.SloganDesc')}
          </div>
        </FontBox>
      </BannerBox>
      <LineBox>
        <dl>
          <dt>
            <img src={theme ? SGNImg : SGNImgLight} alt="" />
          </dt>
          <dd>
            <div className="num">{seedHolders}</div>
            <div className="tips">{t('Home.SGNHolder')}</div>
          </dd>
        </dl>
        <dl>
          <dt>
            <img src={theme ? GovernImg : GovernImgLight} alt="" />
          </dt>
          <dd>
            <div className="num">{governNodes}</div>
            <div className="tips">{t('Home.GovernNode')}</div>
          </dd>
        </dl>
        <dl>
          <dt>
            <img src={theme ? SbtImg : SbtImgLight} alt="" />
          </dt>
          <dd>
            <div className="num">{sbtHolders}</div>
            <div className="tips">{t('Home.SBTHolder')}</div>
          </dd>
        </dl>
      </LineBox>
      <Row className="lline">
        <Col md={8}>
          <ActiveBox>
            <TitBox>
              <span>{t('Home.Apps')}</span>
              <div className="toGo" onClick={() => togo('/apps')}>
                {t('Home.allEvents')}
                <img src={ArrowImg} alt="" />
              </div>
            </TitBox>
            <Row>
              {events.slice(0, 6).map((item, idx) => (
                <Col key={idx} sm={12} md={6} lg={6} xl={6}>
                  <AppCard {...item} />
                </Col>
              ))}
            </Row>
          </ActiveBox>
        </Col>
        <Col md={4}>
          <CityBox>
            <TitBox>
              <span>{t('Home.Publicity')}</span>
              <div className="toGo">
                {t('Home.viewAll')}
                <img src={ArrowImg} alt="" />
              </div>
            </TitBox>
            <LinkBox>
              <Col onClick={() => window.open(CITY_HALL, '_blank')}>
                <div className="inn fst">
                  <div className="link">
                    <img src={LinkImg} alt="" />
                  </div>
                  <div className="lft">
                    <img src={CityHallImg} alt="" />
                  </div>
                  <div>
                    <div className="tit">{t('Home.CityHall')}</div>
                    <div className="tBtm">{CITY_HALL}</div>
                  </div>
                </div>
              </Col>
              <Col onClick={() => window.open(CITY_HALL_MEMBERS, '_blank')}>
                <div className="inn snd">
                  <div className="link">
                    <img src={LinkImg} alt="" />
                  </div>
                  <div className="lft">
                    <img src={MembersImg} alt="" />
                  </div>
                  <div>
                    <div className="tit">{t('Home.CityHallMembers')}</div>
                    <div className="tBtm">{CITY_HALL_MEMBERS}</div>
                  </div>
                </div>
              </Col>
            </LinkBox>
          </CityBox>
        </Col>
      </Row>
    </Box>
  );
}
