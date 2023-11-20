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
import { IQueryApplicationsParams } from 'requests/applications';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import { ContainerPadding } from 'assets/styles/global';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useQuerySNS from 'hooks/useQuerySNS';
import { formatNumber } from 'utils/number';
import ApplicationStatusTag from 'components/common/applicationStatusTag';
import ApplicationModal from 'components/modals/applicationModal';
import BackerNav from 'components/common/backNav';

export default function Issued() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { dispatch } = useAuthContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>(ApplicationStatus.Approved);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailDisplay, setDetailDisplay] = useState<IApplicationDisplay>();
  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const statusOption = useMemo(() => {
    return [
      { label: t(formatApplicationStatus(ApplicationStatus.Approved)), value: ApplicationStatus.Approved },
      { label: t(formatApplicationStatus(ApplicationStatus.Processing)), value: ApplicationStatus.Processing },
      { label: t(formatApplicationStatus(ApplicationStatus.Completed)), value: ApplicationStatus.Completed },
    ];
  }, [t]);
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

  const changeDate = (rg: Date[]) => {
    setStartDate(rg[0]);
    setEndData(rg[1]);
    if ((rg[0] && rg[1]) || (!rg[0] && !rg[1])) {
      setSelectMap({});
      setPage(1);
    }
  };
  const onChangeCheckbox = (value: boolean, id: number, status: ApplicationStatus) => {
    setSelectMap({ ...selectMap, [id]: value && status });
  };

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryApplicationsParams = {};
      if (selectStatus) queryData.state = selectStatus;
      if (startDate && endDate) {
        queryData.start_date = formatDate(startDate);
        queryData.end_date = formatDate(endDate);
      }
      const res = await requests.application.getProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
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
        created_date: formatTime(item.created_at),
        transactions: item.transaction_ids.split(','),
        asset_display: formatNumber(Number(item.amount)) + ' ' + item.asset_name,
      }));
      setTotal(res.data.total);
      setList(_list);
    } catch (error) {
      console.error('getProjectApplications failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    const selectOrClearDate = (startDate && endDate) || (!startDate && !endDate);
    selectOrClearDate && getRecords();
  }, [selectStatus, page, pageSize, startDate, endDate]);

  const handleComplete = async (data: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      await requests.application.compeleteApplications(data);
      closeShow();
      getRecords();
      setIsProcessing(false);
      showToast(t('city-hall.SendSuccess'), ToastType.Success);
    } catch (error) {
      console.error('compeleteApplications failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleProcess = async () => {
    const ids = Object.keys(selectMap);
    const select_ids: number[] = [];
    for (const id of ids) {
      const _id = Number(id);
      if (selectMap[_id]) {
        select_ids.push(_id);
      }
    }
    if (!select_ids.length) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      await requests.application.processApplications(select_ids);
      getRecords();
      setSelectMap({});
      setIsProcessing(true);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
    } catch (error) {
      console.error('processApplications failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleStatus = async () => {
    const res = await requests.application.getProjectApplications(
      {
        page: 1,
        size: 1,
        sort_field: 'created_at',
        sort_order: 'desc',
      },
      {
        state: ApplicationStatus.Processing,
      },
    );
    if (!!res.data.rows.length) {
      setIsProcessing(true);
    }
  };

  useEffect(() => {
    handleStatus();
  }, []);

  const getSelectIds = (): number[] => {
    const ids = Object.keys(selectMap);
    const select_ids: number[] = [];
    for (const id of ids) {
      const _id = Number(id);
      if (selectMap[_id]) {
        select_ids.push(_id);
      }
    }
    return select_ids;
  };

  const handleExport = async () => {
    const select_ids = getSelectIds();
    window.open(requests.application.getExportFileUrl(select_ids), '_blank');
  };

  const onSelectAll = (v: boolean) => {
    const newMap = { ...selectMap };
    list.forEach((item) => {
      newMap[item.application_id] = v && item.status;
    });
    setSelectMap(newMap);
  };

  const selectOne = useMemo(() => {
    const select_ids = getSelectIds();
    return select_ids.length > 0;
  }, [selectMap]);

  const ifSelectAll = useMemo(() => {
    let _is_select_all = true;
    for (const item of list) {
      if (!selectMap[item.application_id]) {
        _is_select_all = false;
        break;
      }
    }
    return _is_select_all;
  }, [list, selectMap]);

  const showProcessButton = () => {
    if (selectStatus === ApplicationStatus.Approved) {
      return (
        <TopBox>
          <SendButtonBox>
            <Button onClick={handleProcess} disabled={isProcessing || !selectOne} className="btn-send">
              {t('city-hall.Send')}
            </Button>
            <div className="tip">{t('city-hall.Tips')}</div>
          </SendButtonBox>
        </TopBox>
      );
    } else if (selectStatus === ApplicationStatus.Processing) {
      return (
        <TopBox>
          <Button onClick={() => handleShow()} disabled={!isProcessing}>
            {t('city-hall.SendCompleted')}
          </Button>
        </TopBox>
      );
    }
    return <></>;
  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 6);
  };

  return (
    <Box>
      <BackerNav to="/city-hall/governance" title={t('city-hall.IssueAssets')} />
      {detailDisplay && (
        <ApplicationModal application={detailDisplay} handleClose={() => setDetailDisplay(undefined)} snsMap={snsMap} />
      )}
      {show && <IssuedModal closeShow={closeShow} handleConfirm={handleComplete} showToast={showToast} />}
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Select
              options={statusOption}
              placeholder=""
              value={statusOption.find((s) => s.value === selectStatus)}
              onChange={(value: any) => {
                setSelectStatus(value?.value as ApplicationStatus);
                setSelectMap({});
              }}
            ></Select>
          </li>
          <li>
            <Button onClick={handleExport} disabled={!selectOne}>
              {t('Project.Export')}
            </Button>
          </li>
        </TopLine>
        {showProcessButton()}
      </FirstLine>

      <TableBox>
        {list.length ? (
          <>
            <table className="table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  {ApplicationStatus.Processing !== selectStatus && (
                    <th>
                      <Form.Check
                        checked={ifSelectAll}
                        onChange={(e) => {
                          e.stopPropagation();
                          onSelectAll(e.target.checked);
                        }}
                      />
                    </th>
                  )}
                  <th style={{ width: '160px' }}>{t('application.Receiver')}</th>
                  <th className="center" style={{ width: '200px' }}>
                    {t('application.AddAssets')}
                  </th>
                  <th className="center" style={{ width: '200px' }}>
                    {t('application.Season')}
                  </th>
                  <th>{t('application.Content')}</th>
                  <th className="center" style={{ width: '200px' }}>
                    {t('application.BudgetSource')}
                  </th>
                  <th className="center" style={{ width: '200px' }}>
                    {t('application.Auditor')}
                  </th>
                  <th style={{ width: '200px' }}>{t('application.State')}</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id} onClick={() => setDetailDisplay(item)}>
                    {ApplicationStatus.Processing !== selectStatus && (
                      <td>
                        <Form.Check
                          checked={!!selectMap[item.application_id]}
                          onChange={(e) => onChangeCheckbox(e.target.checked, item.application_id, item.status)}
                        ></Form.Check>
                      </td>
                    )}

                    <td>{formatSNS(item.target_user_wallet.toLocaleLowerCase())}</td>
                    <td className="center" style={{ width: '200px' }}>
                      {item.asset_display}
                    </td>
                    <td className="center" style={{ width: '200px' }}>
                      {item.season_name}
                    </td>
                    <td>
                      <BudgetContent>{item.detailed_type}</BudgetContent>
                    </td>
                    <td className="center" style={{ width: '200px' }}>
                      {item.budget_source}
                    </td>
                    <td>{formatSNS(item.reviewer_wallet.toLocaleLowerCase())}</td>
                    <td style={{ width: '200px' }}>
                      <ApplicationStatusTag status={item.status} />
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
const FirstLine = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px 40px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
  @media (max-width: 1024px) {
    gap: 20px;
  }
`;

const TopBox = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  button {
    margin-left: 20px;
  }
`;

const TableBox = styled.div`
  width: 100%;
  td {
    vertical-align: middle;
  }
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
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
