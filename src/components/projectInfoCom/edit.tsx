import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateInfo, addRelatedProposal } from 'requests/project';
import { InfoObj, ProjectStatus, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import CameraIconSVG from 'components/svgs/camera';
import { createCloseProjectApplication } from 'requests/applications';
import { useNavigate } from 'react-router-dom';
import { compressionFile, fileToDataURL } from 'utils/image';

export default function EditProject({ detail }: { detail: ReTurnProject | undefined }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const [proList, setProList] = useState(['']);

  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');

  const [leader, setLeader] = useState('');
  const [contact, setContact] = useState('');
  const [endLink, setEndLink] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (detail) {
      setProName(detail.name);
      setDesc(detail.desc);
      setUrl(detail.logo);
      setProList(
        detail?.proposals?.map((slug) => {
          const isOS = slug.startsWith('os');
          return isOS
            ? `${window.location.origin}/proposal/thread/${slug.replace('os-', '')}`
            : `https://forum.seedao.xyz/thread/${slug}`;
        }),
      );
    }
  }, [detail]);

  const handleSubmit = async () => {
    if (!detail?.id) {
      return;
    }
    const ids: string[] = [];
    const slugs: string[] = [];
    for (const l of proList) {
      if (l) {
        const _l = l.trim().toLocaleLowerCase();
        if (_l.startsWith('https://forum.seedao.xyz/') && !_l.startsWith('https://forum.seedao.xyz/thread/sip-')) {
          showToast(t('Msg.ProposalLinkMsg'), ToastType.Danger);
          return;
        }
        if (_l.startsWith('https://forum.seedao.xyz/thread/sip-')) {
          // sip
          const items = _l.split('/').reverse();
          slugs.push(items[0]);
          for (const it of items) {
            if (it) {
              const _id = it.split('-').reverse()[0];
              if (ids.includes(_id)) {
                showToast(t('Msg.RepeatProposal'), ToastType.Danger);
                return;
              }
              ids.push(_id);
              break;
            }
          }
        } else if (l.indexOf('/proposal/thread/') > -1) {
          // os
          const items = l.split('/').reverse();
          slugs.push(`os-${items[0]}`);
          for (const it of items) {
            if (it) {
              if (ids.includes(it)) {
                showToast(t('Msg.RepeatProposal'), ToastType.Danger);
                return;
              }
              ids.push(it);
              break;
            }
          }
        } else {
          showToast(t('Msg.ProposalLinkMsg'), ToastType.Danger);
          return;
        }
      }
    }
    const obj: InfoObj = {
      logo: url,
      name: proName,
      desc,
      intro: '',
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await UpdateInfo(String(detail?.id), obj);
      await addRelatedProposal(String(detail?.id), slugs);
      showToast(t('Project.changeInfoSuccess'), ToastType.Success);
      navigate(`/project/info/${detail?.id}`);
    } catch (error) {
      showToast(JSON.stringify(error), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const updateLogo = async (e: FormEvent) => {
    const { files } = e.target as any;
    const file = files[0];
    const new_file = await compressionFile(file, file.type);
    const base64 = await fileToDataURL(new_file);
    setUrl(base64);
  };

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
                placeholder={`${window.location.origin}/proposal/thread/...`}
                value={endLink}
                onChange={(e) => setEndLink(e.target.value)}
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
