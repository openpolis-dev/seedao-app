import styled from 'styled-components';
import { Card, InputGroup, Button, Form } from 'react-bootstrap';
import React, { ChangeEvent, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { updateStaffs, IUpdateStaffsParams } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import { DashLg, PlusLg } from 'react-bootstrap-icons';
import Select from 'components/common/select';
import sns from '@seedao/sns-js';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardHeader = styled.div`
  min-width: 500px;
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

const CardStyle = styled(Card)`
  min-height: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  padding: 20px 20px 0;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
const CardFooter = styled.div`
  padding: 20px;
`;

const InnerBox = styled.div`
  height: 100%;
  ul {
    margin-top: 20px;
    height: 100%;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    input {
      margin-right: 10px;
      min-width: 450px;
    }
    span {
      margin-left: 10px;
    }
  }
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

type InputUser = {
  walletOrSNS: string;
  isOnlyMember?: boolean;
};

interface Iprops {
  closeAdd: (refresh?: boolean) => void;
  id: string;
}
export default function Add(props: Iprops) {
  const { closeAdd, id } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast, Toast } = useToast();

  const [adminList, setAdminList] = useState<string[]>(['']);
  const [memberList, setMemberList] = useState<string[]>(['']);

  const [lst, setLst] = useState<InputUser[]>([{ walletOrSNS: '' }]);

  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: InputUser[] = [...lst];
    arr[index].walletOrSNS = value;
    setLst(arr);
  };

  const handleSelect = (value: boolean, index: number) => {
    let arr: InputUser[] = [...lst];
    arr[index].isOnlyMember = value;
    setLst(arr);
  };

  const handleAddItem = () => {
    setLst([...lst, { walletOrSNS: '' }]);
  };
  const handleRemoveItem = (index: number) => {
    const arr = [...lst];
    arr.splice(index, 1);
    setLst(arr);
  };

  const submitObject = async () => {
    const checkSNSlst: string[] = [];
    const sns2walletMap = new Map<string, string>();
    lst.forEach((item) => {
      if (!ethers.utils.isAddress(item.walletOrSNS)) {
        checkSNSlst.push(item.walletOrSNS);
      }
    });

    if (checkSNSlst.length) {
      try {
        const notOkList: string[] = [];
        const res = await sns.resolves(checkSNSlst);
        for (let i = 0; i < res.length; i) {
          const wallet = res[i];
          sns2walletMap.set(checkSNSlst[i], wallet);
          if (!wallet) {
            notOkList.push(checkSNSlst[i]);
          }
        }
        if (!!notOkList.length) {
          showToast(t('Msg.IncorrectAddress', { content: notOkList.join(', ') }), ToastType.Danger);
          return;
        }
      } catch (error) {
        console.error('resolved failed', error);
        return;
      }
    }

    const _adminList: string[] = [];
    const _memberList: string[] = [];

    lst.forEach((item) => {
      const wallet = sns2walletMap.get(item.walletOrSNS) || item.walletOrSNS;
      if (item.isOnlyMember) {
        _memberList.push(wallet);
      } else {
        _adminList.push(wallet);
      }
    });

    try {
      const params: IUpdateStaffsParams = {
        action: 'add',
      };
      if (!!_adminList.length) {
        params['sponsors'] = _adminList;
      }
      if (!!_memberList.length) {
        params['members'] = _memberList;
      }

      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await updateStaffs(id as string, params);
      showToast(t('Project.addMemberSuccess'), ToastType.Success);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeAdd(true);
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
      closeAdd();
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const roleOptions = useMemo(() => {
    return [
      { label: t('Project.Dominator'), value: false },
      { label: t('Project.Members'), value: true },
    ];
  }, [t]);

  return (
    <Mask>
      <CardStyle>
        <CardHeader>{t('Project.AddMember')}</CardHeader>
        <CardBody>
          <InnerBox>
            <ul>
              {lst.map((item, index) => (
                <li key={index}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder={'TODO: wallet or SNS'}
                      value={item.walletOrSNS}
                      onChange={(e) => handleInput(e, index)}
                    />
                  </InputGroup>
                  <Select
                    options={roleOptions}
                    placeholder=""
                    onChange={(value: any) => {
                      handleSelect(value?.value, index);
                    }}
                  />
                  {index === adminList.length - 1 && (
                    <span className="iconForm" onClick={handleAddItem}>
                      <PlusLg />
                    </span>
                  )}

                  {!(!index && index === adminList.length - 1) && (
                    <span className="iconForm" onClick={() => handleRemoveItem(index)}>
                      <DashLg />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </InnerBox>
        </CardBody>
        <CardFooter>
          <Button variant="outline-primary" className="btnBtm" onClick={() => closeAdd()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={() => submitObject()} disabled={!adminList.length && !memberList.length}>
            {t('general.confirm')}
          </Button>
        </CardFooter>
      </CardStyle>
    </Mask>
  );
}
