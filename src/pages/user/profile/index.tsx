import { Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import { Upload, X } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import useParseSNS from 'hooks/useParseSNS';
import CopyBox from 'components/copy';
import copyIcon from 'assets/images/copy.svg';
import SeedIcon from 'assets/images/seed.png';

import TwitterIcon from 'assets/images/twitterNor.svg';
import DiscordIcon from 'assets/images/discordNor.svg';
import EmailIcon from 'assets/images/email.svg';
import { formatNumber } from 'utils/number';
import { Link } from 'react-router-dom';
import CopyIconSVG from '../../../assets/Imgs/copy.svg';

const OuterBox = styled.div`
  min-height: 100%;
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
    dispatch,
  } = useAuthContext();
  const sns = useParseSNS(userData?.wallet);
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wechat, setWechat] = useState('');
  const [mirror, setMirror] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  // const saveProfile = async () => {
  //   const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (email && !reg.test(email)) {
  //     showToast(t('My.IncorrectEmail'), ToastType.Danger);
  //     return;
  //   }
  //   if (mirror && mirror.indexOf('mirror.xyz') === -1) {
  //     showToast(t('My.IncorrectMirror'), ToastType.Danger);
  //     return;
  //   }
  //   if (twitter && !twitter.startsWith('https://twitter.com/')) {
  //     showToast(t('My.IncorrectLink', { media: 'Twitter' }), ToastType.Danger);
  //     return;
  //   }
  //
  //   dispatch({ type: AppActionType.SET_LOADING, payload: true });
  //   try {
  //     const data = {
  //       name: userName,
  //       avatar,
  //       email,
  //       discord_profile: discord,
  //       twitter_profile: twitter,
  //       wechat,
  //       mirror,
  //       bio,
  //     };
  //     await requests.user.updateUser(data);
  //     dispatch({ type: AppActionType.SET_USER_DATA, payload: { ...userData, ...data } });
  //     showToast(t('My.ModifiedSuccess'), ToastType.Success);
  //   } catch (error) {
  //     console.error('updateUser failed', error);
  //     showToast(t('My.ModifiedFailed'), ToastType.Danger);
  //   } finally {
  //     dispatch({ type: AppActionType.SET_LOADING, payload: false });
  //   }
  // };

  useEffect(() => {
    if (userData) {
      setUserName(userData.name);
      setAvatar(userData.avatar);
      setEmail(userData.email || '');
      setDiscord(userData.discord_profile);
      setTwitter(userData.twitter_profile);
      setWechat(userData.wechat);
      setMirror(userData.mirror);
      setBio(userData.bio);
    }
  }, [userData]);

  const getBase64 = (imgUrl: string) => {
    window.URL = window.URL || window.webkitURL;
    const xhr = new XMLHttpRequest();
    xhr.open('get', imgUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status === 200) {
        const blob = this.response;
        const oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          const { result } = e.target as any;
          setAvatar(result);
        };
        oFileReader.readAsDataURL(blob);
      }
    };
    xhr.send();
  };

  const updateLogo = (e: FormEvent) => {
    const { files } = e.target as any;
    const url = window.URL.createObjectURL(files[0]);
    getBase64(url);
  };

  const removeUrl = () => {
    setAvatar('');
  };

  return (
    <OuterBox>
      {Toast}
      <div>
        <TitleBox>{t('My.MyProfile')}</TitleBox>
        <HeadBox>
          <AvatarBox>
            {!avatar && (
              <div>
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />
                {<Upload />}
              </div>
            )}
            {!!avatar && (
              <ImgBox onClick={() => removeUrl()}>
                <img src={avatar} alt="" />
              </ImgBox>
            )}
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
              <span>{userData?.wallet}</span>
              {userData?.wallet && (
                <CopyBox text={userData?.wallet} dir="right">
                  <img src={CopyIconSVG} alt="" />
                </CopyBox>
              )}
            </div>
          </InfoBox>
          <EditButton to="/user/profile/edit">
            <Button variant="primary">编辑</Button>
          </EditButton>
        </HeadBox>
        {!!bio && (
          <BioBox>
            <div className="title">{t('My.Bio')}</div>
            <div>{bio || '-'}</div>
          </BioBox>
        )}
        <>
          {process.env.NODE_ENV === 'development' && (
            <TagBox>
              {[...Array(13)].map((item, index) => (
                <li key={`tag_${index}`}>s4节点</li>
              ))}
            </TagBox>
          )}
        </>
        <LinkBox>
          {twitter && (
            <a href={twitter} target="_blank" rel="noreferrer">
              <img src={TwitterIcon} alt="" className="icon" width="20px" height="20px" />
            </a>
          )}
          {discord && (
            <CopyBox text={discord || ''} dir="right">
              <img src={DiscordIcon} alt="" className="icon" width="20px" height="20px" />
            </CopyBox>
          )}
          {email && (
            <CopyBox text={email || ''}>
              <img src={EmailIcon} alt="" className="icon" width="20px" height="20px" />
            </CopyBox>
          )}

          {wechat && (
            <a href={wechat} target="_blank" rel="noopener noreferrer" className="icon">
              wehat
            </a>
          )}
          {mirror && (
            <a href={mirror} target="_blank" rel="noopener noreferrer" className="icon">
              mirror
            </a>
          )}
        </LinkBox>

        {process.env.NODE_ENV === 'development' && (
          <>
            <ProgressOuter>
              <FstLine>
                <LevelBox>level 2</LevelBox>
                <SCRBox>{formatNumber(50000)} SCR</SCRBox>
              </FstLine>
              <ProgressBox width="60">
                <div className="inner" />
              </ProgressBox>
              <TipsBox>
                <div>next level</div>
                <div>{formatNumber(10000)} SCR</div>
              </TipsBox>
            </ProgressOuter>
            <NftBox>
              <div className="title">SEED</div>
              <Row>
                {[...Array(8)].map((item, index) => (
                  <Col key={index} sm={12} md={6} lg={3} xl={2}>
                    <img src={SeedIcon} alt="" />
                  </Col>
                ))}
              </Row>
              <div className="title">SBT</div>
              <Row>
                {[...Array(8)].map((item, index) => (
                  <Col key={index} sm={12} md={6} lg={3} xl={2}>
                    <img src={SeedIcon} alt="" />
                  </Col>
                ))}
              </Row>
            </NftBox>
          </>
        )}
      </div>
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

const NftBox = styled.section`
  margin-block: 20px;
  .title {
    margin-bottom: 20px;
  }
  img {
    width: 100%;
    margin-bottom: 20px;
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

const LinkBox = styled.div`
  margin-top: 20px;
  img {
    width: 20px;
    height: 20px;
  }
  .icon {
    margin-inline: 5px !important;
  }
  .copy-content {
    display: inline-block;
  }
`;

const ProgressBox = styled.div<{ width: number | string }>`
  width: 100%;
  height: 10px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
  .inner {
    height: 8px;
    background: #000;
    width: ${(props) => props.width + '%'};
    border-radius: 8px;
  }
`;

const ProgressOuter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0 20px;
  width: 300px;
`;

const FstLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const LevelBox = styled.div`
  background: #ff3231;
  color: #fff;
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
  justify-content: space-between;
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
