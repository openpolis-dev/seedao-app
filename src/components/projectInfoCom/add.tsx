import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { updateMembers, updateSponsors } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
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
  closeAdd: () => void;
  showToastr: (a: string, b: string, c: string) => void;
  oldMemberList: string[];
  oldAdminList: string[];
  id: string;
}
export default function Add(props: Iprops) {
  const { closeAdd, oldMemberList, oldAdminList, id, showToastr } = props;
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
    const newAdd = oldAdminList.concat(adminList);
    const newM = oldMemberList.concat(memberList);
    const uniqueAdd = [...new Set(newAdd)];
    const uniqueM = [...new Set(newM)];

    // showToastr('Add Successful', 'Success', 'Primary');

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateMembers(id as string, { members: uniqueM });
      closeAdd();
      showToastr(t('Project.addMemberSuccess'), 'Success', 'Primary');
      window.location.reload();
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      closeAdd();
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateSponsors(id as string, { sponsors: uniqueAdd });
      closeAdd();
      window.location.reload();
      showToastr(t('Project.addAdminSuccess'), 'Success', 'Primary');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      closeAdd();
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Mask>
      <Card>
        <CardHeader>{t('Project.AddMember')}</CardHeader>
        <CardBody>
          <InnerBox>
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
          </InnerBox>
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btnBtm" onClick={() => closeAdd()}>
            {t('general.cancel')}
          </Button>
          <Button
            onClick={() => submitObject()}
            disabled={
              adminList.length === 1 &&
              adminList[0].length === 0 &&
              memberList.length === 1 &&
              memberList[0].length === 0
            }
          >
            {t('general.confirm')}
          </Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
