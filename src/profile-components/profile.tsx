import styled from 'styled-components';
import defaultImg from '../assets/Imgs/defaultAvatar.png';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../providers/authProvider';
import { useTranslation } from 'react-i18next';
import useToast from '../hooks/useToast';
import PublicJs from '../utils/publicJs';

import TwitterIcon from 'assets/Imgs/social/twitter.png';
import MirrorImg from 'assets/Imgs/social/mirror.png';
import MirrorImgDark from 'assets/Imgs/social/mirror_dark.png';
import EmailIcon from 'assets/Imgs/social/email.png';
import GithubImg from 'assets/Imgs/social/github.png';
import GithubImgDark from 'assets/Imgs/social/github_dark.png';

import SeedList from './seed';
import Sbt from './Sbt';

const Box = styled.div`
  width: 512px;
  background: var(--profile-bg);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-box);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  margin-bottom: 200px;
`;
const TopBox = styled.div`
  background: var(--bs-background);
  padding: 27px 24px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: flex-start;
`;

const LftBox = styled.div`
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
`;

const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
`;

const ImgBox = styled.div`
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  .userName {
    color: var(--bs-body-color_active);
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 23px;
    margin-bottom: 6px;
  }
  .lineBox {
    display: flex;
    align-items: flex-start;
  }
  .sns {
    color: var(--bs-body-color);
    font-size: 12px;
  }
`;

const BioBox = styled.section`
  margin: 6px 0;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`;

const TagBox = styled.ul`
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
const LinkBox = styled.ul`
  display: flex;
  li {
    margin-right: 2px;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .copy-content {
    display: inline-block;
  }
`;

const BgBox = styled.div`
  background: var(--bs-box--background);
  padding: 20px 0;
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  display: flex;
  //flex-direction: column;
  align-items: center;
  margin: 10px 14px;
`;

const RhtBoxB = styled.div`
  flex-grow: 1;
  font-size: 12px;
  font-weight: 400;
  color: var(--bs-body-color_active);
  line-height: 14px;
`;

const BgBox2 = styled(BgBox)`
  margin-top: 0;
  margin-bottom: 25px;
`;

const TitTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
  font-size: 12px;
  font-weight: 500;
  color: var(--bs-body-color_active);
  line-height: 16px;
  padding: 0 24px;
`;

const LevelBox = styled.div`
  font-size: 16px;
  font-weight: normal;
  font-family: 'Poppins-Bold';
  background: linear-gradient(90deg, #efbc80 0%, #ffda93 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  padding-inline: 10px;
`;

const InneBox = styled.div``;

export default function ProfileComponent({ userData, theme, sns }: any) {
  const { t } = useTranslation();
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

  useEffect(() => {
    if (!seed?.length) return;
    setList([]);
    setSbtList([]);

    const getSeed = async () => {
      let arr = [];
      for (let i = 0; i < seed.length; i++) {
        let seedItem = seed[i];
        let url = await PublicJs.getImage(seedItem.image_uri);
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
      let detail = (userData as any)?.sp;

      console.log(userData);
      setDetail(detail);
      setUserName(detail?.nickname);
      console.error('==detail.name==', detail);
      let avarUrl = await PublicJs.getImage(detail?.avatar);
      setAvatar(avarUrl!);
      setWallet(detail?.wallet);
      setBio(detail?.bio);
      setRoles(detail?.roles!);

      let sbtArr = detail?.sbt ?? [];

      const sbtFor = sbtArr?.filter((item: any) => item.name && item.image_uri);
      setSbt(sbtFor);
      setSeed(detail?.seed ?? []);
    }
  };

  useEffect(() => {
    if (!userData) return;
    getDetail();
  }, [userData]);

  const switchRoles = (role: string) => {
    let str: string = '';
    switch (role) {
      case 'SGN_HOLDER':
        str = t('roles.SGN_HOLDER');
        break;
      case 'NODE_S1':
        str = t('roles.NODE_S1');
        break;
      case 'NODE_S2':
        str = t('roles.NODE_S2');
        break;
      case 'NODE_S3':
        str = t('roles.NODE_S3');
        break;
      case 'NODE_S4':
        str = t('roles.NODE_S4');
        break;
      case 'NODE_S5':
        str = t('roles.NODE_S5');
        break;
      case 'CITYHALL_S1':
        str = t('roles.CITYHALL_S1');
        break;
      case 'CITYHALL_S2':
        str = t('roles.CITYHALL_S2');
        break;
      case 'CITYHALL_S3':
        str = t('roles.CITYHALL_S3');
        break;
      case 'CITYHALL_S4':
        str = t('roles.CITYHALL_S4');
        break;
      case 'CITYHALL_S5':
        str = t('roles.CITYHALL_S5');
        break;
      case 'CONTRIBUTOR_L1':
        str = t('roles.CONTRIBUTOR_L1');
        break;
      case 'CONTRIBUTOR_L2':
        str = t('roles.CONTRIBUTOR_L2');
        break;
      case 'CONTRIBUTOR_L3':
        str = t('roles.CONTRIBUTOR_L3');
        break;
      case 'CONTRIBUTOR_L4':
        str = t('roles.CONTRIBUTOR_L4');
        break;
      case 'CONTRIBUTOR_L5':
        str = t('roles.CONTRIBUTOR_L5');
        break;
      case 'CONTRIBUTOR_L6':
        str = t('roles.CONTRIBUTOR_L6');
        break;
      case 'CONTRIBUTOR_L7':
        str = t('roles.CONTRIBUTOR_L7');
        break;
      case 'CONTRIBUTOR_L8':
        str = t('roles.CONTRIBUTOR_L8');
        break;
      case 'CONTRIBUTOR_L9':
        str = t('roles.CONTRIBUTOR_L9');
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
            <img src={theme ? MirrorImgDark : MirrorImg} alt="" />
          </a>
        );
      case 'github':
        return (
          <a href={val} target="_blank">
            <img src={theme ? GithubImgDark : GithubImg} alt="" />
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
    <Box>
      <TopBox>
        <LftBox>
          <AvatarBox>
            <ImgBox>
              <img src={avatar ? avatar : defaultImg} alt="" />
            </ImgBox>
          </AvatarBox>
        </LftBox>
        <InfoBox>
          <div className="lineBox">
            <div className="userName">{userName}</div>
            <LevelBox>LV{detail?.level?.current_lv}</LevelBox>
          </div>
          <div className="sns">{sns}</div>
          <BioBox>
            <div>{bio || '-'}</div>
          </BioBox>
          <TagBox>
            {roles?.map((item, index) => (
              <li key={`tag_${index}`}>{switchRoles(item)}</li>
            ))}
          </TagBox>
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
        </InfoBox>
      </TopBox>
      <BgBox>
        <InneBox>
          <TitTop>SEED({list.length})</TitTop>
          <RhtBoxB>
            <SeedList list={list} />
          </RhtBoxB>
        </InneBox>
      </BgBox>
      <BgBox2>
        <InneBox>
          <TitTop>SBT({sbtList.length})</TitTop>
          <RhtBoxB>
            <Sbt list={sbtArr} />
          </RhtBoxB>
        </InneBox>
      </BgBox2>
    </Box>
  );
}
