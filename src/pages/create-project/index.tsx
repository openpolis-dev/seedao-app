import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createProjects } from 'requests/project';
import { BudgetType, IBaseProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { AssetName } from 'utils/constant';
import InputNumber from 'components/inputNumber';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PlusLg, DashLg, Upload, X } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const Box = styled.div`
  min-height: 100%;
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled.div`
  background: #fff;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
`;

const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(237, 241, 247);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: rgb(34, 43, 69);
  font-family: Inter-Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

const CardBody = styled.div``;

const BtmBox = styled.div`
  margin-top: 50px;
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
  @media (max-width: 1024px) {
    width: 350px;
  }
`;

const ItemBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .titleLft {
    margin-right: 10px;
    width: 50px;
    font-size: 14px;
  }
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const BackBox = styled.div`
  width: 100%;
  padding: 10px 0 20px;
  display: inline-flex;
  align-items: center;

  .back {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .iconTop {
    margin-right: 10px;
  }
`;

const BtnBox = styled.label`
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

export default function CreateProject() {
  // const router = useRouter();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const { dispatch } = useAuthContext();
  const [adminList, setAdminList] = useState(['']);
  const [memberList, setMemberList] = useState(['']);
  const [proList, setProList] = useState(['']);
  const [token, setToken] = useState<number>();

  const [credit, setCredit] = useState<number>();

  const [proName, setProName] = useState('');
  const [url, setUrl] = useState('');

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
      navigate('/project');
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

  const removeUrl = () => {
    setUrl('');
  };

  return (
    <OuterBox>
      <Box>
        {Toast}
        <CardBox>
          <BackBox onClick={() => navigate(-1)}>
            <ChevronLeft className="iconTop" />
            <span> {t('general.back')}</span>
          </BackBox>
          <CardHeader> {t('Project.create')}</CardHeader>
          <CardBody>
            <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!url && (
                <div>
                  <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                  <Upload className="uploadIcon" />
                  <span> {t('Project.upload')}</span>
                </div>
              )}
              {!!url && (
                <ImgBox>
                  <div className="del" onClick={() => removeUrl()}>
                    <X />
                    {/*<EvaIcon name="close-outline" status="Control" />*/}
                  </div>
                  <img src={url} alt="" />
                </ImgBox>
              )}
            </BtnBox>
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
                <div className="title">{t('Project.Dominator')}</div>
                <div>
                  {adminList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox>
                        <Form.Control
                          type="text"
                          placeholder={t('Project.Dominator')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'admin')}
                        />
                      </InputBox>
                      {index === adminList.length - 1 && (
                        <span className="iconForm" onClick={() => handleAdd('admin')}>
                          <PlusLg />
                        </span>
                      )}

                      {!(!index && index === adminList.length - 1) && (
                        <span className="iconForm" onClick={() => removeItem(index, 'admin')}>
                          <DashLg />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
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
                <div className="title">{t('Project.Budget')}</div>
                <div>
                  <ItemBox>
                    <span className="titleLft">{t('Project.Points')}</span>
                    <InputGroup>
                      <InputNumber
                        placeholder={t('Project.Points')}
                        value={credit}
                        onChange={(e) => handleInput(e, 0, 'credit')}
                      />
                    </InputGroup>
                  </ItemBox>
                  <ItemBox>
                    <span className="titleLft">USD</span>
                    <InputGroup>
                      <InputNumber placeholder="USD" value={token} onChange={(e) => handleInput(e, 0, 'token')} />
                    </InputGroup>
                  </ItemBox>
                </div>
              </li>
              <li>
                <div className="title">{t('Project.Members')}</div>
                <div>
                  {memberList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox>
                        <Form.Control
                          type="text"
                          placeholder={t('Project.Members')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'member')}
                        />
                      </InputBox>
                      {index === memberList.length - 1 && (
                        <span className="iconForm" onClick={() => handleAdd('member')}>
                          <PlusLg />
                        </span>
                      )}

                      {!(!index && index === memberList.length - 1) && (
                        <span className="iconForm" onClick={() => removeItem(index, 'member')}>
                          <DashLg />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
            </UlBox>
            <BtmBox>
              <Button variant="outline-primary" className="btnBtm">
                {t('general.cancel')}
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={
                  proName?.length === 0 ||
                  url?.length === 0 ||
                  (credit && credit < 0) ||
                  (token && token < 0) ||
                  (adminList?.length === 1 && adminList[0]?.length === 0) ||
                  (proList?.length === 1 && proList[0]?.length === 0) ||
                  (memberList?.length === 1 && memberList[0]?.length === 0)
                }
              >
                {t('general.confirm')}
              </Button>
            </BtmBox>
          </CardBody>
        </CardBox>
      </Box>
    </OuterBox>
  );
}
