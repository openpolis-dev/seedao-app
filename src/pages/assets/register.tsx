import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import RegList from 'components/assetsCom/regList';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import requests from 'requests';
import { ApplicationEntity } from 'type/application.type';
import useToast, { ToastType } from 'hooks/useToast';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import Select from 'components/common/select';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import sns from '@seedao/sns-js';
import { AssetName } from 'utils/constant';
import { getAvailiableProjectsAndGuilds } from 'requests/applications';
import BackerNav from 'components/common/backNav';
import ProjectInfo from '../../components/assetsCom/projectInfo';
import TotalImg from '../../assets/Imgs/light/total.svg';
import TotalImgLt from '../../assets/Imgs/dark/total.svg';
import { getProjectById } from '../../requests/project';

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};

export default function Register() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [list, setList] = useState<IExcelObj[]>([]);

  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<ISelectItem | null>(null);

  const [content, setContent] = useState('');
  const [total, setTotal] = useState('');

  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    if (!selectSource?.value) return;
    getDetail();
  }, [selectSource?.value]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getProjectById(selectSource?.value.toString());
      const { data } = dt;
      const { budgets } = data;

      let total: string[] = [];
      let ratio: string[] = [];
      let paid: string[] = [];
      let remainAmount: string[] = [];
      let prepayTotal: string[] = [];
      let prepayRemain: string[] = [];

      budgets?.map((item: any) => {
        total.push(`${item.total_amount} ${item.asset_name}`);
        ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
        paid.push(`${item.used_advance_amount} ${item.asset_name}`);
        remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
        prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
        prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
      });

      data.total = total.join(',');
      data.ratio = ratio.join(',');
      data.paid = paid.join(',');
      data.remainAmount = remainAmount.join(',');
      data.prepayTotal = prepayTotal.join(',');
      data.prepayRemain = prepayRemain.join(',');

      setDetail(data);
    } catch (error) {
      logError(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  useEffect(() => {
    if (!list?.length) return;

    let totalObj: any = {};
    list.map((item) => {
      if (!totalObj[item.assetType] && !item.amount) return;
      if (totalObj[item.assetType]) {
        totalObj[item.assetType] += Number(item.amount);
      } else {
        totalObj[item.assetType] = Number(item.amount);
      }
    });

    let arr = [];
    for (let key in totalObj) {
      arr.push(`${totalObj[key]} ${key}`);
    }
    setTotal(arr.join(','));
  }, [list]);

  useEffect(() => {
    const getAllSources = async () => {
      try {
        const res = await getAvailiableProjectsAndGuilds();
        const { projects, guilds, common_budget_source } = res.data;
        setAllSource(
          projects
            .map((item) => ({
              value: item.id,
              label: item.name,
              data: ApplicationEntity.Project,
            }))
            .concat(
              guilds.map((item) => ({
                value: item.id,
                label: item.name,
                data: ApplicationEntity.Guild,
              })),
            )
            .concat(
              common_budget_source.map((item) => ({
                value: item.id,
                label: item.name,
                data: ApplicationEntity.CommonBudget,
              })),
            ),
        );
      } catch (error) {
        logError('getAvailiableProjectsAndGuilds failed:', error);
      }
    };
    getAllSources();
  }, []);

  const Clear = () => {
    setList([]);
    setSelectSource(null);
    setContent('');
  };
  const checkInvalidData = () => {
    const err_list: ErrorDataType[] = [];
    list.forEach((item, i) => {
      const err: ErrorDataType = {
        line: i + 1,
        errorKeys: [],
      };
      if (!item.address) {
        err.errorKeys.push(t('Msg.RequiredWallet'));
      }
      if (!item.assetType || (item.assetType !== AssetName.Credit && item.assetType !== AssetName.Token)) {
        err.errorKeys.push(t('Msg.SelectAssetType'));
      }
      const _amount = Number(item.amount);

      if (isNaN(_amount) || _amount <= 0) {
        err.errorKeys.push(t('Msg.AssetAmountError'));
      }
      if (err.errorKeys.length > 0) {
        err_list.push(err);
      }
    });
    if (err_list.length) {
      let msgs: string[] = [];
      err_list.forEach((item) => msgs.push(`L${item.line}: ${item.errorKeys.join(', ')}`));
      return msgs.join('\n');
    }

    return undefined;
  };

  const checkWallet = async () => {
    const err_list: ErrorDataType[] = [];
    const sns_set: Set<string> = new Set();
    const wallet_map = new Map<string, string>();
    list.forEach((item, i) => {
      const err: ErrorDataType = {
        line: i + 1,
        errorKeys: [],
      };
      if (item.address.endsWith('.seedao')) {
        sns_set.add(item.address);
      } else if (!item.address.startsWith('0x')) {
        err.errorKeys.push(t('Msg.SNSError'));
      } else if (!ethers.utils.isAddress(item.address)) {
        err.errorKeys.push(t('Msg.RequiredWallet'));
      }
      if (err.errorKeys.length > 0) {
        err_list.push(err);
      }
    });
    if (err_list.length) {
      let msgs: string[] = [];
      err_list.forEach((item) => msgs.push(`L${item.line}: ${item.errorKeys.join(', ')}`));
      return msgs.join('\n');
    }

    const err_sns_list: string[] = [];
    try {
      const sns_list = Array.from(sns_set);

      const result = await sns.resolves(sns_list);
      result.forEach((item, i) => {
        if (!item || item === ethers.constants.AddressZero) {
          err_sns_list.push(sns_list[i]);
        } else {
          wallet_map.set(sns_list[i], item);
        }
      });
    } catch (error) {
      logError(error);
      return 'parse sns error, please try again';
    }
    if (err_sns_list.length) {
      return `${t('Msg.SNSError')}: ${err_sns_list.join(', ')}`;
    }
    // check SNS
    return wallet_map;
  };

  const checkSNs = async () => {
    try {
      const arr = list.map((item) => sns.name(item.address));

      let rtArr = await Promise.all(arr);

      const isNoSns = rtArr.filter((item) => !item);
      return !isNoSns?.length;
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!selectSource) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    let allSNS = await checkSNs();
    if (!allSNS) {
      showToast(t('Assets.tips'), ToastType.Danger);
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      return;
    }

    let msg: string | undefined;
    msg = checkInvalidData();
    if (msg) {
      showToast(msg, ToastType.Danger, { autoClose: false });
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      return;
    }

    const result = await checkWallet();

    if (typeof result === 'string') {
      showToast(result, ToastType.Danger, { autoClose: false });
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      return;
    }

    // check and convert sns
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const data = {
        entity: selectSource.data,
        entity_id: selectSource.value,
        comment: content,
        records: list.map((item) => ({
          amount: Number(item.amount),
          asset_name: item.assetType,
          comment: item.note,
          detailed_type: item.content,
          entity: selectSource.data,
          entity_id: selectSource.value,
          target_user_wallet: item.address.endsWith('.seedao') ? (result.get(item.address) as string) : item.address,
        })),
      };
      await requests.application.createApplicationBundles(data);
      Clear();
      showToast(t('Guild.SubmitSuccess'), ToastType.Success);
    } catch (error) {
      logError('createBudgetApplications failed:', error);
      showToast(t('Guild.SubmitFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const returnDisable = () => {
    let totalArr = total.split(',');
    const remainArr = detail?.prepayRemain.split(',');

    let checkAll = true;

    if (totalArr?.length > remainArr?.length) {
      checkAll = true;
    } else {
      remainArr?.map((item: any) => {
        const remainArr = item.split(' ');
        const finditemIndex = totalArr.findIndex((innerItem) => innerItem.indexOf(remainArr[1]));
        const totalNum = totalArr[finditemIndex].split(' ')[0];
        if (Number(totalNum) > Number(remainArr[0])) {
          checkAll = true;
        } else {
          checkAll = false;
        }
      });
    }

    return !list.length || !selectSource || !content || !content.trim() || checkAll;
  };

  return (
    <OuterBox>
      <BackerNav to="/assets" title={t('Assets.Apply')} mb="0" />
      <SectionBlock>
        <div className="title">{t('Assets.RegisterSelect')}</div>
        <SourceSelect
          options={allSource}
          placeholder={t('Assets.SearchSourcePlaceholder')}
          onChange={(value: any) => {
            console.log(value, selectSource);
            setSelectSource(value);
          }}
          value={selectSource}
        />
      </SectionBlock>

      <ProjectInfo detail={detail} />
      <SectionBlock>
        <div className="title lftTit">{t('Assets.RegisterList')}</div>
        <RegList list={list} setList={setList} />
      </SectionBlock>
      {!!total && (
        <TotalBox>
          <img src={theme ? TotalImgLt : TotalImg} alt="" />
          <div>
            <span>{t('Assets.Total')}</span>
            <span>{total}</span>
          </div>
        </TotalBox>
      )}

      <SectionBlock>
        <div className="title">{t('Assets.RegisterIntro')}</div>
        <Form.Control
          placeholder=""
          as="textarea"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </SectionBlock>
      <ButtonSection>
        <Button variant="primary" onClick={handleCreate} disabled={returnDisable()}>
          {t('Assets.RegisterSubmit')}
        </Button>
      </ButtonSection>
    </OuterBox>
  );
}

const TotalBox = styled.div`
  margin-top: 35px;
  color: var(--bs-body-color_active);
  font-size: 14px;
  margin-left: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  & > div {
    display: flex;
    gap: 10px;
  }
`;

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
  font-size: 14px;
  .btnBtm {
    margin-right: 20px;
  }
`;

const SectionBlock = styled.section`
  margin-top: 40px;
  position: relative;
  .title {
    margin-bottom: 16px;
    line-height: 20px;
    color: var(--bs-body-color_active);
  }
  .lftTit {
    position: absolute;
    top: 10px;
  }
`;

const ButtonSection = styled(SectionBlock)`
  button {
    width: 120px;
  }
`;

const SourceSelect = styled(Select)`
  width: 348px;
  margin-bottom: -10px;
`;
