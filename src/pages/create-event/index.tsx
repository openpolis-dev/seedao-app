import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import { InputGroup } from '@paljs/ui/Input';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import { useAuthContext } from 'providers/authProvider';
import useToast from 'hooks/useToast';

const Box = styled.div`
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled(Card)`
  min-height: 80vh;
`;

const BtmBox = styled.div`
  margin: 50px 0;
  padding-left: 440px;
`;

const UlBox = styled.ul`
  width: 100%;
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 180px;
      background: #f7f9fc;
      padding: 0 20px;
      text-align: right;
    }
  }
`;

const InputBox = styled(InputGroup)`
  margin-right: 20px;
  width: 100%;
`;

const BackBox = styled.div`
  padding: 30px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    font-size: 24px;
  }
`;

const BtnBox = styled.label`
  background: #f7f9fc;
  height: 566px;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-family: 'Inter-Regular';
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 40px;
  margin-right: 40px;
  flex-shrink: 0;
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

const InnerBox = styled.div`
  display: flex;
  align-content: flex-start;
`;

export default function CreateGuild() {
  const router = useRouter();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [moderator, setmoderator] = useState('');
  const [guest, setGuest] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [url, setUrl] = useState('');

  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'title':
        setTitle(value);
        break;
      case 'startAt':
        setStartAt(value);
        break;
      case 'endAt':
        setEndAt(value);
        break;
      case 'sponsor':
        setSponsor(value);
        break;
      case 'moderator':
        setmoderator(value);
        break;
      case 'guest':
        setGuest(value);
        break;
      case 'volunteer':
        setVolunteer(value);
        break;
    }
  };

  const handleSubmit = async () => {};

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
          setUrl(result);
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
    setUrl('');
  };

  return (
    <Layout title="SeeDAO | Create Guild">
      <Box>
        {Toast}
        <CardBox>
          <BackBox onClick={() => router.back()}>
            <EvaIcon name="chevron-left-outline" className="icon" /> <span>{t('general.back')}</span>
          </BackBox>
          <CardHeader> Create Event</CardHeader>
          <CardBody>
            <InnerBox>
              <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
                {!url && (
                  <div>
                    <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                    <EvaIcon name="cloud-upload-outline" className="iconRht" />
                    <span> Upload Image</span>
                  </div>
                )}
                {!!url && (
                  <ImgBox>
                    <div className="del" onClick={() => removeUrl()}>
                      <EvaIcon name="close-outline" status="Control" />
                    </div>
                    <img src={url} alt="" />
                  </ImgBox>
                )}
              </BtnBox>
              <UlBox>
                <li>
                  <div className="title">活动名称</div>
                  <InputBox fullWidth>
                    <input type="text" placeholder="项目名称" value={title} onChange={(e) => handleInput(e, 'title')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">开始时间</div>
                  <InputBox fullWidth>
                    <input type="text" value={startAt} onChange={(e) => handleInput(e, 'startAt')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">结束时间</div>
                  <InputBox fullWidth>
                    <input type="text" value={endAt} onChange={(e) => handleInput(e, 'endAt')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">主办</div>
                  <InputBox fullWidth>
                    <input type="text" value={sponsor} onChange={(e) => handleInput(e, 'sponsor')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">主持人</div>
                  <InputBox fullWidth>
                    <input type="text" value={moderator} onChange={(e) => handleInput(e, 'moderator')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">嘉宾</div>
                  <InputBox fullWidth>
                    <input type="text" value={guest} onChange={(e) => handleInput(e, 'guest')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">志愿者</div>
                  <InputBox fullWidth>
                    <input type="text" value={volunteer} onChange={(e) => handleInput(e, 'volunteer')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">内容</div>
                  <InputBox fullWidth>
                    <textarea name="d" id=""></textarea>
                  </InputBox>
                </li>
              </UlBox>
            </InnerBox>
            <BtmBox>
              <Button appearance="outline" className="btnBtm">
                {t('general.cancel')}
              </Button>
              <Button onClick={() => handleSubmit()}>{t('general.confirm')}</Button>
            </BtmBox>
          </CardBody>
        </CardBox>
      </Box>
    </Layout>
  );
}
