import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import ViewHash from '../projectInfoCom/viewHash';
import RangeDatePickerStyle from 'components/rangeDatePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import { IQueryApplicationsParams } from 'requests/applications';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import utils from 'utils/publicJs';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Loading from 'components/loading';
import { formatDate, formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import { useWeb3React } from '@web3-react/core';
import useTranslation from 'hooks/useTranslation';
import { formatApplicationStatus } from 'utils/index';

const Box = styled.div``;
const TitBox = styled.div`
  font-weight: bold;
  margin: 40px 0 20px;
`;
const FirstLine = styled.div`
  display: flex;
  //flex-direction: column;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  //justify-content: space-between;
`;

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  li {
    display: flex;
    align-items: center;
    margin-right: 40px;

    .tit {
      padding-right: 20px;
    }

    .sel {
      min-width: 150px;
    }
  }
`;

const TimeLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const BorderBox = styled.div`
  border: 1px solid #eee;
  padding: 2px 20px;
  border-radius: 5px;
  background: #f7f9fc;
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  table {
    th {
      background: transparent;
      color: #6e6893;
      border: 1px solid #d9d5ec;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
    td {
      border-bottom-color: #d9d5ec;
    }
    tr:hover td {
      background: #f2f0f9;
    }
  }
`;

export default function AssetList() {
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState<string[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>(ApplicationStatus.All);
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();
  const [projects, setProjects] = useState<ISelectItem[]>([]);
  const [selectProject, setSelectProject] = useState<number>();

  const statusOption = useMemo(() => {
    return [
      { label: t(formatApplicationStatus(ApplicationStatus.Open)), value: ApplicationStatus.Open },
      { label: t(formatApplicationStatus(ApplicationStatus.Rejected)), value: ApplicationStatus.Rejected },
      { label: t(formatApplicationStatus(ApplicationStatus.Approved)), value: ApplicationStatus.Approved },
      { label: t(formatApplicationStatus(ApplicationStatus.Processing)), value: ApplicationStatus.Processing },
      { label: t(formatApplicationStatus(ApplicationStatus.Completed)), value: ApplicationStatus.Completed },
    ];
  }, [t]);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };
  const handleShow = (data: string[]) => {
    setShow(data);
  };
  const closeShow = () => {
    setShow(undefined);
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

  const getProjects = async () => {
    try {
      const res = await requests.project.getProjects({
        page: 1,
        size: 20,
        sort_order: 'desc',
        sort_field: 'created_at',
      });
      setProjects(
        res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      );
    } catch (error) {
      console.error('getProjects in city-hall failed: ', error);
    }
  };

  const getApplicants = async () => {
    try {
      const res = await requests.application.getApplicants();
      const options = res.data.map((item) => ({
        label: item.Name || utils.AddressToShow(item.Applicant),
        value: item.Applicant,
      }));
      setApplicants(options);
    } catch (error) {
      console.error('getApplicants error', error);
    }
  };

  useEffect(() => {
    getApplicants();
    getProjects();
  }, []);

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryApplicationsParams = {
        user_wallet: account,
      };
      if (selectStatus) queryData.state = selectStatus;
      if (selectApplicant) queryData.applicant = selectApplicant;
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
        selectProject,
      );
      setTotal(res.data.total);
      const _list = res.data.rows.map((item) => ({
        ...item,
        created_date: formatTime(item.created_at),
        transactions: item.transaction_ids.split(','),
      }));
      setList(_list);
    } catch (error) {
      console.error('getRecords error', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    const selectOrClearDate = (startDate && endDate) || (!startDate && !endDate);
    account && selectOrClearDate && getRecords();
  }, [selectStatus, selectApplicant, selectProject, page, pageSize, startDate, endDate, account]);

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

  return (
    <Box>
      {show && <ViewHash closeShow={closeShow} txs={show} />}
      {loading && <Loading />}

      <TitBox>{t('Project.Record')}</TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Select
              className="sel"
              options={statusOption}
              placeholder=""
              onChange={(value) => {
                setSelectStatus(value?.value as ApplicationStatus);
                setSelectMap({});
                setPage(1);
              }}
              isClearable={true}
            />
          </li>
          <li>
            <span className="tit">{t('Project.BudgetSource')}</span>
            <Select
              className="sel"
              options={projects}
              placeholder=""
              onChange={(value) => {
                setSelectProject(value?.value);
                setSelectMap({});
                setPage(1);
              }}
              isClearable={true}
            />
          </li>
          <li>
            <span className="tit">{t('Project.Operator')}</span>
            <Select
              className="sel"
              options={applicants}
              placeholder=""
              onChange={(value) => {
                setSelectApplicant(value?.value);
                setSelectMap({});
                setPage(1);
              }}
              isClearable={true}
            />
          </li>
        </TopLine>
        <TimeLine>
          <TimeBox>
            <BorderBox>
              <RangeDatePickerStyle
                placeholder={t('Project.RangeTime')}
                onChange={changeDate}
                startDate={startDate}
                endDate={endDate}
              />
            </BorderBox>
          </TimeBox>
          <Button size="Medium" onClick={handleExport} disabled={!selectOne}>
            {t('Project.Export')}
          </Button>
        </TimeLine>
      </FirstLine>
      <TableBox>
        <table className="table" cellPadding="0" cellSpacing="0">
          {list.length ? (
            <>
              <table className="table" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>
                      <Checkbox status="Primary" checked={ifSelectAll} onChange={(value) => onSelectAll(value)} />
                    </th>
                    <th>{t('Project.Time')}</th>
                    <th>{t('Project.Address')}</th>
                    <th>{t('Project.AddPoints')}</th>
                    <th>{t('Project.AddToken')}</th>
                    <th>{t('Project.Content')}</th>
                    <th>{t('Project.BudgetSource')}</th>
                    <th>{t('Project.Note')}</th>
                    <th>{t('Project.State')}</th>
                    <th>{t('Project.Operator')}</th>
                    <th>{t('Project.Auditor')}</th>
                    <th>{t('Project.TransactionID')}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => (
                    <tr key={item.application_id}>
                      <td>
                        <Checkbox
                          status="Primary"
                          checked={!!selectMap[item.application_id]}
                          onChange={(value) => onChangeCheckbox(value, item.application_id, item.status)}
                        ></Checkbox>
                      </td>
                      <td>{item.created_date}</td>
                      <td>
                        <div>
                          <span>{publicJs.AddressToShow(item.target_user_wallet)}</span>
                          {/* <CopyBox text={item.target_user_wallet}>
                          <>复制</>
                        </CopyBox> */}
                        </div>
                      </td>
                      <td>{item.credit_amount}</td>
                      <td>{item.token_amount}</td>
                      <td>{item.detailed_type}</td>
                      <td>{item.budget_source}</td>
                      <td>{item.comment}</td>
                      <td>{t(formatApplicationStatus(item.status))}</td>
                      <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
                      <td>{item.reviewer_name || publicJs.AddressToShow(item.reviewer_wallet)}</td>
                      <td>
                        {item.status === ApplicationStatus.Completed && (
                          <Button appearance="outline" size="Tiny" onClick={() => handleShow(item.transactions || [])}>
                            {t('Project.View')}
                          </Button>
                        )}
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
        </table>
      </TableBox>
    </Box>
  );
}
