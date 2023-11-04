import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createProjects } from 'requests/project';
import { BudgetType, IBaseProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { AssetName } from 'utils/constant';
import { useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import { MdEditor } from 'md-editor-rt';
import BackIconSVG from 'components/svgs/back';
import PlusMinusButton from 'components/common/buttons';
import CameraIconSVG from 'components/svgs/camera';

const config = {
  toobars: [
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'revoke',
    'next',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
  ],
  toolbarsExclude: ['github'],
};

export default function CreateProject() {
  // const router = useRouter();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { language },
  } = useAuthContext();
  const [adminList, setAdminList] = useState(['']);
  const [memberList, setMemberList] = useState<string[]>([]);
  const [proList, setProList] = useState(['']);
  const [token, setToken] = useState<number>();

  const [credit, setCredit] = useState<number>();

  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [intro, setIntro] = useState('');
  const [lan, setLan] = useState('');

  useEffect(() => {
    const localLan = language === 'zh' ? 'zh-CN' : 'en-US';
    setLan(localLan);
  }, [language]);

  const handleInput = (e: ChangeEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    let arr: any[] = [];
    switch (type) {
      case 'member':
        arr = [...memberList];
        arr[index] = value;
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr[index] = value;
        setAdminList(arr);
        break;
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
      case 'credit':
        setCredit(Number(value));
        break;
      case 'token':
        setToken(Number(value));
        break;
    }
  };

  const handleAdd = (type: string) => {
    let arr: any[] = [];
    switch (type) {
      case 'member':
        arr = [...memberList];
        arr.push('');
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr.push('');
        setAdminList(arr);
        break;
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
      case 'member':
        arr = [...memberList];
        arr.splice(index, 1);
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr.splice(index, 1);
        setAdminList(arr);
        break;
      case 'proposal':
        arr = [...proList];
        arr.splice(index, 1);
        setProList(arr);
        break;
    }
  };
  const handleSubmit = async () => {
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
    const obj: IBaseProject = {
      logo: url,
      name: proName,
      sponsors: adminList,
      members: memberList,
      proposals: ids,
      desc,
      intro,
      budgets: [
        {
          name: AssetName.Token,
          total_amount: token || 0,
          budget_type: BudgetType.Token,
        },
        {
          name: AssetName.Credit,
          total_amount: credit || 0,
          budget_type: BudgetType.Credit,
        },
      ],
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await createProjects(obj);
      showToast(t('Project.createSuccess'), ToastType.Success);
      navigate('/explore');
    } catch (error) {
      showToast(t('Project.createFailed'), ToastType.Danger);
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

  const handleBack = () => {
    navigate('/city-hall');
  };

  return (
    <OuterBox>
      <BackBox onClick={handleBack}>
        <BackIconSVG />
        <span> {t('Project.create')}</span>
      </BackBox>
      <CardBody>
        <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
          <ImgBox>
            <img src={url} alt="" />
            <UpladBox className="upload">
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
        <RightContent>
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
              <div className="title">{t('Project.Desc')}</div>
              <DescInputBox>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={2}
                  value={desc}
                  onChange={(e) => handleInput(e, 0, 'desc')}
                />
              </DescInputBox>
            </li>

            <li>
              <div className="title">{t('Project.AssociatedProposal')}</div>
              <div>
                {proList.map((item, index) => (
                  <ItemBox key={`mem_${index}`}>
                    <ProposalInputBox>
                      <Form.Control
                        type="text"
                        placeholder={`${t('Project.AssociatedProposal')}, eg. https://forum.seedao.xyz/thread...`}
                        value={item}
                        onChange={(e) => handleInput(e, index, 'proposal')}
                      />
                    </ProposalInputBox>
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
              <div className="title">{t('Project.Moderator')}</div>
              <div>
                {adminList.map((item, index) => (
                  <ItemBox key={`mem_${index}`}>
                    <MemberInputBox>
                      <Form.Control
                        type="text"
                        placeholder={t('Project.Moderator')}
                        value={item}
                        onChange={(e) => handleInput(e, index, 'admin')}
                      />
                    </MemberInputBox>
                    <PlusMinusButton
                      showMinus={!(!index && index === adminList.length - 1)}
                      showPlus={index === adminList.length - 1}
                      onClickMinus={() => removeItem(index, 'admin')}
                      onClickPlus={() => handleAdd('admin')}
                    />
                  </ItemBox>
                ))}
              </div>
            </li>

            <li>
              <div className="title">{t('Project.Intro')}</div>
              <IntroBox>
                <MdEditor
                  modelValue={intro}
                  onChange={(val) => {
                    setIntro(val);
                  }}
                  toolbars={config.toobars as any}
                  language={lan}
                  codeStyleReverse={false}
                  noUploadImg
                />
              </IntroBox>
            </li>
          </UlBox>
          <BtmBox>
            <Button
              onClick={() => handleSubmit()}
              disabled={
                proName?.length === 0 ||
                url?.length === 0 ||
                (credit && credit < 0) ||
                (token && token < 0) ||
                (adminList?.length === 1 && adminList[0]?.length === 0) ||
                (proList?.length === 1 && proList[0]?.length === 0)
              }
            >
              {t('general.confirm')}
            </Button>
            <CancelButton onClick={handleBack}> {t('general.cancel')}</CancelButton>
          </BtmBox>
        </RightContent>
      </CardBody>
    </OuterBox>
  );
}

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
  margin-top: 24px;
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
  width: 576px;
  height: 40px;
  @media (max-width: 870px) {
    width: 400px;
  }
`;

const DescInputBox = styled(InputBox)`
  height: 78px;
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

const UpladBox = styled.div`
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
`;

const UploadImgText = styled.p`
  font-size: 8px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--bs-svg-color);
  line-height: 12px;
`;
