import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import { X } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import UploadImg from '../../../assets/Imgs/profile/upload.svg';
import userImg from '../../../assets/Imgs/profile/name.svg';
import EmailImg from '../../../assets/Imgs/profile/email.svg';
import DiscordImg from '../../../assets/Imgs/profile/discordIcon.svg';
import TwitterImg from '../../../assets/Imgs/profile/twitterIcon.svg';
import WechatImg from '../../../assets/Imgs/profile/wechatIcon.svg';
import MirrorImg from '../../../assets/Imgs/profile/mirrorIcon.svg';
import DescImg from '../../../assets/Imgs/profile/desc.svg';
import GithubImg from '../../../assets/Imgs/profile/github.svg';
import { useNavigate } from 'react-router-dom';

const OuterBox = styled.div`
  ${ContainerPadding};
  input {
    min-height: 40px;
  }
`;

const HeadBox = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 40px;
`;
const CardBox = styled.div`
  min-height: 100%;
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  overflow: hidden;
  label {
    margin-top: 0;
  }
`;

const UlBox = styled.ul`
  width: 600px;
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 16px;
      margin-top: 8px;
      min-width: 90px;
      display: flex;
      font-size: 14px;
      color: var(--bs-body-color_active);
    }
    .icon {
      margin-right: 10px;
      img {
        height: 16px;
        line-height: 16px;
      }
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
  padding-bottom: 40px;
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold;
  color: var(--bs-body-color_active);
  line-height: 30px;
  margin-bottom: 40px;
`;

export default function Profile() {
  const {
    state: { userData },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState<string | undefined>('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wechat, setWechat] = useState('');
  const [github, setGithub] = useState('');
  const [mirror, setMirror] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  const navigate = useNavigate();
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
      case 'github':
        setGithub(value);
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
        name: userName!,
        avatar,
        email,
        discord_profile: discord,
        twitter_profile: twitter,
        wechat,
        github_profile: github,
        mirror,
        bio,
      };
      await requests.user.updateUser(data);
      dispatch({ type: AppActionType.SET_USER_DATA, payload: { ...userData, ...data } });
      showToast(t('My.ModifiedSuccess'), ToastType.Success);
      setTimeout(() => {
        navigate('/user/profile');
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('updateUser failed', error);
      showToast(t('My.ModifiedFailed'), ToastType.Danger);
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    if (userData) {
      const detail = (userData as any).data;

      setUserName(detail.nickname);
      setAvatar(detail.avatar);
      setEmail(detail.email || '');

      let mapArr = new Map();

      detail.social_accounts?.map((item: any) => {
        mapArr.set(item.network, item.identity);
      });
      setTwitter(mapArr.get('twitter') ?? '');
      setDiscord(mapArr.get('discord') ?? '');
      setWechat(mapArr.get('wechat') ?? '');
      setMirror(mapArr.get('mirror') ?? '');
      setGithub(mapArr.get('github') ?? '');

      setBio(detail.bio);
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
        <TitleBox>{t('My.MyProfile')}</TitleBox>
        <HeadBox>
          <AvatarBox>
            <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!avatar && (
                <div>
                  <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />
                  {<img src={UploadImg} />}
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
        </HeadBox>
        <MidBox>
          <UlBox>
            <li>
              <div className="title">
                <div className="icon">
                  <img src={userImg} alt="" />
                </div>
                {t('My.Name')}
              </div>
              <InputBox>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={userName}
                  onChange={(e) => handleInput(e, 'userName')}
                />
              </InputBox>
            </li>
            <li>
              <div className="title">
                <div className="icon">
                  <img src={DescImg} alt="" />
                </div>
                {t('My.Bio')}
              </div>
              <InputBox>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={bio}
                  onChange={(e) => handleInput(e, 'bio')}
                />
              </InputBox>
            </li>
            <li>
              <div className="title">
                <div className="icon">
                  <img src={EmailImg} alt="" />
                </div>
                {t('My.Email')}
              </div>
              <InputBox>
                <Form.Control type="text" placeholder="" value={email} onChange={(e) => handleInput(e, 'email')} />
              </InputBox>
            </li>
            {/*<li>*/}
            {/*  <div className="title">*/}
            {/*    <div className="icon">*/}
            {/*      <img src={DiscordImg} alt="" />*/}
            {/*    </div>*/}
            {/*    {t('My.Discord')}*/}
            {/*  </div>*/}
            {/*  <InputBox>*/}
            {/*    <Form.Control type="text" placeholder="" value={discord} onChange={(e) => handleInput(e, 'discord')} />*/}
            {/*  </InputBox>*/}
            {/*</li>*/}
            <li>
              <div className="title">
                <div className="icon">
                  <img src={TwitterImg} alt="" />
                </div>
                {t('My.Twitter')}
              </div>
              <InputBox>
                <Form.Control
                  type="text"
                  placeholder="eg, https://twitter.com/..."
                  value={twitter}
                  onChange={(e) => handleInput(e, 'twitter')}
                />
              </InputBox>
            </li>
            {/*<li>*/}
            {/*  <div className="title">*/}
            {/*    <div className="icon">*/}
            {/*      <img src={WechatImg} alt="" />*/}
            {/*    </div>*/}
            {/*    {t('My.WeChat')}*/}
            {/*  </div>*/}
            {/*  <InputBox>*/}
            {/*    <Form.Control type="text" placeholder="" value={wechat} onChange={(e) => handleInput(e, 'wechat')} />*/}
            {/*  </InputBox>*/}
            {/*</li>*/}
            <li>
              <div className="title">
                <div className="icon">
                  <img src={MirrorImg} alt="" />
                </div>
                {t('My.Mirror')}
              </div>
              <InputBox>
                <Form.Control type="text" placeholder="" value={mirror} onChange={(e) => handleInput(e, 'mirror')} />
              </InputBox>
            </li>
            <li>
              <div className="title">
                <div className="icon">
                  <img src={GithubImg} alt="" />
                </div>
                {t('My.Github')}
              </div>
              <InputBox>
                <Form.Control type="text" placeholder="" value={github} onChange={(e) => handleInput(e, 'github')} />
              </InputBox>
            </li>
            <RhtLi>
              <Button onClick={() => saveProfile()}>{t('general.confirm')}</Button>
            </RhtLi>
          </UlBox>
        </MidBox>
      </CardBox>
    </OuterBox>
  );
}

const RhtLi = styled.div`
  width: 600px;
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  .btn {
    padding: 10px 31px;
    font-size: 14px;
  }
`;

const UploadBox = styled.label`
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  height: 80px;
  width: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 20px;
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
