import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateInfo, addRelatedProposal } from 'requests/project';
import { InfoObj, ProjectStatus, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import PlusMinusButton from 'components/common/plusAndMinusButton';
import CameraIconSVG from 'components/svgs/camera';
import CloseTips from './closeTips';
import CloseSuccess from './closeSuccess';
import { createCloseProjectApplication } from 'requests/applications';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from 'components/common/markdownEditor';

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
  const [intro, setIntro] = useState('');

  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (detail) {
      setProName(detail.name);
      setDesc(detail.desc);
      setUrl(detail.logo);
      setIntro(detail.intro);
      setProList(detail?.proposals?.map((item) => `https://forum.seedao.xyz/thread/${item}`));
    }
  }, [detail]);

  const handleInput = (e: ChangeEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    let arr: any[] = [];
    switch (type) {
      case 'proposal':
        arr = [...proList];
        arr[index] = value;
        setProList(arr);
        break;
      case 'proName':
        setProName(value);
        break;
      case 'desc':
        setDesc(value);
        break;
    }
  };

  const handleAdd = (type: string) => {
    let arr: any[] = [];
    switch (type) {
      case 'proposal':
        arr = [...proList];
        arr.push('');
        setProList(arr);
        break;
    }
  };
  const removeItem = (index: number, type: string) => {
    let arr: any[] = [];
    switch (type) {
      case 'proposal':
        arr = [...proList];
        arr.splice(index, 1);
        setProList(arr);
        break;
    }
  };
  const handleSubmit = async () => {
    if (!detail?.id) {
      return;
    }
    const ids: string[] = [];
    const slugs: string[] = [];
    for (const l of proList) {
      if (l) {
        const _l = l.trim().toLocaleLowerCase();
        if (_l.startsWith('https://forum.seedao.xyz/thread/sip-')) {
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
        }
        // else if (l.indexOf('/proposal/thread/') > -1) {
        //   const items = l.split('/').reverse();
        //   for (const it of items) {
        //     if (it) {
        //       if (ids.includes(it)) {
        //         showToast(t('Msg.RepeatProposal'), ToastType.Danger);
        //         return;
        //       }
        //       ids.push(it);
        //       break;
        //     }
        //   }
        // }
        else {
          showToast(t('Msg.ProposalLinkMsg'), ToastType.Danger);
          return;
        }
      }
    }
    const obj: InfoObj = {
      logo: url,
      name: proName,
      desc,
      intro,
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

  const closeModal = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate(`/project/info/${detail?.id}`);
  };

  const handleClosePro = async (content: string) => {
    if (!detail) {
      return;
    }
    setShow(false);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await createCloseProjectApplication(detail.id, content);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      setShowSuccess(true);

      // reset project status
      // updateProjectStatus(ProjectStatus.Pending);
    } catch (e) {
      logError(e);
      // showToast(JSON.stringify(e), ToastType.Danger);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeModal();
    }
  };

  return (
    <EditPage>
      <MainContent>
        <TopBox>
          <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
            <ImgBox>
              <img src={url} alt="" />
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
            <div className="title">{t('Project.ProjectName')}</div>
            <InputBox>
              <Form.Control
                type="text"
                placeholder={t('Project.ProjectName')}
                value={proName}
                onChange={(e) => handleInput(e, 0, 'proName')}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Project.AssociatedProposal')}</div>
            <div>
              {proList?.map((item, index) => (
                <ItemBox key={`mem_${index}`}>
                  <InputBox>
                    <Form.Control
                      type="text"
                      placeholder={`https://forum.seedao.xyz/thread...`}
                      value={item}
                      onChange={(e) => handleInput(e, index, 'proposal')}
                    />
                  </InputBox>
                  <PlusMinusButton
                    showMinus={!(!index && index === proList.length - 1)}
                    showPlus={index === proList.length - 1}
                    onClickMinus={() => removeItem(index, 'proposal')}
                    onClickPlus={() => handleAdd('proposal')}
                  />
                </ItemBox>
              ))}
            </div>
          </li>
          <li>
            <div className="title">{t('Project.Desc')}</div>
            <InputBox>
              <Form.Control
                placeholder=""
                as="textarea"
                rows={5}
                value={desc}
                onChange={(e) => handleInput(e, 0, 'desc')}
              />
            </InputBox>
          </li>
          <li>
            <div className="title">{t('Project.Intro')}</div>
            <IntroBox>
              <MarkdownEditor value={intro} onChange={(val) => setIntro(val)} />
            </IntroBox>
          </li>
        </UlBox>
      </MainContent>
      {detail?.status === ProjectStatus.Open && (
        <BtmBox>
          <Button
            onClick={() => handleSubmit()}
            disabled={proName?.length === 0 || url?.length === 0 || (proList?.length === 1 && proList[0]?.length === 0)}
          >
            {t('general.confirm')}
          </Button>
          <TextButton onClick={() => handleShow()}>{t('Project.CloseProject')}</TextButton>
        </BtmBox>
      )}
      {show && <CloseTips closeModal={closeModal} handleClosePro={handleClosePro} />}
      {showSuccess && <CloseSuccess closeModal={closeSuccess} />}
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
  gap: 40px;
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

const TextButton = styled.div`
  font-size: 14px;
  font-family: Poppins-Medium;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
`;
