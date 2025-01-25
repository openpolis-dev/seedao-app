import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AppCard from 'components/common/appCard';
import Links from 'utils/links';
import BgImg from '../../assets/Imgs/home/banner.png';

import SGNImg from '../../assets/Imgs/dark/sgnHome.png';
import SbtImg from '../../assets/Imgs/dark/sbt.png';
import GovernImg from '../../assets/Imgs/dark/govern.png';
import SGNImgLight from '../../assets/Imgs/light/sgnHome.png';
import SbtImgLight from '../../assets/Imgs/light/sbt.png';
import GovernImgLight from '../../assets/Imgs/light/govern.png';
import { useAuthContext } from '../../providers/authProvider';
import ArrowImg from '../../assets/Imgs/arrow.png';
import LinkImg from '../../assets/Imgs/link.svg';
import { Link, useNavigate } from 'react-router-dom';
import getConfig from 'utils/envCofnig';
import PlayImg from '../../assets/Imgs/podcast.png';
import { types } from 'sass';
import {BookMarked} from "lucide-react";
import { getPublicity } from "../../requests/publicity";
import { formatTime } from "../../utils/time";
import useToast, { ToastType } from "../../hooks/useToast";
import { getNodeSBT } from "../../requests/publicData";

const Box = styled.div`
  background: var(--bs-background);
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  .lline {
    display: flex;
    margin: 40px 20px 0;
  }
`;

const BannerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 295px;
  background: #19131f url(${BgImg}) no-repeat right center;
  background-size: auto 100%;
  border-radius: 16px;
  box-sizing: border-box;
  margin: 24px 32px 40px;
  position: relative;
`;

const ActiveBox = styled.div`
  margin: 0 40px 0 0;
  div[class^='col'] {
    min-height: 116px;
    display: flex;
    margin-bottom: 24px;
  }
  .boxApp {
    border: 1px solid var(--bs-border-color);
    box-shadow: var(--box-shadow);
  }
  .link {
    display: none !important;
  }
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

const TitBox2 = styled(TitBox)`
  span {
    margin-bottom: 10px;
  }
`;

const LineBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  .rhtLine {
    width: 1px;
    height: 80px;
    background: var(--line-home);
  }
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
  margin: 0 0 20px;
`;

const LinkBox = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .inn {
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--bs-box--background);
    //border: 1px solid var(--bs-border-color);
    box-shadow: var(--box-shadow);
    padding: 14px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    .link {
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
    display: flex;
    align-items: center;
    font-size: 22px;
    font-weight: bold;
    flex-grow: 1;
    color: var(--bs-primary);
  }
  .tit {
    font-size: 14px;
    margin-left: 10px;
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
  min-width: 50%;
  max-width: 670px;
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

const BtmBox = styled.div`
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background-color: var(--bs-box--background);
  border: 1px solid var(--bs-border-color_opacity);
  box-shadow: var(--box-shadow);
    min-height: 55px;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .tit {
    font-size: 14px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: var(--bs-body-color_active);
    line-height: 22px;
  }
  .desc {
    font-size: 12px;
    font-weight: 400;
    color: var(--bs-body-color);
    line-height: 18px;
    margin-top: 8px;
    margin-left: 10px;
  }

  .linkRht {
    display: block;
    img {
      width: 25px;
      height: 25px;
    }
  }
  .link {
    display: none;
  }
  &:hover {
    background-color: var(--home-right_hover);
    .link {
      display: block;
    }
  }
`;

export default function Home() {
  const { t } = useTranslation();
  const [seedHolders, setSEEDHolders] = useState(0);
  const [governNodes, setGovernNodes] = useState(0);
  const [onboardingHolders, setOnboardingHolders] = useState(0);
  const [onNewHolders, setNewHolders] = useState(0);
  const [list,setList] = useState([]);
  const [sbtHolders,setSbtHolders] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    state: { theme, hadOnboarding, sns: userSNS },
  } = useAuthContext();

  const events = useMemo(() => {
    // @ts-ignore
    return Links.apps.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  const Publicitys = useMemo(() => {
    // @ts-ignore
    return Links.publicity.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  useEffect(() => {
    getStatics()
  }, []);

  const getStatics = async() =>{
   let rt = await getNodeSBT()
    console.log(rt.data)

    let obj:any={}
    for (let i = 0; i < rt.data.length; i++) {
      let item= rt.data[i];
      console.log(item.Name,item.NumValue)
      obj[item.Name]=item.NumValue
    }
    console.log("obj",obj)
    setSbtHolders(obj.compute_sbt_num)
    setGovernNodes(obj.compute_node_num)
  }

  useEffect(() => {
    const handleSEEDHolders = async () => {
      fetch(`${getConfig().INDEXER_ENDPOINT}/insight/erc721/total_supply/0x30093266E34a816a53e302bE3e59a93B52792FD4
`)
        .then((res: any) => res.json())
        .then((r) => {
          setSEEDHolders(Number(r.totalSupply));
        })
        .catch((error: any) => {
          logError('[SBT] get sgn owners failed', error);
          showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        });
    };
    handleSEEDHolders();
  }, []);

  useEffect(() => {
    // const handleGovNodes = async () => {
    //   fetch(
    //     `${
    //       getConfig().INDEXER_ENDPOINT
    //     }/insight/erc1155/total_supply_of_tokenId/0x9d34D407D8586478b3e4c39BE633ED3D7be1c80C/4`,
    //   )
    //     .then((res: any) => res.json())
    //     .then((r) => {
    //       setGovernNodes(Number(r.totalSupply));
    //     })
    //     .catch((error: any) => {
    //       showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    //       logError('[SBT] get gov nodes failed', error);
    //     });
    // };
    // handleGovNodes();
    getList()
  }, []);

  // const sbtHolders = useMemo(() => {
  //   const SBT_155 = 9;
  //   return governNodes + onboardingHolders + onNewHolders + SBT_155;
  // }, [governNodes, onboardingHolders, onNewHolders]);
  //
  // useEffect(() => {
  //   const getOnboardingHolders = async () => {
  //     fetch(
  //       `${
  //         getConfig().INDEXER_ENDPOINT
  //       }/insight/erc1155/total_supply_of_tokenId/0x0D9ea891B4C30e17437D00151399990ED7965F00/157`,
  //     )
  //       .then((res: any) => res.json())
  //       .then((r) => {
  //         setOnboardingHolders(Number(r.totalSupply));
  //       })
  //       .catch((error: any) => {
  //         showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
  //         logError('[SBT] get onboarding-sbt holders failed', error);
  //       });
  //   };
  //   const getNewHolders = async () => {
  //     fetch(`${getConfig().INDEXER_ENDPOINT}/insight/erc1155/total_supply/0x2221F5d189c611B09D7f7382Ce557ec66365C8fc`)
  //       .then((res: any) => res.json())
  //       .then((r) => {
  //         setNewHolders(Number(r.totalSupply));
  //       })
  //       .catch((error: any) => {
  //         showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
  //         logError('[SBT] get new-sbt holders failed', error);
  //       });
  //   };
  //   getOnboardingHolders();
  //   getNewHolders();
  // }, []);

  const togo = (url: string) => {
    navigate(url);
  };

  const getList = async() =>{
    try {
      let rt = await getPublicity(1,3,"list")
      const {data:{rows}} = rt;
      setList(rows)
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      console.error(error)
    }
  }


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
        {/* {!hadOnboarding && (
          <OnboadingButton onClick={() => navigate(userSNS ? '/onboarding/learn' : '/sns/register')}>
            {t('Onboarding.HomeEntranceButton')}
          </OnboadingButton>
        )} */}
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
        <div className="rhtLine" />
        <dl>
          <dt>
            <img src={theme ? GovernImg : GovernImgLight} alt="" />
          </dt>
          <dd>
            <div className="num">{governNodes}</div>
            <div className="tips">{t('Home.GovernNode')}</div>
          </dd>
        </dl>
        <div className="rhtLine" />
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
              {events.slice(0, 12).map((item, idx) => (
                <Col key={idx} sm={12} md={4} lg={4} xl={4}>
                  <AppCard {...item} />
                </Col>
              ))}
            </Row>
          </ActiveBox>
        </Col>
        <Col md={4}>

          {/*<CityBox>*/}
          {/*  <a href="https://seedao.notion.site/f57031667089473faa7ea3560d05960c" target="_blank" rel="noreferrer">*/}
          {/*    <TitBox2>*/}
          {/*      <span>{t('Home.Publicity')}</span>*/}
          {/*      <div className="toGo">*/}
          {/*        {t('Home.viewAll')}*/}
          {/*        <img src={ArrowImg} alt="" />*/}
          {/*      </div>*/}
          {/*    </TitBox2>*/}
          {/*  </a>*/}

          {/*  <LinkBox>*/}
          {/*    {Publicitys.slice(0, 5).map((item: any, index) => {*/}
          {/*      return item.id.startsWith('module') ? (*/}
          {/*        <Col key={index}>*/}
          {/*          <Link to={item.link}>*/}
          {/*            <BtmBox>*/}
          {/*              <div>*/}
          {/*                <div className="tit">{item.name}</div>*/}
          {/*                /!*<div className="desc">{item.time}</div>*!/*/}
          {/*              </div>*/}
          {/*              <div className="link">*/}
          {/*                <img src={LinkImg} alt="" />*/}
          {/*              </div>*/}
          {/*            </BtmBox>*/}
          {/*          </Link>*/}
          {/*        </Col>*/}
          {/*      ) : (*/}
          {/*        <Col key={`publicity_${index}`}>*/}
          {/*          <a href={item.link} target="_blank" rel="noreferrer">*/}
          {/*            <BtmBox>*/}
          {/*              <div>*/}
          {/*                <div className="tit">{item.name}</div>*/}
          {/*                /!*<div className="desc">{item.time}</div>*!/*/}
          {/*              </div>*/}
          {/*              <div className="link">*/}
          {/*                <img src={LinkImg} alt="" />*/}
          {/*              </div>*/}
          {/*            </BtmBox>*/}
          {/*          </a>*/}
          {/*        </Col>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </LinkBox>*/}
          {/*</CityBox>*/}
          <CityBox>
            <Link to="/publicity">
              <TitBox2>
                <span>{t('Home.information')}</span>
                <div className="toGo">
                  {t('Home.viewAll')}
                  <img src={ArrowImg} alt="" />
                </div>
              </TitBox2>
            </Link>

            <LinkBox>
              {list.map((item: any, index) => (<Col key={index}>
                  <Link to={`/publicity/detail/${item?.id}`}>
                    <BtmBox>
                      <div>
                        <div className="tit">{item?.title}</div>
                        <div className="desc">{formatTime(item?.updateAt * 1000)}</div>
                      </div>
                      <div className="link">
                        <img src={LinkImg} alt="" />
                      </div>
                    </BtmBox>
                  </Link>
                </Col>)



              )}
            </LinkBox>
          </CityBox>
        </Col>
      </Row>
    </Box>
  );
}

const OnboadingButton = styled(Button)`
  position: absolute;
  right: 20px;
  bottom: 20px;
`;
const FlexPod = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  .tit {
    font-size: 16px;
  }
  img {
    width: 88px;
    height: 88px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
`;
