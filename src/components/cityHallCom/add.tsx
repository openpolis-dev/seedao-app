import styled from 'styled-components';
import { InputGroup, Button, Form } from 'react-bootstrap';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import { updateMembers, MemberGroupType } from 'requests/cityHall';
import BasicModal from 'components/modals/basicModal';
import sns from '@seedao/sns-js';
import PlusMinusButton from 'components/common/plusAndMinusButton';
import SeeSelect from 'components/common/select';

const CardBody = styled.div``;
const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;

const ItemBox = styled.div`
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
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const InnerBox = styled.div`
  min-height: 200px;
  max-height: 50vh;
  overflow-y: auto;
`;

interface Iprops {
  oldMembers: string[];
  closeAdd: (shouldUpdate?: boolean) => void;
  canUpdateSponsor: boolean;
}
export default function Add(props: Iprops) {
  const { closeAdd, oldMembers } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [adminList, setAdminList] = useState<string[]>(['']);
  const [group, setGroup] = useState<MemberGroupType>();

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
    const checkSNSlst: string[] = [];
    const sns2walletMap = new Map<string, string>();
    for (const item of adminList) {
      if (!ethers.utils.isAddress(item)) {
        if (!item.endsWith('.seedao')) {
          showToast(t('Msg.IncorrectAddress', { content: item }), ToastType.Danger);
          throw Error(t('Msg.IncorrectAddress', { content: item }));
        } else {
          checkSNSlst.push(item);
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
    adminList.forEach((item) => {
      const wallet = sns2walletMap.get(item)?.toLocaleLowerCase() || item.toLocaleLowerCase();
      _adminList.push(wallet);
    });
    const unique_list = Array.from(new Set(_adminList));
    if (_adminList.length !== unique_list.length) {
      showToast(t('city-hall.MemberExist'), ToastType.Danger);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      return;
    }

    for (const item of unique_list) {
      if (oldMembers.includes(item.toLocaleLowerCase())) {
        showToast(t('city-hall.MemberExist'), ToastType.Danger);
        dispatch({ type: AppActionType.SET_LOADING, payload: null });
        return;
      }
    }

    try {
      const params = {
        add: _adminList,
        group_name: group,
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

  const handleSelectGroup = (v: MemberGroupType) => {
    setGroup(v);
  };

  const groups = useMemo(() => {
    return [
      {
        label: t('city-hall.GovernanceGroup'),
        value: MemberGroupType.Governance,
      },
      {
        label: t('city-hall.BrandGroup'),
        value: MemberGroupType.Brand,
      },
      {
        label: t('city-hall.TechGroup'),
        value: MemberGroupType.Tech,
      },
    ];
  }, [t]);

  return (
    <AddMemberModalWrapper title={t('members.AddTitle')} handleClose={closeAdd}>
      <CardBody>
        <InnerBox>
          <ItemBox>
            <li>
              <div>
                <div className="item-title">{t('city-hall.MemberGroup')}</div>
                <SeeSelect
                  options={groups}
                  placeholder=""
                  NotClear={true}
                  onChange={(value: any) => handleSelectGroup(value?.value)}
                />
              </div>
            </li>
            <li className="item-title">{t('members.AddressName')}</li>
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
                  <PlusMinusButton
                    showMinus={!(!index && index === adminList.length - 1)}
                    showPlus={index === adminList.length - 1}
                    onClickMinus={() => removeAdmin(index)}
                    onClickPlus={handleAddAdmin}
                  />
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
        <Button onClick={() => submitObject()} disabled={!adminList.length || !group}>
          {t('general.confirm')}
        </Button>
      </CardFooter>
    </AddMemberModalWrapper>
  );
}

const AddMemberModalWrapper = styled(BasicModal)`
  width: 567px;
  li.item-title,
  .item-title {
    margin-bottom: 10px;
  }
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
