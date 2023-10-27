import { InputGroup, Row, Col, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useEffect, useState, FormEvent, useMemo } from 'react';
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
import getConfig from 'utils/envCofnig';
const config = getConfig();

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const HeadBox = styled.div`
  position: relative;
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 40px;
`;
const CardBox = styled.div`
  background: #fff;
  min-height: 100%;
  padding: 20px 40px;
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UlBox = styled.ul`
  flex: 1;
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 70px;
    }
  }
  @media (max-width: 750px) {
    li {
      flex-direction: column;
      margin-bottom: 10px;
    }
  }
`;
const InputBox = styled(InputGroup)`
  max-width: 600px;
  .wallet {
    border: 1px solid #eee;
    width: 100%;
    border-radius: 0.25rem;
    height: 40px;
    padding: 0 1.125rem;
    display: flex;
    align-items: center;
    overflow-x: auto;
  }
  .copy-content {
    position: absolute;
    right: -30px;
    top: 8px;
  }
  @media (max-width: 1024px) {
    max-width: 100%;
  } ;
`;
const MidBox = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
  gap: 60px;
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

  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'userName':
        setUserName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'discord':
        setDiscord(value);
        break;
      case 'twitter':
        setTwitter(value);
        break;
      case 'wechat':
        setWechat(value);
        break;
      case 'mirror':
        setMirror(value);
        break;
      case 'bio':
        setBio(value);
    }
  };
  const saveProfile = async () => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !reg.test(email)) {
      showToast(t('My.IncorrectEmail'), ToastType.Danger);
      return;
    }
    if (mirror && mirror.indexOf('mirror.xyz') === -1) {
      showToast(t('My.IncorrectMirror'), ToastType.Danger);
      return;
    }
    if (twitter && !twitter.startsWith('https://twitter.com/')) {
      showToast(t('My.IncorrectLink', { media: 'Twitter' }), ToastType.Danger);
      return;
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const data = {
        name: userName,
        avatar,
        email,
        discord_profile: discord,
        twitter_profile: twitter,
        wechat,
        mirror,
        bio,
      };
      await requests.user.updateUser(data);
      dispatch({ type: AppActionType.SET_USER_DATA, payload: { ...userData, ...data } });
      showToast(t('My.ModifiedSuccess'), ToastType.Success);
    } catch (error) {
      console.error('updateUser failed', error);
      showToast(t('My.ModifiedFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

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
      <CardBox>
        <HeadBox>
          <AvatarBox>
            <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!avatar && (
                <div>
                  <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />
                  {<Upload />}
                </div>
              )}
              {!!avatar && (
                <ImgBox onClick={() => removeUrl()}>
                  <div className="del">
                    <X className="iconTop" />
                  </div>
                  <img src={avatar} alt="" />
                </ImgBox>
              )}
            </UploadBox>
          </AvatarBox>
          <InfoBox>
            <div className="wallet">
              <span>{sns || '-'}</span>
              {process.env.NODE_ENV === 'development' && (
                <TagBox>
                  <li>s4节点</li>
                  <li>s4节点</li>
                  <li>s4节点</li>
                </TagBox>
              )}
            </div>
            <div className="wallet">{userName}</div>
            <div className="wallet">
              <div>{userData?.wallet}</div>
              {userData?.wallet && (
                <CopyBox text={userData?.wallet} dir="right">
                  <img src={copyIcon} alt="" style={{ position: 'relative', top: '-2px' }} />
                </CopyBox>
              )}
            </div>
          </InfoBox>
          <EditButton to="/user/profile/edit">
            <Button variant="primary">编辑</Button>
          </EditButton>
        </HeadBox>
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
        <BioBox>
          {t('My.Bio')}: {bio || '-'}
        </BioBox>
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
      </CardBox>
    </OuterBox>
  );
}

const UploadBox = styled.label`
  background: #f8f8f8;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 20px;
  font-family: 'Inter-Regular';
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  .iconRht {
    margin-right: 10px;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
  gap: 10px;
  .wallet {
    display: flex;
    gap: 10px;
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
  margin-top: 20px;
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
  margin-left: 8px;
  display: flex;
  gap: 8px;
  li {
    border-radius: 5px;
    padding-inline: 10px;
    border: 1px solid #ccc;
    line-height: 22px;
  }
`;

const EditButton = styled(Link)`
  position: absolute;
  right: 20px;
  top: 20px;
`;
