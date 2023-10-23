import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateInfo } from 'requests/project';
import { InfoObj, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { DashLg, PlusLg, Upload, X } from 'react-bootstrap-icons';

const BtmBox = styled.div`
  margin-top: 50px;
  display: flex;
  gap: 20px;
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
      min-width: 180px;
      background: #f8f8f8;
      padding: 0 20px;
      font-size: 14px;
    }
  }
  @media (max-width: 750px) {
    li {
      flex-direction: column;
      .title {
        margin-bottom: 10px;
      }
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

export default function EditProject({ detail, onUpdate }: { detail: ReTurnProject | undefined; onUpdate: () => void }) {
  // const router = useRouter();

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { showToast } = useToast();
  const { dispatch } = useAuthContext();
  const [proList, setProList] = useState(['']);

  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (detail) {
      setProName(detail.name);
      setDesc(detail.desc);
      setUrl(detail.logo);
      setProList(detail.proposals.map((item) => `https://forum.seedao.xyz/thread/${item}`));
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
    for (const l of proList) {
      if (l) {
        if (l.startsWith('https://forum.seedao.xyz/thread/')) {
          const items = l.split('/').reverse();
          for (const it of items) {
            if (it) {
              const _id = it.split('-').reverse()[0];
              ids.push(_id);
              break;
            }
          }
        } else if (l.indexOf('/proposal/thread/') > -1) {
          const items = l.split('/').reverse();
          for (const it of items) {
            if (it) {
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
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await UpdateInfo(String(detail?.id), obj);
      showToast(t('Project.changeProName'), ToastType.Success);
      onUpdate();
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

  return (
    <>
      <TopBox>
        <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
          {!url && (
            <div>
              <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
              <Upload className="uploadIcon" />
              <span> {t('Project.upload')}</span>
            </div>
          )}
          {!!url && (
            <ImgBox>
              <div className="del" onClick={() => setUrl('')}>
                <X />
              </div>
              <img src={url} alt="" />
            </ImgBox>
          )}
        </UploadBox>
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
            {proList.map((item, index) => (
              <ItemBox key={`mem_${index}`}>
                <InputBox>
                  <Form.Control
                    type="text"
                    placeholder={`${t('Project.AssociatedProposal')}, eg. https://forum.seedao.xyz/thread...`}
                    value={item}
                    onChange={(e) => handleInput(e, index, 'proposal')}
                  />
                </InputBox>
                {index === proList.length - 1 && (
                  <span className="iconForm" onClick={() => handleAdd('proposal')}>
                    <PlusLg />
                  </span>
                )}

                {!(!index && index === proList.length - 1) && (
                  <span className="iconForm" onClick={() => removeItem(index, 'proposal')}>
                    <DashLg />
                  </span>
                )}
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
      </UlBox>
      <BtmBox>
        <Button variant="outline-primary" className="btnBtm">
          {t('general.cancel')}
        </Button>
        <Button
          onClick={() => handleSubmit()}
          disabled={proName?.length === 0 || url?.length === 0 || (proList?.length === 1 && proList[0]?.length === 0)}
        >
          {t('general.confirm')}
        </Button>
      </BtmBox>
    </>
  );
}

const TopBox = styled.section`
  display: flex;
`;

const UploadBox = styled.label`
  background: #f8f8f8;
  height: 200px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 20px;
  font-family: 'Inter-Regular';
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 40px;
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
  .del {
    position: absolute;
    right: -15px;
    top: -15px;
    z-index: 999;
    border-radius: 100%;
    background: #a16eff;
    color: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
  }
`;
