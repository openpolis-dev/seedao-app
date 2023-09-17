import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
// import Select from '@paljs/ui/Select';
import React, { useEffect, useState, useMemo } from 'react';
import Page from 'components/pagination';
import ViewHash from '../projectInfoCom/viewHash';
import RangeDatePickerStyle from 'components/rangeDatePicker';
// import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import { IQueryApplicationsParams } from 'requests/applications';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import utils from 'utils/publicJs';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Loading from 'components/loading';
import { formatDate, formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
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
      white-space: nowrap;
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

export default function AssetList({ id }: { id: number }) {
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [show, setShow] = useState<string[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();

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
  const handleShow = async (ids: string[]) => {
    setShow(ids);
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

  const getApplicants = async () => {
    try {
      const res = await requests.application.getApplicants({
        entity: 'project',
        entity_id: id,
      });
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
    id && getApplicants();
  }, [id]);

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryApplicationsParams = {};
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
        id,
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
    id && selectOrClearDate && getRecords();
  }, [id, selectStatus, selectApplicant, page, pageSize, startDate, endDate]);

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

  const handleExport = async () => {
    const select_ids = getSelectIds();
    window.open(requests.application.getExportFileUrl(select_ids), '_blank');
  };

  return (
    <Box>
      {show && <ViewHash closeShow={closeShow} txs={show} />}
      {loading && <Loading />}

      <TitBox>{t('Project.Record')}</TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Form.Select
              className="sel"
              // options={statusOption}
              placeholder=""
              onChange={(value: any) => {
                setSelectStatus(value?.value);
                setSelectMap({});
                setPage(1);
              }}
              // isClearable={true}
            >
              {statusOption.map((opItem, opKey) => (
                <option value={opItem.value} key={`statusOption_${opKey}`}>
                  {opItem.label}
                </option>
              ))}
            </Form.Select>
          </li>
          <li>
            <span className="tit">{t('Project.Operator')}</span>
            <Form.Select
              className="sel"
              // options={applicants}
              placeholder=""
              onChange={(value: any) => {
                setSelectApplicant(value?.value);
                setSelectMap({});
                setPage(1);
              }}
              // isClearable={true}
            >
              {applicants.map((opItem, opKey) => (
                <option value={opItem.value} key={`applicants_${opKey}`}>
                  {opItem.label}
                </option>
              ))}
            </Form.Select>
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
          <Button onClick={handleExport} disabled={!selectOne}>
            {t('Project.Export')}
          </Button>
        </TimeLine>
      </FirstLine>
      <TableBox>
        {list.length ? (
          <>
            <table className="table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th>
                    <Form.Check checked={ifSelectAll} onChange={(value: any) => onSelectAll(value)} />
                  </th>
                  <th>{t('Project.Time')}</th>
                  <th>{t('Project.Address')}</th>
                  <th>{t('Project.AddPoints')}</th>
                  <th>{t('Project.AddToken')}</th>
                  <th>{t('Project.Content')}</th>
                  <th>{t('Project.Note')}</th>
                  <th>{t('Project.State')}</th>
                  <th>{t('Project.Add')}</th>
                  <th>{t('Project.Auditor')}</th>
                  <th>{t('Project.TransactionID')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id}>
                    <td>
                      <Form.Check
                        checked={!!selectMap[item.application_id]}
                        onChange={(value: any) => onChangeCheckbox(value, item.application_id, item.status)}
                      ></Form.Check>
                    </td>
                    <td>{item.created_date}</td>
                    <td>
                      <div>
                        <span>{publicJs.AddressToShow(item.target_user_wallet)}</span>
                        {/* <CopyBox text={item.target_user_wallet}>
                        <EvaIcon name="clipboard-outline" />
                      </CopyBox> */}
                      </div>
                    </td>
                    <td>{item.credit_amount}</td>
                    <td>{item.token_amount}</td>
                    <td>{item.detailed_type}</td>
                    <td>{item.comment}</td>
                    <td>{t(formatApplicationStatus(item.status))}</td>
                    <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
                    <td>{item.reviewer_name || publicJs.AddressToShow(item.reviewer_wallet)}</td>
                    <td>
                      {item.status === ApplicationStatus.Completed && (
                        <Button onClick={() => handleShow(item.transactions || [])}>{t('Project.View')}</Button>
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
      </TableBox>
    </Box>
  );
}
