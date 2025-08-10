import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';

import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import IssuedModal from 'components/cityHallCom/issuedModal';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import requests from 'requests';
import { formatDate, formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import NoItem from 'components/noItem';
import { getStatistics, IQueryApplicationsParams } from "requests/applications";
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import { ContainerPadding } from 'assets/styles/global';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useQuerySNS from 'hooks/useQuerySNS';
import { formatNumber } from 'utils/number';
import ApplicationStatusTag from 'components/common/applicationStatusTag';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import ApplicationModal from 'components/modals/applicationModal';
import BackerNav from 'components/common/backNav';
import { PlainButton } from 'components/common/button';

const Colgroups = () => {
  return (
    <colgroup>
      {/* receiver */}
      <col style={{ width: '160px' }} />
      {/* add assets */}
      <col style={{ width: '180px' }} />
      {/* season */}
      <col style={{ width: '120px' }} />
      {/* Content */}
      <col />
      {/* source */}
      <col style={{ width: '140px' }} />
      {/* auditor */}
      <col style={{ width: '160px' }} />
      {/* state */}
      <col style={{ width: '170px' }} />
      {/* more */}
      <col style={{ width: '130px' }} />
    </colgroup>
  );
};

export default function Issued() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { state: { theme },dispatch } = useAuthContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailDisplay, setDetailDisplay] = useState<IApplicationDisplay>();
  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());
  const [statistics,setStatistics] = useState<any>({});

  const { getMultiSNS } = useQuerySNS();

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };
  const handleShow = () => {
    setShow(true);
  };
  const closeShow = () => {
    setShow(false);
  };

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryApplicationsParams = { state: selectStatus };
      const res = await requests.application.getProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'create_ts',
          sort_order: 'desc',
        },
        queryData,
        undefined,
      );
      setTotal(res.data.total);
      const _wallets = new Set<string>();
      res.data.rows.forEach((item) => {
        _wallets.add(item.target_user_wallet);
        item.applicant_wallet && _wallets.add(item.applicant_wallet);
        item.reviewer_wallet && _wallets.add(item.reviewer_wallet);
      });
      handleSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item, idx) => ({
        ...item,
        created_date: formatTime(item.create_ts * 1000),
        complete_date: formatTime(item.complete_ts * 1000),
        review_date: formatTime(item.review_ts * 1000),
        transactions: item.transaction_ids.split(','),
        asset_display: Number(item.amount).format() + ' ' + item.asset_name,
      }));
      setTotal(res.data.total);
      setList(_list);
    } catch (error:any) {
      logError('getProjectApplications failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleComplete = async (data: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      await requests.application.compeleteApplications(data);
      closeShow();
      setSelectStatus(ApplicationStatus.Completed);
      setIsProcessing(false);
      showToast(t('city-hall.SendSuccess'), ToastType.Success);
    } catch (error: any) {
      logError('compeleteApplications failed', error);
      // let msg = error?.data?.msg || t('Msg.ApproveFailed');
      // showToast(msg, ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleProcess = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await requests.application.processApplications();
      setSelectStatus(ApplicationStatus.Processing);
      setIsProcessing(true);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
    } catch (error: any) {
      logError('processApplications failed', error);
      // let msg = error?.data?.msg || t('Msg.ApproveFailed');
      // showToast(msg, ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleStatus = async () => {
    try{
      const res = await requests.application.getProjectApplications(
        {
          page: 1,
          size: 1,
          sort_field: 'create_ts',
          sort_order: 'desc',
        },
        {
          state: ApplicationStatus.Processing,
        },
      );
      setIsProcessing(!!res.data.rows.length);
      setSelectStatus(res.data.rows.length ? ApplicationStatus.Processing : ApplicationStatus.Approved);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };

  useEffect(() => {
    handleStatus();
    getST();
  }, []);

  const getST = async() =>{
    try{
      let rt = await getStatistics();
      setStatistics(rt.data)
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  }

  useEffect(() => {
    selectStatus && getRecords();
  }, [selectStatus, page, pageSize]);

  const handleExport = async () => {
    window.open(requests.application.getExportFileUrlFromVault({ state: selectStatus }), '_blank');
  };

  const showProcessButton = () => {
    if (selectStatus === ApplicationStatus.Approved) {
      return (
        <TopBox>
          {/* <SendButtonBox> */}
          <Button onClick={handleProcess} disabled={!list.length || isProcessing} className="btn-send">
            {t('city-hall.Send')}
          </Button>
          {/* <div className="tip">{t('city-hall.Tips')}</div> */}
          {/* </SendButtonBox> */}
        </TopBox>
      );
    } else if (selectStatus === ApplicationStatus.Processing) {
      return (
        <TopBox>
          <Button onClick={() => handleShow()} disabled={!list.length || !isProcessing} className="btn-com">
            {t('city-hall.SendCompleted')}
          </Button>
        </TopBox>
      );
    }
    return <></>;
  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  const borderStyle = useMemo(() => {
    return theme ? '1px solid #29282F' : 'unset';
  }, [theme]);

  return (
    <Box>
      <BackerNav to="/city-hall/governance" title={t('city-hall.IssueAssets')} mb="16px" />
      {detailDisplay && (
        <ApplicationModal application={detailDisplay} handleClose={() => setDetailDisplay(undefined)} snsMap={snsMap} />
      )}
      {show && <IssuedModal closeShow={closeShow} handleConfirm={handleComplete} showToast={showToast} />}
      <FirstLine border={borderStyle}>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.ToBeIssuedSeason")}(USD)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.wait_for_grant_usd ?? 0}</div>
          <BorderDecoration color="#FF86CB" />
        </li>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.ToBeIssuedSeason")}(WANG)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.wait_for_grant_scr ?? 0}</div>
          <BorderDecoration color="#FFB842" />
        </li>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.SentSeason")}(USD)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.granted_usd ?? 0}</div>
          <BorderDecoration color="#03DACD" />
        </li>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.SentSeason")}(WANG)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.granted_scr ?? 0}</div>
          <BorderDecoration color="#4378FF" />
        </li>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.ReviewedSeason")}(USD)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.checking_usd ?? 0}</div>
          <BorderDecoration color="#9E2A2F" />
        </li>
        <li>
          <LiHead>
            <LiTitle>{t("Assets.ReviewedSeason")}(WANG)</LiTitle>
          </LiHead>
          <div className="num">{statistics?.checking_scr ?? 0}</div>
          <BorderDecoration color="#8BC34A" />
        </li>
      </FirstLine>
      <TopLine>
        {showProcessButton()}
        <li>
          <ExportButton onClick={handleExport}>{t("Project.Export")}</ExportButton>
        </li>
      </TopLine>

      <TableBox>
      {list.length ? (
          <>
            <table className="table" cellPadding="0" cellSpacing="0">
              <Colgroups />
              <thead>
                <tr>
                  <th>{t('application.Receiver')}</th>
                  <th className="right">{t('application.AddAssets')}</th>
                  <th className="center">{t('application.Season')}</th>
                  <th>{t('application.Content')}</th>
                  <th>{t('application.BudgetSource')}</th>
                  <th>{t('application.Auditor')}</th>
                  <th className="center">{t('application.State')}</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id}>
                    <td>{formatSNS(item.target_user_wallet.toLocaleLowerCase())}</td>
                    <td className="right">{item.asset_display}</td>
                    <td className="center">{item.season_name}</td>
                    <td>
                      <BudgetContent>{item.detailed_type}</BudgetContent>
                    </td>
                    <td>{item.budget_source}</td>
                    <td>{formatSNS(item.reviewer_wallet.toLocaleLowerCase())}</td>
                    <td className="center">
                      <ApplicationStatusTagNew status={item.status} />
                    </td>
                    <td className="center">
                      <MoreButton onClick={() => setDetailDisplay(item)}>{t('application.Detail')}</MoreButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Page
              itemsPerPage={pageSize}
              total={total}
              current={page - 1}
              handleToPage={handlePage}
              handlePageSize={handlePageSize}
            />
          </>
        ) : (
          <NoItem />
        )}
      </TableBox>
    </Box>
  );
}

const Box = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 16px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;

const TopBox = styled.li`
  button {
    width: 110px;
  }
  .btn-com {
    width: auto;
    min-width: 110px;
  }
`;

const TableBox = styled.div`
  width: 100%;
  td {
    vertical-align: middle;
  }
`;

const ExportButton = styled(PlainButton)`
  font-size: 14px;
  font-family: Poppins-Regular;
`;

const SendButtonBox = styled.div`
  position: relative;
  .tip {
    display: none;
    position: absolute;
    top: 50px;
    right: 0;
    width: 370px;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 10px;
    z-index: 99;
  }
  &:hover .tip {
    display: block;
  }
`;

const BudgetContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const MoreButton = styled.div`
  padding-inline: 26px;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  display: inline-block;
  background: var(--bs-box--background);
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid var(--bs-border-color);
  font-size: 14px;
`;
const FirstLine = styled.ul<{ border: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
  flex-wrap: wrap;

  li {
    position: relative;
    width: 16%;
    height: 153px;
    border-radius: 16px;
    padding: 20px 25px;
    overflow: hidden;
      box-sizing: border-box;
      margin-bottom: 20px;
    position: relative;
    background-color: var(--bs-box--background);
    border: ${(props) => props.border};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: var(--box-shadow);
    &:hover {
      background-color: var(--home-right_hover);
    }

    @media screen and (max-width: 1000px) {
      width: 48%;
    }
    @media (max-width: 695px) {
      width: 100%;
    }
  }
  .num {
    font-size: 28px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    margin-bottom: 25px;
      color: var(--bs-body-color_active);
  }
  @media (max-width: 1100px) {
    .num {
      font-size: 20px;
    }
  }
`;
const BorderDecoration = styled.div<{ color: string }>`
  width: 8px;
  height: calc(100% - 48px);
  box-sizing: border-box;
  background-color: ${(props) => props.color};
  position: absolute;
  top: 24px;
  left: 0%;
  border-radius: 0 100px 100px 0;
`;
const LiHead = styled.div`
  //height: 40px;
  width: 100%;
`;
const LiTitle = styled.div`
  color: var(--bs-body-color);
  line-height: 18px;
    font-size: 14px;
`;
