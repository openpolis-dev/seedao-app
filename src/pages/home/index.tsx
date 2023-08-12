import React, { useState, useEffect } from 'react';
import Layout from 'Layouts';
import { EvaIcon } from '@paljs/ui/Icon';
import styled, { css } from 'styled-components';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import useTranslation from 'hooks/useTranslation';
import axios from 'axios';
import * as eventsAPI from 'requests/event';
import { Ievent } from 'type/event';
import { formatTime } from 'utils/time';
import { GOV_NODE_CONTRACT, SGN_CONTRACT } from 'utils/constant';
import { useRouter } from 'next/router';
import { AppActionType, useAuthContext } from 'providers/authProvider';

const CITY_HALL = 'https://seedao.notion.site/07c258913c5d4847b59271e2ae6f7c66';
const CITY_HALL_MEMBERS = 'https://www.notion.so/3913d631d7bc49e1a0334140e3cd84f5';

const Box = styled.div`
  margin: -2.25rem -2.25rem -0.75rem;
`;

const BannerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 2.5rem;
  background: url('/images/topBg.png') no-repeat right;
  background-size: auto 100%;
`;

const LFtBox = styled.div`
  width: 59%;
  .tit {
    font-size: 3.5rem;
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
      background: #f1f1f1;
    }
  }
`;

const ActiveBox = styled.div`
  margin: 0 2rem;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 100%;
  }
  .title {
    font-size: 1rem;
    line-height: 1.5em;
    height: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 1rem;
  }
`;

const CardBox = styled.div`
  border: 1px solid #f1f1f1;
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
`;
const ImageBox = styled.div`
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  width: 100%;

  img {
    width: 100%;
  }
`;
const Photo = styled.div`
  display: flex !important;
  overflow: hidden;
  .aspect {
    padding-bottom: 100%;
    height: 0;
    flex-grow: 1 !important;
  }
  .content {
    width: 100%;
    margin-left: -100% !important;
    max-width: 100% !important;
    flex-grow: 1 !important;
    position: relative;
  }
  .innerImg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    img {
      width: 100%;
    }
  }
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const LineBox = styled.div`
  background: url('/images/homebg.png') center no-repeat;
  background-size: 100%;
  background-attachment: fixed;
  margin-bottom: 80px;
  .inner {
    background: rgba(161, 110, 255, 0.7);
    padding: 2.2rem;
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
  }
  .num {
    font-size: 3rem;
    font-weight: bold;
    margin-right: 1.5rem;
    font-family: 'Jost-Bold';
  }
`;

const CityBox = styled.div`
  margin: 0 2rem;
`;

const LinkBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;

  li {
    width: 48%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    background-size: 100%;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    .inner {
      padding: 20px;
      background: rgba(255, 255, 255, 1);
      //backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
    }
  }
  .lft {
    background: #eef1f7;
    padding: 10px;
    border-radius: 100%;
    margin-right: 20px;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
    ${({ theme }) => css`
      color: ${theme.colorPrimary500};
    `}
  }
  .tit {
    font-size: 1.2rem;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .tBtm {
    font-size: 0.8rem;
  }
`;

export default function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dispatch } = useAuthContext();
  const [list, setList] = useState<{ name: string; image: string; start: string }[]>([]);
  const [sgnHolders, setSgnHolders] = useState(0);
  const [governNodes, setGovernNodes] = useState(0);
  const [sbtHolders, setSbtHolders] = useState(0);

  useEffect(() => {
    const handleSgnHolders = async () => {
      const url = `https://restapi.nftscan.com/api/v2/collections/${SGN_CONTRACT}`;
      const res = await axios.get(url, {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_NFTSCAN_KEY,
        },
      });
      setSgnHolders(res.data?.data?.amounts_total);
    };
    // handleSgnHolders();
  }, []);

  useEffect(() => {
    const handleGovNodes = async () => {
      const url = `https://restapi.nftscan.com/api/v2/collections/${GOV_NODE_CONTRACT}`;
      const res = await axios.get(url, {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_NFTSCAN_KEY,
        },
      });
      setGovernNodes(res.data?.data?.amounts_total);
    };
    // handleGovNodes();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      try {
        const res = await eventsAPI.getEventList({ page: 0, size: 5, sort_order: 'desc', sort_field: 'start_at' });
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
        const events = res.data.rows.map((item: Ievent) => {
          return {
            id: item.id,
            name: item.title,
            image: item.cover_img,
            start: formatTime(item.start_at),
          };
        });
        setList(events);
      } catch (error) {
        console.error('get events failed', error);
      }
    };
    getEvents();
  }, []);

  return (
    <Layout title="SeeDAO Project">
      <Box>
        <BannerBox>
          <LFtBox>
            <div className="tit">{t('Home.Slogan')}</div>
            <div className="tips">
              <span>{t('Home.SloganVison')}</span>
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
          <TitBox>{t('Home.Events')}</TitBox>
          <Row>
            {list.map((item, idx) => (
              <Col
                breakPoint={{ xs: 3, sm: 3, md: 3, lg: 2.4 }}
                key={idx}
                onClick={() => router.push(`event/info?id=${item.id}`)}
              >
                <CardBox>
                  <Item>
                    <ImageBox>
                      <Photo>
                        <div className="aspect" />
                        <div className="content">
                          <div className="innerImg">
                            <img src={item.image} alt="" />
                          </div>
                        </div>
                      </Photo>
                    </ImageBox>
                    <div className="title">{item.name}</div>
                  </Item>
                </CardBox>
              </Col>
            ))}
          </Row>
        </ActiveBox>
        <CityBox>
          <TitBox>{t('Home.Publicity')}</TitBox>
          <LinkBox>
            <li onClick={() => window.open(CITY_HALL, '_blank')}>
              <div className="inner">
                <div className="lft">
                  <EvaIcon name="shield-outline" />
                </div>
                <div>
                  <div className="tit">{t('Home.CityHall')}</div>
                  <div className="tBtm">{CITY_HALL}</div>
                </div>
              </div>
            </li>
            <li onClick={() => window.open(CITY_HALL_MEMBERS, '_blank')}>
              <div className="inner">
                <div className="lft">
                  <EvaIcon name="people-outline" />
                </div>
                <div>
                  <div className="tit">{t('Home.CityHallMembers')}</div>
                  <div className="tBtm">{CITY_HALL_MEMBERS}</div>
                </div>
              </div>
            </li>
          </LinkBox>
        </CityBox>
      </Box>
    </Layout>
  );
}
