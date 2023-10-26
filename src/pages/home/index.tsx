import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { GOV_NODE_CONTRACT, SGN_CONTRACT } from 'utils/constant';

import { People, ShieldCheck } from 'react-bootstrap-icons';
import AppCard from 'components/common/appCard';
import Links from 'utils/links';

import SGNImg from '../../assets/Imgs/dark/sgnHome.png';
import SbtImg from '../../assets/Imgs/dark/sbt.png';
import GovernImg from '../../assets/Imgs/dark/govern.png';
import SGNImgLight from '../../assets/Imgs/light/sgnHome.png';
import SbtImgLight from '../../assets/Imgs/light/sbt.png';
import GovernImgLight from '../../assets/Imgs/light/govern.png';
import { useAuthContext } from '../../providers/authProvider';

const CITY_HALL = 'https://seedao.notion.site/07c258913c5d4847b59271e2ae6f7c66';
const CITY_HALL_MEMBERS = 'https://www.notion.so/3913d631d7bc49e1a0334140e3cd84f5';

const Box = styled.div``;

const BannerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 2.5rem 4rem;

  background-size: auto 100%;
  @media (max-width: 1024px) {
    padding: 40px 25px 30px;
    background-size: auto 80%;
  }
`;

const ActiveBox = styled.div`
  margin: 0 2rem;
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--bs-body-color_active);
  font-family: 'Poppins-Bold';
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
  margin: 0 2rem;
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
    background-color: var(--bs-box--background);
    border: 1px solid var(--bs-border-color);
    padding: 30px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
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

const getDatafromNftscan = (contract: string, base?: string) => {
  return axios.get(`${base || 'https://polygonapi.nftscan.com'}/api/v2/statistics/collection/${contract}`, {
    headers: {
      'X-API-KEY': process.env.REACT_APP_NFTSCAN_KEY,
    },
  });
};

export default function Home() {
  const { t } = useTranslation();
  const [sgnHolders, setSgnHolders] = useState(0);
  const [governNodes, setGovernNodes] = useState(0);
  const [onboardingHolders, setOnboardingHolders] = useState(0);
  const [onNewHolders, setNewHolders] = useState(0);

  const {
    state: { theme },
  } = useAuthContext();

  const events = useMemo(() => {
    // @ts-ignore
    return Links.apps.map((item) => ({ ...item, name: t(item.name) as string }));
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
        {/*<LFtBox>*/}
        {/*  <div className="tit">{t('Home.Slogan')}</div>*/}
        {/*  <div className="tips">*/}
        {/*    <span>{t('Home.SloganVison')}:</span>*/}
        {/*    {t('Home.SloganDesc')}*/}
        {/*  </div>*/}
        {/*</LFtBox>*/}
      </BannerBox>
      <LineBox>
        <dl>
          <dt>
            <img src={theme ? SGNImg : SGNImgLight} alt="" />
          </dt>
          <dd>
            <div className="num">{sgnHolders}</div>
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
      <Row>
        <Col md={8}>
          <ActiveBox>
            <TitBox>{t('Home.Apps')}</TitBox>
            <Row>
              {events.map((item, idx) => (
                <Col key={idx} sm={12} md={6} lg={6} xl={6}>
                  <AppCard {...item} />
                </Col>
              ))}
            </Row>
          </ActiveBox>
        </Col>
        <Col md={4}>
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
        </Col>
      </Row>
    </Box>
  );
}
