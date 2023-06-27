import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import { InputGroup } from '@paljs/ui/Input';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import { createProjects } from 'requests/guild';
import { BudgetType, IBaseProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';

const Box = styled.div`
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled(Card)`
  min-height: 80vh;
`;

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
  background: #f8f8f8;
  height: 200px;
  width: 200px;
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

export default function CreateGuild() {
  const router = useRouter();
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
    proList.forEach((l) => {
      if (l && l.startsWith('https://forum.seedao.xyz/thread/')) {
        const _last = l.split('/').reverse()[0];
        const _id = _last.split('-').reverse()[0];
        ids.push(_id);
      }
    });
    const obj: IBaseProject = {
      logo: url,
      name: proName,
      sponsors: adminList,
      members: memberList,
      proposals: ids,
      budgets: [
        {
          name: 'USDT',
          total_amount: token || 0,
          budget_type: BudgetType.Token,
        },
        {
          name: 'SCR',
          total_amount: credit || 0,
          budget_type: BudgetType.Credit,
        },
      ],
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await createProjects(obj);
      showToast(t('Guild.createSuccess'), ToastType.Success);
      router.push('/guild');
    } catch (error) {
      showToast(t('Guild.createFailed'), ToastType.Danger);
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
    <Layout title="">
      <Box>
        {Toast}
        <CardBox>
          <BackBox onClick={() => router.back()}>
            <EvaIcon name="chevron-left-outline" className="icon" /> <span>{t('general.back')}</span>
          </BackBox>
          <CardHeader> {t('Guild.create')}</CardHeader>
          <CardBody>
            <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!url && (
                <div>
                  <input id="fileUpload" type="file" hidden accept="image/*" />
                  <EvaIcon name="cloud-upload-outline" className="iconRht" />
                  <span> {t('Guild.upload')}</span>
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
                <div className="title">{t('Guild.ProjectName')}</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder={t('Guild.ProjectName')}
                    value={proName}
                    onChange={(e) => handleInput(e, 0, 'proName')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Guild.Dominator')}</div>
                <div>
                  {adminList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder={t('Guild.Dominator')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'admin')}
                        />
                      </InputBox>
                      {index === adminList.length - 1 && (
                        <span onClick={() => handleAdd('admin')}>
                          <EvaIcon name="plus-outline" status="Primary" />
                        </span>
                      )}

                      {!(!index && index === adminList.length - 1) && (
                        <span onClick={() => removeItem(index, 'admin')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
              <li>
                <div className="title">{t('Guild.AssociatedProposal')}</div>
                <div>
                  {proList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder={`${t('Guild.AssociatedProposal')}, eg. https://forum.seedao.xyz/thread...`}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'proposal')}
                        />
                      </InputBox>
                      {index === proList.length - 1 && (
                        <span onClick={() => handleAdd('proposal')}>
                          <EvaIcon name="plus-outline" status="Primary" />
                        </span>
                      )}

                      {!(!index && index === proList.length - 1) && (
                        <span onClick={() => removeItem(index, 'proposal')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
              <li>
                <div className="title">{t('Guild.Budget')}</div>
                <div>
                  <ItemBox>
                    <span className="titleLft">{t('Guild.Points')}</span>
                    <InputGroup fullWidth>
                      <input
                        type="number"
                        placeholder={t('Guild.Points')}
                        value={credit}
                        onChange={(e) => handleInput(e, 0, 'credit')}
                      />
                    </InputGroup>
                  </ItemBox>
                  <ItemBox>
                    <span className="titleLft">USD</span>
                    <InputGroup fullWidth>
                      <input
                        type="number"
                        placeholder="USD"
                        value={token}
                        onChange={(e) => handleInput(e, 0, 'token')}
                      />
                    </InputGroup>
                  </ItemBox>
                </div>
              </li>
              <li>
                <div className="title">{t('Guild.Members')}</div>
                <div>
                  {memberList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder={t('Guild.Members')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'member')}
                        />
                      </InputBox>
                      {index === memberList.length - 1 && (
                        <span onClick={() => handleAdd('member')}>
                          <EvaIcon name="plus-outline" status="Primary" />
                        </span>
                      )}

                      {!(!index && index === memberList.length - 1) && (
                        <span onClick={() => removeItem(index, 'member')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
            </UlBox>
            <BtmBox>
              <Button appearance="outline" className="btnBtm">
                {t('general.cancel')}
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={
                  proName?.length === 0 ||
                  url?.length === 0 ||
                  !credit ||
                  credit < 0 ||
                  !token ||
                  token < 0 ||
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
    </Layout>
  );
}
