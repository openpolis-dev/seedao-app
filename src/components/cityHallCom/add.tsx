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
import useToast, { ToastType } from 'hooks/useToast';
import { updateMembers } from 'requests/cityHall';

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
  closeAdd: () => void;
  canUpdateSponsor: boolean;
}
export default function Add(props: Iprops) {
  const { closeAdd, canUpdateSponsor } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast, Toast } = useToast();

  const [adminList, setAdminList] = useState<string[]>(['']);
  const [memberList, setMemberList] = useState<string[]>(['']);

  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: string[] = [];
    arr = [...adminList];
    arr[index] = value;
    setAdminList(arr);
  };

  const handleAddAdmin = () => {
    const arr = [...adminList];
    arr.push('');
    setAdminList(arr);
  };

  const removeAdmin = (index: number) => {
    const arr = [...adminList];
    arr.splice(index, 1);
    setAdminList(arr);
  };

  const submitObject = async () => {
    const _adminList_invalid = adminList.filter((item) => item && !ethers.utils.isAddress(item));
    const _invalid_address = [..._adminList_invalid];

    if (_invalid_address.length) {
      showToast(t('Msg.IncorrectAddress', { content: _invalid_address.join(', ') }), ToastType.Danger);
      return;
    }

    const _adminList = adminList.filter((item) => item && ethers.utils.isAddress(item));

    try {
      const params = {
        add: _adminList,
      };
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await updateMembers(params);
      showToast(t('Guild.addMemberSuccess'), ToastType.Success);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeAdd();
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
