import styled from 'styled-components';
import { Button, Form, Table } from 'react-bootstrap';

import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import { IQueryParams } from 'requests/applications';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import utils from 'utils/publicJs';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Loading from 'components/loading';
import { formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import Select from 'components/common/select';
import { formatNumber } from 'utils/number';
import ApplicationModal from 'components/modals/applicationModal';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import useSeasons from 'hooks/useSeasons';
import useQuerySNS from 'hooks/useQuerySNS';
import useBudgetSource from 'hooks/useBudgetSource';
import { useNavigate } from 'react-router-dom';
import getConfig from 'utils/envCofnig';

import RecordImg from 'assets/Imgs/light/record.svg';
import ApplyImg from 'assets/Imgs/light/apply.svg';
import RankImg from 'assets/Imgs/light/rank.svg';
import SearchImg from 'assets/Imgs/light/search.svg';

import RecordWhite from 'assets/Imgs/dark/record.svg';
import ApplyWhite from 'assets/Imgs/dark/apply.svg';
import RankWhite from 'assets/Imgs/dark/rank.svg';
import SearchWhite from 'assets/Imgs/light/search.svg';

const Box = styled.div``;
const TitBox = styled.div`
  margin: 60px 0 40px;
  font-size: 24px;
  font-family: Poppins-Bold;
  line-height: 30px;
  display: flex;
  align-items: center;
  dl {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 40px;
    cursor: pointer;
    &.active,
    &:hover {
      font-weight: bold;
      dd:after {
        content: '';
        width: 50px;
        height: 4px;
        background: var(--bs-primary);
        position: absolute;
        bottom: -10px;
        left: calc((100% - 50px) / 2);
      }
    }
  }
  dd {
    position: relative;
  }
  dt {
    margin-right: 8px;
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const FirstLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: end;
  margin-bottom: 20px;
  .btn-export {
    min-width: 111px;
  }
  @media (max-width: 1100px) {
    justify-content: flex-start;
    flex-direction: column;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1000px) {
    justify-content: space-between;
    flex-direction: row;
    align-items: end;
  }
`;

const TopLine = styled.ul`
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 24px;
  li {
    display: flex;
    flex-direction: column;
    > span {
      margin-bottom: 10px;
    }
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
  @media (max-width: 1100px) {
    width: 100%;
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
  th {
    text-align: center;
    &:first-child,
    &:nth-child(4) {
      text-align: left;
    }
  }
  td {
    vertical-align: middle;
    border-top: 1px solid var(--bs-border-color);
    border-bottom: 0;
  }
  tbody tr {
    border: 0;
  }
  tr:hover {
    td {
      border-top: 0;
    }
    & + tr {
      td {
        border-top: 0;
      }
    }

    //td {
    //  border-bottom: 1px solid #fff !important;
    //}
  }
`;

const SearchBox = styled.div`
  height: 40px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  input {
    border: 0;
    background: transparent;
    margin-left: 9px;
    height: 24px;
    &::placeholder {
      color: var(--bs-body-color);
    }
    &:focus {
      outline: none;
    }
  }
`;

export default function AssetList() {
  const navigate = useNavigate();

  const {
    state: { theme },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();
  // budget source
  const allSource = useBudgetSource();
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  const [detailDisplay, setDetailDisplay] = useState<IApplicationDisplay>();
  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState<number>();

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const statusOption = useMemo(() => {
    return [
      { label: t(formatApplicationStatus(ApplicationStatus.Open)), value: ApplicationStatus.Open },
      { label: t(formatApplicationStatus(ApplicationStatus.Rejected)), value: ApplicationStatus.Rejected },
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

  const onChangeCheckbox = (value: boolean, id: number, status: ApplicationStatus) => {
    setSelectMap({ ...selectMap, [id]: value && status });
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
  }, []);

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getQuerydata = () => {
    const queryData: IQueryParams = {};
    if (selectStatus) queryData.state = selectStatus;
    if (selectApplicant) queryData.applicant = selectApplicant;
    if (selectSeason) {
      queryData.season_id = selectSeason;
    }
    if (selectSource && selectSource.type) {
      queryData.entity_id = selectSource.id;
      queryData.entity = selectSource.type;
    }
    return queryData;
  };

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await requests.application.getApplications(
        {
          page,
          size: pageSize,
          sort_field: 'create_ts',
          sort_order: 'desc',
        },
        getQuerydata(),
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
        transactions: item.transaction_ids.split(','),
        asset_display: formatNumber(Number(item.amount)) + ' ' + item.asset_name,
        submitter_name: item.applicant_wallet?.toLocaleLowerCase(),
        reviewer_name: item.reviewer_wallet?.toLocaleLowerCase(),
        receiver_name: item.target_user_wallet?.toLocaleLowerCase(),
      }));
      setList(_list);
    } catch (error) {
      console.error('getRecords error', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    getRecords();
  }, [selectSeason, selectStatus, selectApplicant, page, pageSize, selectSource]);

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
    window.open(requests.application.getExportFileUrlFromVault(getQuerydata()), '_blank');
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

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 6);
  };

  const openApply = () => {
    navigate('/assets/register', { state: '/assets' });
  };
  const openRank = () => {
    navigate('/ranking', { state: '/assets' });
  };
  return (
    <Box>
      {detailDisplay && (
        <ApplicationModal application={detailDisplay} handleClose={() => setDetailDisplay(undefined)} snsMap={snsMap} />
      )}

      <TitBox>
        <dl className="active">
          <dt>
            <img src={theme ? RecordWhite : RecordImg} alt="" />
          </dt>
          <dd>{t('Assets.record')}</dd>
        </dl>
        <dl onClick={() => openApply()}>
          <dt>
            <img src={theme ? ApplyWhite : ApplyImg} alt="" />
          </dt>
          <dd>{t('Assets.apply')}</dd>
        </dl>
        <dl onClick={() => openRank()}>
          <dt>
            <img src={theme ? RankWhite : RankImg} alt="" />
          </dt>
          <dd>{t('GovernanceNodeResult.SCRRank')}</dd>
        </dl>
      </TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <SearchBox>
              <img src={theme ? SearchWhite : SearchImg} alt="" />
              <input type="text" placeholder="sns" />
            </SearchBox>
          </li>
          <li>
            {/*<span className="tit">{t('Project.State')}</span>*/}
            <Select
              options={statusOption}
              placeholder={t('Project.State')}
              onChange={(value: any) => {
                setSelectStatus(value?.value as ApplicationStatus);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            {/*<span className="tit">{t('application.BudgetSource')}</span>*/}
            <Select
              options={allSource}
              placeholder={t('application.BudgetSource')}
              onChange={(value: any) => {
                setSelectSource({ id: value?.value as number, type: value?.data });
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            {/*<span className="tit">{t('application.Operator')}</span>*/}
            <Select
              options={applicants}
              placeholder={t('application.Operator')}
              onChange={(value: any) => {
                setSelectApplicant(value?.value);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            {/*<span className="tit">{t('application.Season')}</span>*/}
            <Select
              options={seasons}
              placeholder={t('application.Season')}
              onChange={(value: any) => {
                setSelectSeason(value?.value);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
        </TopLine>
        {getConfig().REACT_APP_ENV !== 'prod' && getConfig().REACT_APP_ENV !== 'preview' && (
          <div>
            <Button onClick={handleExport} className="btn-export">
              {t('Assets.Export')}
            </Button>
          </div>
        )}
      </FirstLine>

      <TableBox>
        {list.length ? (
          <>
            <Table responsive>
              <colgroup>
                {/* receiver */}
                <col style={{ width: '160px' }} />
                {/* add assets */}
                <col style={{ width: '140px' }} />
                {/* season */}
                <col style={{ width: '100px' }} />
                {/* Content */}
                <col />
                {/* source */}
                <col style={{ width: '140px' }} />
                {/* operator */}
                <col style={{ width: '160px' }} />
                {/* state */}
                <col style={{ width: '170px' }} />
              </colgroup>
              <thead>
                <tr>
                  {/* <th className="chech-th">
                    <Form.Check checked={ifSelectAll} onChange={(e) => onSelectAll(e.target.checked)} />
                  </th> */}
                  <th>{t('application.Receiver')}</th>
                  <th className="center">{t('application.AddAssets')}</th>
                  <th className="center">{t('application.Season')}</th>
                  <th>{t('application.Content')}</th>
                  <th className="center">{t('application.BudgetSource')}</th>
                  <th className="center">{t('application.Operator')}</th>
                  <th>{t('application.State')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id} onClick={() => setDetailDisplay(item)}>
                    {/* <td>
                      <Form.Check
                        checked={!!selectMap[item.application_id]}
                        onChange={(e) => onChangeCheckbox(e.target.checked, item.application_id, item.status)}
                      />
                    </td> */}
                    <td>{formatSNS(item.receiver_name || '')}</td>

                    <td className="center">{item.asset_display}</td>
                    <td className="center">{item.season_name}</td>
                    <td>
                      <BudgetContent>{item.detailed_type}</BudgetContent>
                    </td>
                    <td className="center">{item.budget_source}</td>
                    <td className="center">{formatSNS(item.submitter_name)}</td>
                    <td className="center">
                      <ApplicationStatusTagNew status={item.status} />
                    </td>
                    <td className="center">
                      <MoreButton>{t('application.Detail')}</MoreButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

const BudgetContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const MoreButton = styled.div`
  padding: 7px 26px;
  display: inline-block;
  background: var(--bs-box--background);
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid var(--bs-border-color);
  font-size: 14px;
`;
