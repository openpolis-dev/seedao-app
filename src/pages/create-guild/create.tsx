import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewGuild } from 'requests/guild';
import { IGuild } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import CameraIconSVG from 'components/svgs/camera';
import BackerNav from 'components/common/backNav';
import SeeSelect from 'components/common/select';
import { ethers } from 'ethers';
import sns from '@seedao/sns-js';
import { compressionFile, fileToDataURL } from 'utils/image';

export default function CreateGuild() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [link, setLink] = useState('');
  const [contact, setContact] = useState('');
  const [leader, setLeader] = useState('');

  const checkBeforeSubmit = async (): Promise<IGuild | undefined> => {
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
      name: proName,
      desc,
      logo: url,
      OfficialLink: link,
      ContantWay: contact,
      sponsors: [_leader],
    };
  };

  const handleSubmit = async () => {
    const params = await checkBeforeSubmit();
    if (!params) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await createNewGuild(params);
      showToast(t('Guild.createSuccess'), ToastType.Success);
      navigate(`/guild/info/${resp.data.id}`);
    } catch (error: any) {
      showToast(error?.response?.data?.message || error, ToastType.Danger);
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

  const handleBack = () => {
    navigate('/explore?tab=guild');
  };

  const submitDisabled = [proName, desc, leader, link, contact].some(
    (item) => !item || (typeof item === 'string' && !item.trim()),
  );

  return (
    <OuterBox>
      <BackerNav title={t('Guild.create')} to="/explore?tab=guild" />
      <FlexBox>
        <CardBody>
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
          <RightContent>
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
                  <Form.Control
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                  />
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
          </RightContent>
        </CardBody>
        <RhtBtnBox>
          <Button onClick={() => handleSubmit()} disabled={submitDisabled}>
            {t('general.confirm')}
          </Button>
          <Button variant="light" style={{ width: '80px' }} onClick={handleBack}>
            {t('general.cancel')}
          </Button>
        </RhtBtnBox>
      </FlexBox>
    </OuterBox>
  );
}

const FlexBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const RhtBtnBox = styled.div`
  display: flex;
  flex-direction: column;
  .btn {
    margin-bottom: 20px;
  }
`;

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const CardBody = styled.div`
  display: flex;
  gap: 32px;
  padding-bottom: 100px;
`;

const BtmBox = styled.div`
  margin-top: 10px;
  button {
    width: 76px;
    height: 34px;
    font-size: 14px;
  }
  button:first-child {
    margin-right: 16px;
  }
`;

const UlBox = styled.ul`
  display: flex;
  flex-direction: column;
  //gap: 40px;
  li {
    margin-bottom: 14px;
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
  width: 576px;
  height: 40px;
  @media (max-width: 870px) {
    width: 400px;
  }
`;

const ProposalInputBox = styled(InputBox)`
  width: 480px;
`;

const MemberInputBox = styled(InputBox)`
  width: 480px;
`;

const ItemBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackBox = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  margin-bottom: 48px;
  cursor: pointer;

  svg {
    margin-right: 10px;
  }
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

const CancelButton = styled.button`
  background: #b0b0b0;
  height: 34px;
  border: none;
  border-radius: 8px;
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
    object-position: center;
    object-fit: cover;
  }
  .upload {
    display: none;
  }
  &:hover .upload {
    display: flex;
  }
`;

const IntroBox = styled.div`
  .cm-scroller,
  .md-editor-preview-wrapper {
    background: var(--bs-background);
  }
`;

const RightContent = styled.div`
  width: 576px;
  @media (max-width: 870px) {
    width: 400px;
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

const RoleSelect = styled(SeeSelect)`
  .react-select__control {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
