import { InputGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
// import { EvaIcon } from '@paljs/ui/Icon';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';

const OuterBox = styled.div`
  padding: 40px;
  height: 100%;
`;

const Box = styled.div``;
const CardBox = styled.div`
  background: #fff;
  height: 100%;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UlBox = styled.ul`
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 90px;
    }
  }
`;
const InputBox = styled(InputGroup)`
  width: 600px;
  margin-right: 20px;
  .wallet {
    border: 1px solid #eee;
    width: 100%;
    border-radius: 0.25rem;
    height: 40px;
    padding: 0 1.125rem;
    display: flex;
    align-items: center;
  }
`;
const MidBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  flex-direction: column;
`;

export default function Profile() {
  const {
    state: { userData },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wechat, setWechat] = useState('');
  const [mirror, setMirror] = useState('');
  const [google, setGoogle] = useState('');
  const [avatar, setAvatar] = useState('');

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
      case 'google':
        setGoogle(value);
        break;
    }
  };
  const saveProfile = async () => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !reg.test(email)) {
      showToast(t('My.IncorrectEmail'), ToastType.Danger);
      return;
    }

    if (google && !reg.test(google)) {
      showToast(t('My.IncorrectGoogle'), ToastType.Danger);
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
        google_profile: google,
        wechat,
        mirror,
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
      setGoogle(userData.google_profile);
      setWechat(userData.wechat);
      setMirror(userData.mirror);
    }
  }, [userData]);

  const getBase64 = (imgUrl: string) => {
    window.URL = window.URL || window.webkitURL;
    const xhr = new XMLHttpRequest();
    xhr.open('get', imgUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status == 200) {
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
        <Box>
          <AvatarBox>
            <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!avatar && (
                <div>
                  <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />
                  {/*<EvaIcon name="cloud-upload-outline" className="iconRht" />*/}
                </div>
              )}
              {!!avatar && (
                <ImgBox onClick={() => removeUrl()}>
                  <div className="del">{/*<EvaIcon className="iconTop" name="close-outline" status="Control" />*/}</div>
                  <img src={avatar} alt="" />
                </ImgBox>
              )}
            </UploadBox>
          </AvatarBox>

          <MidBox>
            <UlBox>
              <li>
                <div className="title">{t('My.wallet')}</div>
                <InputBox fullWidth>
                  <div className="wallet">{userData?.wallet}</div>
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Name')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={userName} onChange={(e) => handleInput(e, 'userName')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Email')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={email} onChange={(e) => handleInput(e, 'email')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Discord')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={discord} onChange={(e) => handleInput(e, 'discord')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Twitter')}</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="eg, https://twitter.com/..."
                    value={twitter}
                    onChange={(e) => handleInput(e, 'twitter')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.WeChat')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={wechat} onChange={(e) => handleInput(e, 'wechat')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Mirror')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={mirror} onChange={(e) => handleInput(e, 'mirror')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('My.Google')}</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="" value={google} onChange={(e) => handleInput(e, 'google')} />
                </InputBox>
              </li>
            </UlBox>
            <div>
              <Button onClick={saveProfile}>{t('general.confirm')}</Button>
            </div>
          </MidBox>
        </Box>
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
  margin-bottom: 40px;
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
    opacity: 0.8;
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
