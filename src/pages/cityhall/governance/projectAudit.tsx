import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import { ApplicationStatus, IApplicationDisplay } from 'type/application.type';
import { formatTime } from 'utils/time';
import { IQueryApplicationsParams } from 'requests/applications';
import publicJs from 'utils/publicJs';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { PinkButton } from 'components/common/button';
import CloseProjectModal from 'components/modals/closeProjectModal';
import useQuerySNS from 'hooks/useQuerySNS';

const Box = styled.div`
  ${ContainerPadding};
  td {
    line-height: 54px;
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

export default function ProjectAudit() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [showApplication, setShowApplication] = useState<IApplicationDisplay>();
  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const { getMultiSNS } = useQuerySNS();

  const showLoading = (v: boolean) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: v });
  };

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getRecords = async () => {
    showLoading(true);
    try {
      const queryData: IQueryApplicationsParams = {};
      const res = await requests.application.getCloseProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'create_ts',
          sort_order: 'desc',
        },
        queryData,
      );
      setTotal(res.data.total);
      const _wallets = new Set<string>();

      res.data.rows.forEach((r) => {
        r.applicant_wallet && _wallets.add(r.applicant_wallet?.toLocaleLowerCase());
        _wallets.add(r.reviewer_wallet?.toLocaleLowerCase());
      });
      handleSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item) => ({
        ...item,
        created_date: formatTime(item.create_ts * 1000),
        review_date: formatTime(item.review_ts * 1000),
        submitter_name: item.applicant_wallet?.toLocaleLowerCase(),
        reviewer_name: item.reviewer_wallet?.toLocaleLowerCase(),
      }));
      setList(_list);
    } catch (error) {
      logError('getCloseProjectApplications failed:', error);
    } finally {
      showLoading(false);
    }
  };

  useEffect(() => {
    getRecords();
  }, [page, pageSize]);

  const handleApprove = async (id: number) => {
    showLoading(true);
    try {
      await requests.application.approveApplications([id]);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      getRecords();
    } catch (error) {
      logError('handle approve failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      showLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    showLoading(true);
    try {
      await requests.application.rejectApplications([id]);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      getRecords();
    } catch (error) {
      logError('handle reject failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      showLoading(false);
    }
  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  return (
    <Box>
      {showApplication && (
        <CloseProjectModal
          application={showApplication}
          handleClose={() => setShowApplication(undefined)}
          handleApprove={handleApprove}
          handleReject={handleReject}
          snsMap={snsMap}
        />
      )}
      <BackerNav to="/city-hall/governance" title={t('city-hall.CloseProjectAudit')} />
      <section>
        <TableBox>
          {list.length ? (
            <>
              <table className="table" cellPadding="0" cellSpacing="0">
                <colgroup>
                  {/* name */}
                  <col style={{ width: '200px' }} />
                  {/* reason */}
                  <col />
                  {/* state */}
                  <col style={{ width: '170px' }} />
                  {/* applicant */}
                  <col style={{ width: '180px' }} />
                  {/* time */}
                  <col style={{ width: '180px' }} />
                  {/* more */}
                  <col style={{ width: '130px' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>{t('application.Project')}</th>
                    <th>{t('application.CloseReason')}</th>
                    <th className="center">{t('application.State')}</th>
                    <th>{t('application.Applicant')}</th>
                    <th>{t('application.ApplyTime')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <ContentCell>{item.budget_source}</ContentCell>
                      </td>
                      <td>
                        <ContentCell>{item.detailed_type}</ContentCell>
                      </td>
                      <td className="center">
                        <ApplicationStatusTagNew status={item.status} isProj={true} />
                      </td>
                      <td>{formatSNS(item.submitter_name)}</td>
                      <td>{item.created_date}</td>
                      <td>
                        <OperationBox>
                          <MoreButton onClick={() => setShowApplication(item)}>{t('application.Detail')}</MoreButton>
                        </OperationBox>
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
      </section>
    </Box>
  );
}

const OperationBox = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 7px;
  button {
    width: 80px;
    min-width: unset;
  }
`;

const ContentCell = styled.div`
  max-width: 400px;
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
