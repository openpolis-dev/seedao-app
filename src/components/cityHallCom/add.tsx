import styled from 'styled-components';
import { Card, InputGroup, Button, Form } from 'react-bootstrap';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import { updateMembers } from 'requests/cityHall';
import { DashLg, PlusLg } from 'react-bootstrap-icons';
import BasicModal from 'components/modals/basicModal';

const CardBody = styled.div``;
const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;

const ItemBox = styled.div`
  margin-top: 20px;
  font-size: 14px;
  li {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .name {
      font-family: Poppins-SemiBold, Poppins;
      color: var(--bs-body-color_active);
    }
  }
  input {
    margin-right: 10px;
    min-width: 450px;
  }
  span {
    margin-left: 10px;
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
  closeAdd: (shouldUpdate?: boolean) => void;
  canUpdateSponsor: boolean;
}
export default function Add(props: Iprops) {
  const { closeAdd } = props;
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
      closeAdd(true);
    }
  };

  return (
    <AddMemberModalWrapper title={t('members.AddTitle')} handleClose={closeAdd}>
      <CardBody>
        <InnerBox>
          <ItemBox>
            <li>{t('members.AddressName')}</li>
            {adminList.map((item, index) => (
              <li key={`admin_${index}`}>
                <LeftInputBox>
                  <Form.Control
                    type="text"
                    // placeholder={t('Project.Moderator')}
                    value={item}
                    onChange={(e) => handleInput(e, index)}
                  />
                </LeftInputBox>
                <OptionBox>
                  {!(!index && index === adminList.length - 1) && (
                    <span className="iconForm" onClick={() => removeAdmin(index)}>
                      <DashLg />
                    </span>
                  )}
                  {index === adminList.length - 1 && (
                    <span className="iconForm" onClick={() => handleAddAdmin()}>
                      <PlusLg />
                    </span>
                  )}
                </OptionBox>
              </li>
            ))}
          </ItemBox>
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
    </AddMemberModalWrapper>
  );
}

const AddMemberModalWrapper = styled(BasicModal)`
  width: 550px;
`;

const LeftInputBox = styled(InputGroup)`
  width: 400px;
  input.form-control {
    height: 40px;
    line-height: 40px;
  }
`;

const OptionBox = styled.div`
  display: flex;
`;
