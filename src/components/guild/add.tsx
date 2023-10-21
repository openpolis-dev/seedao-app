import styled from 'styled-components';
import { Card, InputGroup, Button, Form } from 'react-bootstrap';
// import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, useState } from 'react';
// import { Button } from '@paljs/ui/Button';
import { useTranslation } from 'react-i18next';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import { DashLg, PlusLg } from 'react-bootstrap-icons';

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

const CardBody = styled.div`
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
`;
const ItemBox = styled.div`
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
  }
  .title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  ul {
    margin-top: 20px;
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

const InnerBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

interface Iprops {
  closeAdd: (refresh?: boolean) => void;
  id: string;
  canUpdateMember: boolean;
  canUpdateSponsor: boolean;
}
export default function Add(props: Iprops) {
  const { closeAdd, id, canUpdateMember, canUpdateSponsor } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast, Toast } = useToast();

  const [adminList, setAdminList] = useState<string[]>(['']);
  const [memberList, setMemberList] = useState<string[]>(['']);

  const handleInput = (e: ChangeEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    let arr: string[] = [];
    if (type === 'member') {
      arr = [...memberList];
      arr[index] = value;
      setMemberList(arr);
    } else {
      arr = [...adminList];
      arr[index] = value;
      setAdminList(arr);
    }
  };

  const handleAddMember = () => {
    const arr = [...memberList];
    arr.push('');
    setMemberList(arr);
  };
  const handleAddAdmin = () => {
    const arr = [...adminList];
    arr.push('');
    setAdminList(arr);
  };
  const removeMember = (index: number) => {
    const arr = [...memberList];
    arr.splice(index, 1);
    setMemberList(arr);
  };
  const removeAdmin = (index: number) => {
    const arr = [...adminList];
    arr.splice(index, 1);
    setAdminList(arr);
  };

  const submitObject = async () => {
    const _adminList_invalid = adminList.filter((item) => item && !ethers.utils.isAddress(item));
    const _memberList_invalid = memberList.filter((item) => item && !ethers.utils.isAddress(item));
    const _invalid_address = [..._adminList_invalid, ..._memberList_invalid];

    if (_invalid_address.length) {
      showToast(t('Msg.IncorrectAddress', { content: _invalid_address.join(', ') }), ToastType.Danger);
      return;
    }

    const _adminList = adminList.filter((item) => item && ethers.utils.isAddress(item));
    const _memberList = memberList.filter((item) => item && ethers.utils.isAddress(item));

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
      showToast(t('Guild.addMemberSuccess'), ToastType.Success);
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

  return (
    <Mask>
      <Card>
        {Toast}
        <CardHeader>{t('Project.AddMember')}</CardHeader>
        <CardBody>
          <InnerBox>
            {canUpdateSponsor && (
              <ItemBox>
                <div className="title">{t('Project.Dominator')}</div>
                <ul>
                  {adminList.map((item, index) => (
                    <li key={`admin_${index}`}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder={t('Project.Dominator')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'admin')}
                        />
                      </InputGroup>
                      {index === adminList.length - 1 && (
                        <span className="iconForm" onClick={() => handleAddAdmin()}>
                          <PlusLg />
                        </span>
                      )}

                      {!(!index && index === adminList.length - 1) && (
                        <span className="iconForm" onClick={() => removeAdmin(index)}>
                          <DashLg />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </ItemBox>
            )}
            {canUpdateMember && (
              <ItemBox>
                <div className="title">{t('Project.Others')}</div>
                <ul>
                  {memberList.map((item, index) => (
                    <li key={`member_${index}`}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder={t('Project.Members')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'member')}
                        />
                      </InputGroup>
                      {index === memberList.length - 1 && (
                        <span className="iconForm" onClick={() => handleAddMember()}>
                          <PlusLg />
                        </span>
                      )}

                      {!(!index && index === memberList.length - 1) && (
                        <span className="iconForm" onClick={() => removeMember(index)}>
                          <DashLg />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </ItemBox>
            )}
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
      </Card>
    </Mask>
  );
}
