import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateGuildInfo, UpdateGuildParamsType } from 'requests/guild';
import { IGuildDisplay, InfoObj, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import CameraIconSVG from 'components/svgs/camera';
import { useNavigate } from 'react-router-dom';
import { compressionFile, fileToDataURL } from 'utils/image';
import { ethers } from 'ethers';
import sns from '@seedao/sns-js';

export default function EditGuild({ detail }: { detail?: IGuildDisplay }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();

  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [leader, setLeader] = useState('');
  const [contact, setContact] = useState('');
  const [link, setLink] = useState('');

  const handleLeaderSNS = (address: string) => {
    sns
      .name(address)
      .then((res) => {
        setLeader(res || address);
      })
      .catch((err) => {
        setLeader(address);
      });
  };

  useEffect(() => {
    if (detail) {
      setProName(detail.name);
      setDesc(detail.desc);
      setUrl(detail.logo);
      setContact(detail.ContantWay);
      setLink(detail.OfficialLink);
      handleLeaderSNS(detail.sponsors[0]);
    }
  }, [detail]);

  const checkBeforeSubmit = async (): Promise<UpdateGuildParamsType | undefined> => {
    if (!link.startsWith('https://') && !link.startsWith('http://')) {
      showToast(t('Msg.InvalidField', { field: t('Project.OfficialLink') }), ToastType.Danger);
      return;
    }
    let _leader = leader;
    if (!ethers.utils.isAddress(leader)) {
      if (!leader!.endsWith('.seedao')) {
        showToast(t('Msg.IncorrectAddress', { content: leader }), ToastType.Danger);
        return;
      }
      try {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        const res = await sns.resolves([leader]);
        if (ethers.constants.AddressZero === res[0]) {
          showToast(t('Msg.IncorrectAddress', { content: leader }), ToastType.Danger);
          return;
        }
        _leader = res[0];
      } catch (error) {
        showToast(t('Msg.QuerySNSFailed'), ToastType.Danger);
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
        return;
      }
    }
    return {
      ContantWay: contact,
      OfficialLink: link,
      desc: desc,
      logo: url,
      name: proName,
      sponsors: [_leader],
    };
  };

  const handleSubmit = async () => {
    const params = await checkBeforeSubmit();
    if (!params) {
      return;
    }
    try {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await updateGuildInfo(detail!.id, params);
      showToast(t('Guild.changeInfoSuccess'), ToastType.Success);
      navigate(`/guild/info/${detail?.id}`);
    } catch (error: any) {
      showToast(error?.data?.message || error, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const updateLogo = async (e: FormEvent) => {
    const { files } = e.target as any;
    const file = files[0];
    const new_file = await compressionFile(file, file.type);
    const base64 = await fileToDataURL(new_file);
    setUrl(base64);
  };

  const submitDisabled = [proName, desc, leader, link, contact].some(
    (item) => !item || (typeof item === 'string' && !item.trim()),
  );
  return (
    <EditPage>
      <MainContent>
        <TopBox>
          <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
            <ImgBox>
              {url && <img src={url} alt="" />}
              <UpladBox
                className="upload"
                bg={
                  theme
                    ? 'linear-gradient(180deg, rgba(13,12,15,0) 0%, rgba(38,27,70,0.6) 100%)'
                    : 'linear-gradient(180deg, rgba(217,217,217,0) 0%, rgba(0,0,0,0.6) 100%)'
                }
              >
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                <CameraIconSVG />
                <UploadImgText>{t('Guild.upload')}</UploadImgText>
              </UpladBox>
            </ImgBox>
            {!url && (
              <UpladBox>
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                <CameraIconSVG />
                <UploadImgText>{t('Guild.upload')}</UploadImgText>
              </UpladBox>
            )}
          </BtnBox>
        </TopBox>
        <UlBox>
          <li>
            <div className="title">{t('Guild.ProjectName')}</div>
            <InputBox>
              <Form.Control
                type="text"
                placeholder={t('Guild.ProjectName')}
                value={proName}
                onChange={(e) => setProName(e.target.value)}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Guild.Moderator')}</div>
            <InputBox>
              <Form.Control
                type="text"
                placeholder={t('Guild.AddMemberAddress')}
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Guild.Contact')}</div>
            <InputBox>
              <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Guild.OfficialLink')}</div>
            <InputBox>
              <Form.Control type="text" value={link} onChange={(e) => setLink(e.target.value)} />
            </InputBox>
          </li>

          <li>
            <div className="title">{t('Guild.Desc')}</div>
            <Form.Control
              placeholder=""
              as="textarea"
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </li>
        </UlBox>
      </MainContent>

      <BtmBox>
        <Button onClick={() => handleSubmit()} disabled={submitDisabled}>
          {t('general.confirm')}
        </Button>
      </BtmBox>
    </EditPage>
  );
}

const EditPage = styled.div`
  width: 100%;
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const TopBox = styled.section`
  display: flex;
`;

const IntroBox = styled.div``;

const MainContent = styled.div`
  display: flex;
  gap: 32px;
`;

const BtnBox = styled.label`
  background: var(--bs-box--background);
  height: 110px;
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-weight: 700;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  .iconRht {
    margin-right: 10px;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .uploadIcon {
    font-size: 20px;
    margin-right: 10px;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
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
  .upload {
    display: none;
  }
  &:hover .upload {
    display: flex;
  }
`;

const UpladBox = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  background: ${(props) => props.bg};
`;

const UploadImgText = styled.p`
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--bs-svg-color);
  line-height: 12px;
`;

const BtmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 104px;
`;

const UlBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  li {
    .title {
      font-size: 16px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: var(--bs-body-color_active);
      line-height: 22px;
      margin-bottom: 14px;
    }
  }
`;

const InputBox = styled(InputGroup)`
  width: 600px;
  margin-right: 20px;
`;

const ItemBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .titleLft {
    margin-right: 10px;
    width: 50px;
  }
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;
