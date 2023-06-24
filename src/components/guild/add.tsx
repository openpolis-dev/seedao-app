import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';

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
`;

const InnerBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

interface Iprops {
  closeAdd: (refresh?: boolean) => void;
  showToastr: (a: string, b: string, c: string) => void;
  id: string;
  canUpdateMember: boolean;
  canUpdateSponsor: boolean;
}
export default function Add(props: Iprops) {
  const { closeAdd, id, showToastr, canUpdateMember, canUpdateSponsor } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

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
      if (!_adminList && !_memberList) {
        showToastr('fill the correct address', 'Failed', 'Danger');
        return;
      }
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await updateStaffs(id as string, params);
      showToastr(t('Project.addMemberSuccess'), 'Success', 'Primary');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeAdd(true);
    } catch (e) {
      console.error(e);
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      closeAdd();
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Mask>
      <Card>
        <CardHeader>{t('Project.AddMember')}</CardHeader>
        <CardBody>
          <InnerBox>
            {canUpdateSponsor && (
              <ItemBox>
                <div className="title">{t('Project.Dominator')}</div>
                <ul>
                  {adminList.map((item, index) => (
                    <li key={`admin_${index}`}>
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={t('Project.Dominator')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'admin')}
                        />
                      </InputGroup>
                      {index === adminList.length - 1 && (
                        <span onClick={() => handleAddAdmin()}>
                          <EvaIcon name="plus-outline" status="Primary" />
                        </span>
                      )}

                      {!(!index && index === adminList.length - 1) && (
                        <span onClick={() => removeAdmin(index)}>
                          <EvaIcon name="minus-outline" status="Primary" />
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
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={t('Project.Members')}
                          value={item}
                          onChange={(e) => handleInput(e, index, 'member')}
                        />
                      </InputGroup>
                      {index === memberList.length - 1 && (
                        <span onClick={() => handleAddMember()}>
                          <EvaIcon name="plus-outline" status="Primary" />
                        </span>
                      )}

                      {!(!index && index === memberList.length - 1) && (
                        <span onClick={() => removeMember(index)}>
                          <EvaIcon name="minus-outline" status="Primary" />
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
          <Button appearance="outline" className="btnBtm" onClick={() => closeAdd()}>
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
