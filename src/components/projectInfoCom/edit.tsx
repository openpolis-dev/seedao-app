import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IProjectDisplay } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import CameraIconSVG from 'components/svgs/camera';
import { useNavigate } from 'react-router-dom';
import { compressionFile, fileToDataURL } from 'utils/image';
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';
import { UpdateProjectParamsType, updateProjectInfo } from 'requests/project';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';

const LinkPrefix = `${window.location.origin}/proposal/thread/`;

export default function EditProject({ detail }: { detail: IProjectDisplay | undefined }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();

  const canCreateProject = usePermission(PermissionAction.CreateApplication, PermissionObject.Project);


  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');

  const [leader, setLeader] = useState('');
  const [contact, setContact] = useState('');
  const [endLink, setEndLink] = useState('');
  const [link, setLink] = useState('');

  const handleLeaderSNS = (address: string) => {
    setLeader(address);
    sns
      .name(address)
      .then((res) => {
        setLeader(res || address);
      })
  };

  useEffect(() => {
    if (detail) {
      setProName(detail.name);
      setDesc(detail.desc);
      setUrl(detail.logo);
      setLink(detail.OfficialLink);
      setEndLink(detail.OverLink);
      handleLeaderSNS(detail.sponsors[0]);
      setContact(detail.ContantWay);
    }
  }, [detail]);

  const checkBeforeSubmit = async (): Promise<UpdateProjectParamsType | undefined> => {
    if (!endLink.startsWith(LinkPrefix)) {
      showToast(t('Msg.InvalidField', { field: t('Project.EndProjectLink') }), ToastType.Danger);
      return;
    }
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
      OverLink: endLink,
      desc: desc,
      logo: url,
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
      await updateProjectInfo(detail!.id, params);
      showToast(t('Project.changeInfoSuccess'), ToastType.Success);
      navigate(`/project/info/${detail?.id}`);
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

  const submitDisabled = [proName, desc, leader, link, endLink].some(
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
                <UploadImgText>{t('Project.upload')}</UploadImgText>
              </UpladBox>
            </ImgBox>
            {!url && (
              <UpladBox>
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                <CameraIconSVG />
                <UploadImgText>{t('Project.upload')}</UploadImgText>
              </UpladBox>
            )}
          </BtnBox>
        </TopBox>
        <UlBox>
          <li>
            <div className="title">{t('Project.EndProjectLink')}</div>
            <InputBox>
              <Form.Control
                type="text"
                placeholder={`${LinkPrefix}...`}
                value={endLink}
                onChange={(e) => setEndLink(e.target.value)}
                disabled={!canCreateProject}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Project.Moderator')}</div>
            <InputBox>
              <Form.Control
                type="text"
                placeholder={t('Project.AddMemberAddress')}
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                disabled={!canCreateProject}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Project.Contact')}</div>
            <InputBox>
              <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Project.OfficialLink')}</div>
            <InputBox>
              <Form.Control type="text" value={link} onChange={(e) => setLink(e.target.value)} />
            </InputBox>
          </li>

          <li>
            <div className="title">{t('Project.Desc')}</div>
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
  display: flex;
  justify-content: space-between;
`;

const TopBox = styled.section`
  display: flex;
`;

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

const UlBox = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const BtmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 104px;
`;
