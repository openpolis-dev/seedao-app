import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import React, { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { Button } from '@paljs/ui/Button';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { EvaIcon } from '@paljs/ui/Icon';
import useTranslation from 'hooks/useTranslation';

const Box = styled.div`
  padding: 40px 20px;
`;
const CardBox = styled(Card)`
  min-height: 85vh;
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
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const data = {
        name: userName,
        avatar,
        email,
        discord_profile: discord,
        twitter_profile: twitter,
        google_profile: google,
      };
      await requests.user.updateUser(data);
      // TODO updata global data
      dispatch({ type: AppActionType.SET_USER_DATA, payload: { ...userData, ...data } });
    } catch (error) {
      console.error('updateUser failed', error);
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
    <Layout title="Profile">
      <CardBox>
        <Box>
          <AvatarBox>
            <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!avatar && (
                <div>
                  <input id="fileUpload" type="file" hidden accept="image/*" />
                  <EvaIcon name="cloud-upload-outline" className="iconRht" />
                </div>
              )}
              {!!avatar && (
                <ImgBox>
                  <div className="del" onClick={() => removeUrl()}>
                    <EvaIcon name="close-outline" status="Control" />
                  </div>
                  <img src={avatar} alt="" />
                </ImgBox>
              )}
            </UploadBox>
          </AvatarBox>

          <MidBox>
            <UlBox>
              <li>
                <div className="title">名称</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={userName}
                    onChange={(e) => handleInput(e, 'userName')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">邮箱地址</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="Size small" value={email} onChange={(e) => handleInput(e, 'email')} />
                </InputBox>
              </li>
              <li>
                <div className="title">Discord</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={discord}
                    onChange={(e) => handleInput(e, 'discord')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Twitter</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={twitter}
                    onChange={(e) => handleInput(e, 'twitter')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">微信号</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={wechat}
                    onChange={(e) => handleInput(e, 'wechat')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Mirror</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={mirror}
                    onChange={(e) => handleInput(e, 'mirror')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Google</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={google}
                    onChange={(e) => handleInput(e, 'google')}
                  />
                </InputBox>
              </li>
            </UlBox>
            <div>
              <Button onClick={saveProfile}>确定</Button>
            </div>
          </MidBox>
        </Box>
      </CardBox>
    </Layout>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
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
    position: absolute;
    right: -15px;
    top: -15px;
    z-index: 999;
    padding: 6px;
    border-radius: 100%;
    background: #a16eff;
    color: #fff;
    cursor: pointer;
  }
`;
