import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/useToast';
import { ContainerPadding } from 'assets/styles/global';
import useParseSNS from 'hooks/useParseSNS';
import CopyBox from 'components/copy';

import TwitterIcon from '../../../assets/Imgs/profile/Twitter.svg';
import DiscordIcon from '../../../assets/Imgs/profile/discord.svg';
import WechatIcon from '../../../assets/Imgs/profile/wechat.svg';
import MirrorImg from '../../../assets/Imgs/profile/mirror.svg';
import EmailIcon from '../../../assets/Imgs/profile/message.svg';
import { formatNumber } from 'utils/number';
import { Link } from 'react-router-dom';
import CopyIconSVG from '../../../assets/Imgs/copy.svg';
import defaultImg from '../../../assets/Imgs/defaultAvatar.png';

const OuterBox = styled.div`
  margin-bottom: 50px;

  ${ContainerPadding};
`;

const HeadBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
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
    state: { userData },
  } = useAuthContext();
  const sns = useParseSNS(userData?.wallet);
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState<string | undefined>('');

  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [roles, setRoles] = useState<any[]>([]);

  const [sbt, setSbt] = useState<any[]>([]);
  const [seed, setSeed] = useState<any[]>([]);

  useEffect(() => {
    if (userData) {
      setUserName(userData.nickname);
      setAvatar(userData.avatar);

      setBio(userData.bio);
      setRoles(userData.roles!);

      let sbtArr = userData.sbt;

      const sbtFor = sbtArr.filter((item: any) => item.name && item.image_uri);
      setSbt(sbtFor);
      setSeed(userData.seed);
    }
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
      case 'wechat':
        return <img src={WechatIcon} alt="" />;
      case 'email':
        return (
          <a href={`mailto:${val}`} target="_blank">
            <img src={EmailIcon} alt="" />
          </a>
        );

      case 'discord':
        return <img src={DiscordIcon} alt="" />;
      case 'mirror':
        return (
          <a href={val} target="_blank">
            <img src={MirrorImg} alt="" />
          </a>
        );
    }
  };

  const AddressToShow = (address: string) => {
    if (!address) return '';
    const frontStr = address.substring(0, 16);
    const afterStr = address.substring(address.length - 4, address.length);
    return `${frontStr}...${afterStr}`;
  };

  return (
    <OuterBox>
      {Toast}
      <>
        <TitleBox>{t('My.MyProfile')}</TitleBox>
        <HeadBox>
          <AvatarBox>
            <ImgBox onClick={() => removeUrl()}>
              <img src={avatar ? avatar : defaultImg} alt="" />
            </ImgBox>
          </AvatarBox>
          <InfoBox>
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
              <span>{AddressToShow(userData?.wallet!)}</span>
              {userData?.wallet && (
                <CopyBox text={userData?.wallet} dir="right">
                  <img src={CopyIconSVG} alt="" />
                </CopyBox>
              )}
            </div>
          </InfoBox>
          <EditButton to="/user/profile/edit">
            <Button variant="primary">{t('general.edit')}</Button>
          </EditButton>
        </HeadBox>
        {!!bio && (
          <BioBox>
            <div className="title">{t('My.Bio')}</div>
            <div>{bio || '-'}</div>
          </BioBox>
        )}

        <TagBox>
          {roles?.map((item, index) => (
            <li key={`tag_${index}`}>{switchRoles(item)}</li>
          ))}
        </TagBox>
        <LinkBox>
          {userData?.social_accounts?.map((item: any, index: number) => (
            <li key={`sbtInner_${index}`}>
              <span className="iconLft">{returnSocial(item.network, item.identity)}</span>
            </li>
          ))}
          <li>
            <span className="iconLft">{returnSocial('email', userData?.email)}</span>
          </li>
        </LinkBox>
        <>
          <ProgressOuter>
            <div>
              <Crt>
                <div>{t('My.current')}</div>
                <div className="num">{userData?.level?.upgrade_percent}%</div>
              </Crt>
              <ProgressBox width="60">
                <div className="inner" />
              </ProgressBox>
              <TipsBox>
                <div>{t('My.nextLevel')}</div>
                <div className="scr">{formatNumber(userData?.level?.scr_to_next_lv)} SCR</div>
              </TipsBox>
            </div>
            <FstLine>
              <LevelBox>
                {t('My.level')} {userData?.level?.current_lv}
              </LevelBox>
              <SCRBox>{formatNumber(userData?.scr?.amount)} SCR</SCRBox>
            </FstLine>
          </ProgressOuter>
          <NftBox>
            <li>
              <div className="title">SEED</div>
              <div className="ul">
                {seed?.map((item, index) => (
                  <div key={index} className="li">
                    {' '}
                    <img src={item.image_uri} alt="" />
                  </div>
                ))}
              </div>
            </li>
            <li>
              <div className="title">SBT</div>
              <div className="ul">
                {sbt?.map((item, index) => (
                  <div key={index} className="li">
                    {' '}
                    <img src={item.image_uri} alt="" />
                  </div>
                ))}
              </div>
            </li>
          </NftBox>
        </>
      </>
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
    max-width: 100%;
    max-height: 100%;
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
    margin-bottom: 16px;
  }
  .wallet {
    display: flex;
    font-size: 14px;
    span {
      margin-right: 10px;
    }
  }
  .btm8 {
    margin-bottom: 8px;
  }
`;

const NftBox = styled.ul`
  li {
    margin-bottom: 40px;
  }
  .ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .li {
    width: 120px;
    height: 120px;
    margin: 0 24px 24px 0;
  }
  .title {
    margin-bottom: 20px;
    color: var(--bs-body-color_active);
    font-size: 16px;
  }
  img {
    width: 100%;

    margin-bottom: 20px;
    border-radius: 16px;
  }
`;

const BioBox = styled.section`
  margin: 20px 0 40px;
  color: var(--bs-body-color_active);

  width: 582px;
  font-size: 14px;
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
    margin-right: 16px;
  }
  .copy-content {
    display: inline-block;
  }
`;

const ProgressBox = styled.div<{ width: number | string }>`
  width: 320px;
  height: 12px;
  background: rgba(255, 113, 147, 0.21);
  border-radius: 10px;
  overflow: hidden;
  .inner {
    height: 10px;
    background: #ff7193;
    width: ${(props) => props.width + '%'};
    border-radius: 8px;
  }
`;

const ProgressOuter = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 44px 0;
`;

const FstLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0 0 12px;
  color: var(--bs-body-color_active);
`;

const LevelBox = styled.div`
  padding: 2px 10px;
  border-radius: 7px;
  text-transform: uppercase;
  font-size: 12px;
`;

const SCRBox = styled.div`
  font-size: 15px;
  text-align: right;
  font-weight: 700;
`;
const TipsBox = styled.div`
  color: #b5b6c4;
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--bs-body-color_active);
  .scr {
    margin-left: 8px;
    font-size: 16px;
    margin-bottom: -3px;
  }
`;

const TagBox = styled.ul`
  font-size: 12px;
  flex-wrap: wrap;
  display: flex;
  font-weight: 400;
  width: 600px;
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
  position: absolute;
  right: 20px;
  top: 0;
  .btn {
    padding: 10px 30px;
  }
`;

const Crt = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--bs-body-color_active);
  margin-bottom: 21px;
  .num {
    color: #ff7193;
    font-size: 16px;
    margin-left: 8px;
  }
`;
