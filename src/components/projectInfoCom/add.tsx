import styled from 'styled-components';
import { InputGroup, Button, Form } from 'react-bootstrap';
import React, { ChangeEvent, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { updateStaffs, IUpdateStaffsParams } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import sns from '@seedao/sns-js';
import BasicModal from 'components/modals/basicModal';
import PlusMinusButton from 'components/common/plusAndMinusButton';

enum UserRole {
  None = 0,
  Admin,
  Member,
}

type InputUser = {
  walletOrSNS: string;
  role: UserRole;
};

interface Iprops {
  closeAdd: (refresh?: boolean) => void;
  id: string;
}
export default function Add(props: Iprops) {
  const { closeAdd, id } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [lst, setLst] = useState<InputUser[]>([{ walletOrSNS: '', role: UserRole.None }]);

  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: InputUser[] = [...lst];
    arr[index].walletOrSNS = value;
    setLst(arr);
  };

  const handleSelect = (value: UserRole, index: number) => {
    let arr: InputUser[] = [...lst];
    arr[index].role = value;
    setLst(arr);
  };

  const handleAddItem = () => {
    setLst([...lst, { walletOrSNS: '', role: UserRole.None }]);
  };
  const handleRemoveItem = (index: number) => {
    const arr = [...lst];
    arr.splice(index, 1);
    setLst(arr);
  };

  const submitObject = async () => {
    const checkSNSlst: string[] = [];
    const sns2walletMap = new Map<string, string>();
    for (const item of lst) {
      if (!item.role) {
        showToast(t('Msg.SelectRole'), ToastType.Danger);
        return;
      }
      if (!ethers.utils.isAddress(item.walletOrSNS)) {
        if (!item.walletOrSNS.endsWith('.seedao')) {
          showToast(t('Msg.IncorrectAddress', { content: item.walletOrSNS }), ToastType.Danger);
          return;
        } else {
          checkSNSlst.push(item.walletOrSNS);
        }
      }
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    if (checkSNSlst.length) {
      try {
        const notOkList: string[] = [];
        const res = await sns.resolves(checkSNSlst);
        for (let i = 0; i < res.length; i++) {
          const wallet = res[i];
          if (!wallet || ethers.constants.AddressZero === wallet) {
            notOkList.push(checkSNSlst[i]);
          } else {
            sns2walletMap.set(checkSNSlst[i], wallet);
          }
        }
        if (!!notOkList.length) {
          showToast(t('Msg.IncorrectAddress', { content: notOkList.join(', ') }), ToastType.Danger);
          throw Error(t('Msg.IncorrectAddress', { content: notOkList.join(', ') }));
        }
      } catch (error) {
        console.error('resolved failed', error);
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
        return;
      }
    }
    const _adminList: string[] = [];
    const _memberList: string[] = [];

    lst.forEach((item) => {
      const wallet = sns2walletMap.get(item.walletOrSNS) || item.walletOrSNS;
      if (item.role === UserRole.Member) {
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
      { label: t('Project.Moderator'), value: UserRole.Admin },
      { label: t('Project.Members'), value: UserRole.Member },
    ];
  }, [t]);

  return (
    <AddMemberModal title={t('Project.AddMember')} handleClose={closeAdd}>
      <CardBody>
        <InnerBox>
          <ul>
            <InputLableRow>
              <InputBox>{t('Project.AddMemberAddress')}</InputBox>
              <div style={{ width: '140px' }}>{t('Project.MemberRole')}</div>
              <OptionBox></OptionBox>
            </InputLableRow>
            {lst.map((item, index) => (
              <li key={index}>
                <InputBox>
                  <InputGroup>
                    <Form.Control type="text" value={item.walletOrSNS} onChange={(e) => handleInput(e, index)} />
                  </InputGroup>
                </InputBox>
                <Select
                  width="140px"
                  options={roleOptions}
                  placeholder=""
                  NotClear={true}
                  // isSearchable={false}
                  onChange={(value: any) => {
                    handleSelect(value?.value, index);
                  }}
                />
                <OptionBox>
                  <PlusMinusButton
                    showMinus={!(!index && index === lst.length - 1)}
                    showPlus={index === lst.length - 1}
                    onClickMinus={() => handleRemoveItem(index)}
                    onClickPlus={handleAddItem}
                  />
                </OptionBox>
              </li>
            ))}
          </ul>
        </InnerBox>
      </CardBody>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtm" onClick={() => closeAdd()}>
          {t('general.cancel')}
        </Button>
        <Button onClick={() => submitObject()} disabled={!lst.length}>
          {t('general.confirm')}
        </Button>
      </CardFooter>
    </AddMemberModal>
  );
}

const AddMemberModal = styled(BasicModal)`
  min-height: 400px;
  max-height: 80vh;
  width: 680px;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 40px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
const CardFooter = styled.div`
  text-align: center;
  button {
    width: 110px;
  }
`;

const InnerBox = styled.div`
  height: 100%;
  ul {
    margin-top: 20px;
    height: 100%;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    input {
      margin-right: 10px;
      min-width: 450px;
    }
  }
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const OptionBox = styled.div`
  width: 88px;
  margin-left: 10px;
`;

const InputBox = styled.div`
  flex: 1;
`;

const InputLableRow = styled.li`
  font-size: 14px;
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
  margin-bottom: 8px !important;
`;
