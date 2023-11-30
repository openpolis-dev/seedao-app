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
import useAssets from 'hooks/useAssets';

import RecordImg from 'assets/Imgs/light/record.svg';
import ApplyImg from 'assets/Imgs/light/apply.svg';
import RankImg from 'assets/Imgs/light/rank.svg';
import SearchImg from 'assets/Imgs/light/search.svg';

import RecordWhite from 'assets/Imgs/dark/record.svg';
import ApplyWhite from 'assets/Imgs/dark/apply.svg';
import RankWhite from 'assets/Imgs/dark/rank.svg';
import SearchWhite from 'assets/Imgs/light/search.svg';
import useToast, { ToastType } from 'hooks/useToast';
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';
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
      {/* operator */}
      <col style={{ width: '160px' }} />
      {/* state */}
      <col style={{ width: '170px' }} />
      {/* more */}
      <col style={{ width: '130px' }} />
    </colgroup>
  );
};

const Box = styled.div``;
const TitBox = styled.div`
  margin: 60px 0 40px;
  font-size: 20px;
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

const FilterLine = styled.div`
  width: 100%;
  margin-bottom: 20px;
  table {
    td {
      border: none !important;
    }
    tr:hover td {
      background: transparent;
    }
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
  width: 100%;
  height: 40px;
  background: var(--bs-box-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  input {
    width: calc(100% - 15px);
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
  // budget source
  const allSource = useBudgetSource();
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  const [detailDisplay, setDetailDisplay] = useState<IApplicationDisplay>();
  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState<number>();
  // assets
  const assets = useAssets();
  const [selectAsset, setSelectAsset] = useState();

  // search target user
  const [targetKeyword, setTargetKeyword] = useState('');
  const [searchTargetVal, setSearchTargetVal] = useState('');
  // search applicant
  const [applicantKeyword, setApplicantKeyword] = useState('');
  const [searchApplicantVal, setSearchApplicantVal] = useState('');
  // search content
  const [searchContentVal, setSearchContentVal] = useState('');

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

  const { showToast } = useToast();

  const { getMultiSNS } = useQuerySNS();

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const handleSearch = async (keyword: string, setSearchVal: (v: string) => void) => {
    if (keyword.endsWith('.seedao')) {
      // sns
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      const w = await sns.resolve(keyword);
      if (w && w !== ethers.constants.AddressZero) {
        setSearchVal(w?.toLocaleLowerCase());
      } else {
        showToast(t('Msg.SnsNotFound', { sns: keyword }), ToastType.Danger);
      }
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    } else if (ethers.utils.isAddress(keyword)) {
      // address
      setSearchVal(keyword?.toLocaleLowerCase());
    } else {
      showToast(t('Msg.InvalidAddress', { address: keyword }), ToastType.Danger);
    }
  };
  const onKeyUp = (e: any, type: string) => {
    if (e.keyCode === 13) {
      // document.activeElement.blur();
      switch (type) {
        case 'target':
          handleSearch(targetKeyword, setSearchTargetVal);
          break;
        case 'applicant':
          handleSearch(applicantKeyword, setSearchApplicantVal);
          break;
        case 'content':
          getRecords();
          break;
        default:
          return;
      }
    }
  };

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getQuerydata = () => {
    const queryData: IQueryParams = {};
    if (selectStatus) queryData.state = selectStatus;
    // if (selectApplicant) queryData.applicant = selectApplicant;
    if (selectSeason) {
      queryData.season_id = selectSeason;
    }
    if (selectSource && selectSource.type) {
      queryData.entity_id = selectSource.id;
      queryData.entity = selectSource.type;
    }
    if (selectAsset) {
      queryData.asset_name = selectAsset;
    }
    if (searchTargetVal) {
      queryData.user_wallet = searchTargetVal;
    }
    if (searchApplicantVal) {
      queryData.applicant = searchApplicantVal;
    }
    if (searchContentVal) {
      queryData.detailed_type = searchContentVal;
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
        review_date: formatTime(item.review_ts * 1000),
        process_date: formatTime(item.process_ts * 1000),
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
  }, [selectSeason, selectStatus, page, pageSize, selectSource, selectAsset, searchTargetVal, searchApplicantVal]);

  const handleExport = async () => {
    window.open(requests.application.getExportFileUrlFromVault(getQuerydata()), '_blank');
  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
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
          <dd>{t('Assets.Apply')}</dd>
        </dl>
        <dl onClick={() => openRank()}>
          <dt>
            <img src={theme ? RankWhite : RankImg} alt="" />
          </dt>
          <dd>{t('GovernanceNodeResult.SCRRank')}</dd>
        </dl>
      </TitBox>
      <FilterLine>
        <Table responsive>
          <Colgroups />
          <tbody>
            <tr>
              <td>
                <SearchBox>
                  <img src={theme ? SearchWhite : SearchImg} alt="" />
                  <input
                    type="text"
                    placeholder={t('application.SearchTargetUserHint')}
                    onKeyUp={(e) => onKeyUp(e, 'target')}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                  />
                </SearchBox>
              </td>

              <td>
                <Select
                  menuPortalTarget={document.body}
                  width="100%"
                  options={assets}
                  closeClear={true}
                  isSearchable={false}
                  placeholder={t('application.SelectAsset')}
                  onChange={(value: any) => {
                    setSelectAsset(value?.value);
                    setPage(1);
                  }}
                />
              </td>
              <td>
                <Select
                  menuPortalTarget={document.body}
                  width="100%"
                  options={seasons}
                  placeholder={t('application.Season')}
                  onChange={(value: any) => {
                    setSelectSeason(value?.value);
                    setPage(1);
                  }}
                />
              </td>
              <td>
                <SearchBox style={{ maxWidth: '200px' }}>
                  <img src={theme ? SearchWhite : SearchImg} alt="" />
                  <input
                    type="text"
                    placeholder={t('application.SearchDetailHint')}
                    onKeyUp={(e) => onKeyUp(e, 'content')}
                    onChange={(e) => setSearchContentVal(e.target.value)}
                  />
                </SearchBox>
              </td>
              <td>
                <Select
                  menuPortalTarget={document.body}
                  width="100%"
                  options={allSource}
                  placeholder={t('application.BudgetSource')}
                  onChange={(value: any) => {
                    setSelectSource({ id: value?.value as number, type: value?.data });
                    setPage(1);
                  }}
                />
              </td>
              <td>
                <SearchBox>
                  <img src={theme ? SearchWhite : SearchImg} alt="" />
                  <input
                    type="text"
                    placeholder={t('application.SearchApplicantHint')}
                    onKeyUp={(e) => onKeyUp(e, 'applicant')}
                    onChange={(e) => setApplicantKeyword(e.target.value)}
                  />
                </SearchBox>
              </td>
              <td>
                <Select
                  menuPortalTarget={document.body}
                  width="100%"
                  options={statusOption}
                  placeholder={t('Project.State')}
                  onChange={(value: any) => {
                    setSelectStatus(value?.value as ApplicationStatus);
                    setPage(1);
                  }}
                />
              </td>
              <td>
                {getConfig().REACT_APP_ENV !== 'prod' && getConfig().REACT_APP_ENV !== 'preview' && (
                  <PlainButton onClick={handleExport}>{t('Assets.Export')}</PlainButton>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </FilterLine>

      <TableBox>
        {list.length ? (
          <>
            <Table responsive>
              <Colgroups />
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
                  <th className="center">{t('application.State')}</th>
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

const ExportButton = styled(MoreButton)`
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-family: 'Poppins-SemiBold';
  text-align: center;
`;
