import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from 'providers/authProvider';
import { Trans, useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import { ContainerPadding } from 'assets/styles/global';
import CopyBox from 'components/copy';
import GithubImg from '../../../assets/Imgs/profile/Github2.svg';
import TwitterIcon from '../../../assets/Imgs/profile/x.png';
import DiscordIcon from '../../../assets/Imgs/profile/discord.svg';
import WechatIcon from '../../../assets/Imgs/profile/wechat.svg';
import MirrorImg from '../../../assets/Imgs/profile/mirror.svg';
import EmailIcon from '../../../assets/Imgs/profile/message.svg';
import { formatNumber } from 'utils/number';
import { Link } from 'react-router-dom';
import CopyIconSVG from '../../../assets/Imgs/copy.svg';
import defaultImg from '../../../assets/Imgs/defaultAvatar.png';
import PublicJs from '../../../utils/publicJs';
import LevelImg from '../../../assets/Imgs/profile/level.svg';
import SeedImg from '../../../assets/Imgs/profile/seed.svg';
import SbtImg from '../../../assets/Imgs/profile/sbt.svg';

import SeedList from '../../../components/profile/seed';
import Sbt from '../../../components/profile/Sbt';
import { getMyRewards } from 'requests/invite';

const OuterBox = styled.div`
  margin-bottom: 50px;

  ${ContainerPadding};
`;

const HeadBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: var(--bs-box--background);
  margin-bottom: 24px;
  padding: 20px 24px 5px;
  border-radius: 16px;
  box-shadow: var(--box-shadow);
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 16px;
  label {
    margin-top: 0;
    background: none;
  }
`;

export default function Profile() {
  const {
    state: { userData, sns },
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState<string | undefined>('');

  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [sbt, setSbt] = useState<any[]>([]);
  const [seed, setSeed] = useState<any[]>([]);
  const [wallet, setWallet] = useState();
  const [detail, setDetail] = useState<any>();
  const [sbtList, setSbtList] = useState<any[]>([]);
  const [sbtArr, setSbtArr] = useState<any[]>([]);
  const [inviteScr, setInviteScr] = useState<number>(0);

  useEffect(() => {
    if (!seed?.length) return;
    setList([]);
    setSbtList([]);

    const getSeed = async () => {
      let arr = [];
      for (let i = 0; i < seed.length; i++) {
        let seedItem = seed[i];
        let url = await PublicJs.getSeedUrl(seedItem.image_uri);
        arr.push({ ...seedItem, url });
      }
      setList([...arr]);
    };
    getSeed();

    const getSbt = async () => {
      let arr = [];
      for (let i = 0; i < sbt.length; i++) {
        let item = sbt[i];
        let url = await PublicJs.getImage(item.image_uri);
        arr.push({ ...item, url });
      }
      setSbtList([...arr]);
    };
    getSbt();
  }, [seed, sbt]);
  useEffect(() => {
    if (!sbtList?.length) return;

    const sbtFor = sbtList.filter((item: any) => item.name && item.image_uri);

    const groupedData = sbtFor.reduce((result: any, item: any) => {
      const key = item?.metadata?.properties?.category ? item?.metadata?.properties?.category : 'others';
      const group = result?.find((group: any) => group.category === key);

      if (group) {
        group.tokens.push(item);
      } else {
        result.push({ category: key, tokens: [item] });
      }
      return result;
    }, []);
    setSbtArr(groupedData);
  }, [sbtList]);

  const getDetail = async () => {
    if (userData) {
      let detail = (userData as any).data;
      setDetail(detail);
      setUserName(detail.nickname);
      let avarUrl = await PublicJs.getImage(detail?.avatar);
      setAvatar(avarUrl!);
      setWallet(detail.wallet);
      setBio(detail.bio);
      setRoles(detail.roles!);

      let sbtArr = detail.sbt;
      const sbtFor = sbtArr?.filter((item: any) => item.name && item.image_uri);
      setSbt(sbtFor);
      setSeed(detail.seed);
    }
  };

  const getInviteInfo = async () => {
    getMyRewards()
      .then((r) => {
        setInviteScr(r.data.total_rewards);
      })
      .catch((e) => {
        showToast(`get invite rewards failed: ${e?.data?.msg || e}`, ToastType.Danger);
      });
  };

  useEffect(() => {
    if (!userData) return;
    getDetail();
    getInviteInfo();
  }, [userData]);

  const switchRoles = (role: string) => {
    let str: string = '';
    switch (role) {
      case 'SGN_HOLDER':
        str = t('roles.SGN_HOLDER');
        break;
      case 'SEEDAO_MEMBER':
        str = t('roles.SEEDAO_MEMBER');
        break;
      case 'SEEDAO_ONBOARDING':
        str = t('roles.SEEDAO_ONBOARDING');
        break;
      default:
        str = role;
        break;
    }
    if(role.indexOf('CONTRIBUTOR_') > -1){
      const level = role.split("_")[1]
      str = t('roles.CONTRIBUTOR', { level });
    }

    if(role.indexOf('CITYHALL_') > -1){
      const period = role.split("_")[1]
      str = t('roles.CITYHALL', { period });
    }


    //   str = t('roles.NODE_S5');
    if (role.indexOf('NODE_S') > -1) {
      let num = role.split('NODE_S')[1];
      str = `${t('roles.NODE_S')} S${num}`;
    }
    return str;
  };

  const removeUrl = () => {
    setAvatar('');
  };

  const returnSocial = (str: string, val?: string) => {
    switch (str) {
      case 'twitter':
        return (
          <a href={val} target="_blank">
            <img src={TwitterIcon} alt="" />
          </a>
        );

      case 'email':
        return (
          <a href={`mailto:${val}`} target="_blank">
            <img src={EmailIcon} alt="" />
          </a>
        );

      case 'mirror':
        return (
          <a href={val} target="_blank">
            <img src={MirrorImg} alt="" />
          </a>
        );
      case 'github':
        return (
          <a href={val} target="_blank">
            <img src={GithubImg} alt="" />
          </a>
        );
      case 'discord':
      // return <img src={DiscordIcon} alt="" />;

      case 'wechat':
        return '';
      // return (<img src={WechatIcon} alt="" />);
    }
  };

  return (
    <OuterBox>
      {Toast}
      {/*<TitleBox>{t('My.MyProfile')}</TitleBox>*/}
      <HeadBox>
        <LftBox>
          <AvatarBox>
            <ImgBox>
              <img src={avatar ? avatar : defaultImg} alt="" />
            </ImgBox>
          </AvatarBox>
          <InfoBox>
            <div>
              <div className="userName">{userName}</div>
              {!!sns && (
                <div className="wallet btm8">
                  <span>{sns || '-'}</span>
                  <CopyBox text={sns || ''} dir="left">
                    <img src={CopyIconSVG} alt="" />
                  </CopyBox>
                </div>
              )}

              <div className="wallet">
                <span>{wallet}</span>
                {wallet && (
                  <CopyBox text={wallet!} dir="right">
                    <img src={CopyIconSVG} alt="" />
                  </CopyBox>
                )}
              </div>
            </div>
            {!!bio && (
              <BioBox>
                {/*<div className="title">{t('My.Bio')}</div>*/}
                <div>{bio || '-'}</div>
              </BioBox>
            )}
            <TagBox>
              {roles?.map((item, index) => (
                <li key={`tag_${index}`}>{switchRoles(item)}</li>
              ))}
            </TagBox>
          </InfoBox>
        </LftBox>
        <RhtBox>
          <EditButton to="/user/profile/edit">
            <Button variant="primary">{t('general.edit')}</Button>
          </EditButton>
          <LinkBox>
            {detail?.social_accounts?.map((item: any, index: number) =>
              returnSocial(item.network, item.identity) ? (
                <li key={`sbtInner_${index}`}>
                  <span className="iconLft">{returnSocial(item.network, item.identity)}</span>
                </li>
              ) : null,
            )}
            {detail?.email && (
              <li>
                <span className="iconLft">{returnSocial('email', detail?.email)}</span>
              </li>
            )}
          </LinkBox>
        </RhtBox>
      </HeadBox>

      <ProgressOuter>
        <TitleLft>
          <img src={LevelImg} alt="" />
          <span>{t('My.level')}</span>
        </TitleLft>
        <LevelBox>LV{detail?.level?.current_lv}</LevelBox>
        <LevelInfo>
          <span>
            {t('My.current')} {formatNumber(detail?.scr?.amount)} SCR,
          </span>
          <span>{t('My.levelTips', { level: Number(detail?.level?.current_lv) + 1 })}</span>
          <span>{formatNumber(detail?.level?.scr_to_next_lv)} SCR, </span>
          <InviteDetail>
            {t('My.InviteInfo', { amount: inviteScr })}
            <Link to={`/assets?target=${wallet}&content=邀请 SNS`}>{t('My.ViewDetails')}</Link>
          </InviteDetail>
        </LevelInfo>
      </ProgressOuter>
      <BgBox>
        <TitleLft>
          <img src={SeedImg} alt="" />
          <span>SEED</span>
        </TitleLft>
        <RhtBoxB>
          <SeedList list={list} />
        </RhtBoxB>
      </BgBox>
      <BgBox>
        <TitleLft>
          <img src={SbtImg} alt="" />
          <span>SBT</span>
        </TitleLft>

        <RhtBoxB>
          <Sbt list={sbtArr} />
        </RhtBoxB>
      </BgBox>

      {/*<>*/}
      {/*    {!!list?.length && (*/}
      {/*      <>*/}
      {/*        <div className="ul">*/}
      {/*          {list?.map((item, index) => (*/}
      {/*            <div key={index} className="li">*/}
      {/*              <img src={item.url} alt="" />*/}
      {/*            </div>*/}
      {/*          ))}*/}
      {/*        </div>*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*    {!!sbtList?.length && (*/}
      {/*      <li>*/}
      {/*        <div className="title">SBT</div>*/}
      {/*        <div className="ul">*/}
      {/*          {sbtList?.map((item, index) => (*/}
      {/*            <div key={index} className="li">*/}
      {/*              <img src={item.url} alt="" />*/}
      {/*            </div>*/}
      {/*          ))}*/}
      {/*        </div>*/}
      {/*      </li>*/}
      {/*    )}*/}
      {/*  </>*/}
    </OuterBox>
  );
}

const TitleBox = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold;
  color: var(--bs-body-color_active);
  line-height: 30px;
  margin-bottom: 40px;
`;

const ImgBox = styled.div`
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .iconRht {
    margin-right: 10px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .del {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    //display: flex;
    align-items: center;
    justify-content: center;
    background: #a16eff;
    opacity: 0.5;
    color: #fff;
    cursor: pointer;
    .iconTop {
      font-size: 40px;
    }
  }
  &:hover {
    .del {
      display: flex;
    }
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  .userName {
    color: var(--bs-body-color_active);
    font-size: 18px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 23px;
    margin-bottom: 6px;
  }
  .wallet {
    color: var(--bs-body-color_active);
    display: flex;
    font-size: 12px;
    span {
      margin-right: 10px;
    }
  }
  .btm8 {
  }
`;
const BioBox = styled.section`
  margin-top: 7px;
  color: var(--bs-body-color_active);

  width: 582px;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  .title {
    font-size: 12px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 16px;
  }
`;

const LinkBox = styled.ul`
  display: flex;
  margin-top: 40px;
  li {
    margin-left: 16px;
  }
  .copy-content {
    display: inline-block;
  }
    img{
        width: 32px;
        height: 32px;
    }
`;

const ProgressOuter = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 24px;
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  margin-bottom: 24px;
`;

const TagBox = styled.ul`
  margin-top: 7px;
  font-size: 12px;
  flex-wrap: wrap;
  display: flex;
  font-weight: 400;
  li {
    border-radius: 5px;
    padding-inline: 10px;
    line-height: 22px;
    margin: 0 8px 15px 0;
    color: #000;
    &:nth-child(13n + 1) {
      background: #ff7193;
    }
    &:nth-child(13n + 2) {
      background: #20b18a;
    }
    &:nth-child(13n + 3) {
      background: #f9b617;
    }
    &:nth-child(13n + 4) {
      background: #2f8fff;
    }
    &:nth-child(13n + 5) {
      background: #7b50d7;
    }
    &:nth-child(13n + 6) {
      background: #dde106;
    }
    &:nth-child(13n + 7) {
      background: #1f9e14;
    }
    &:nth-child(13n + 8) {
      background: #fa9600;
    }
    &:nth-child(13n + 9) {
      background: #ffa5ba;
    }
    &:nth-child(13n + 10) {
      background: #c972ff;
    }
    &:nth-child(13n + 11) {
      background: #ff5ae5;
    }
    &:nth-child(13n + 12) {
      background: #149e7d;
    }
    &:nth-child(13n) {
      background: #ff3f3f;
    }
  }
`;

const EditButton = styled(Link)`
  .btn {
    padding: 10px 30px;
  }
`;

const TitleLft = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  flex-shrink: 0;
  img {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
  span {
    font-family: 'Poppins-SemiBold';
    font-size: 14px;
    font-weight: 600;
    color: var(--bs-body-color_active);
    line-height: 18px;
  }
`;
const LevelBox = styled.div`
  font-size: 24px;
  font-weight: normal;
  line-height: 28px;
  font-family: 'Poppins-Bold';
  background: linear-gradient(90deg, #efbc80 0%, #ffda93 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  padding-right: 20px;
`;
const LevelInfo = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--bs-body-color_active);
  line-height: 16px;
  span {
    padding-right: 5px;
  }
`;
const BgBox = styled.div`
  background: var(--bs-box--background);
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
`;
const RhtBoxB = styled.div`
  flex-grow: 1;
  font-size: 12px;
  font-weight: 400;
  color: var(--bs-body-color_active);
  line-height: 14px;
`;
const LftBox = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
`;

const RhtBox = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const InviteDetail = styled.span`
  a {
    color: var(--bs-primary);
  }
`;
