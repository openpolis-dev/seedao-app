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
import ApplicationStatusTag from 'components/common/applicationStatusTag';
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

  const getRecords = async () => {
    showLoading(true);
    try {
      const queryData: IQueryApplicationsParams = {};
      const res = await requests.application.getCloseProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
          sort_order: 'desc',
        },
        queryData,
      );
      setTotal(res.data.total);
      const _wallets = new Set<string>();

      res.data.rows.forEach((r) => {
        _wallets.add(r.submitter_wallet?.toLocaleLowerCase());
        _wallets.add(r.reviewer_wallet?.toLocaleLowerCase());
      });
      const sns_map = await getMultiSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item) => ({
        ...item,
        created_date: formatTime(item.created_at),
        submitter_name: sns_map.get(item.submitter_wallet?.toLocaleLowerCase()) as string,
        reviewer_name: sns_map.get(item.reviewer_wallet?.toLocaleLowerCase()) as string,
      }));
      setList(_list);
    } catch (error) {
      console.error('getCloseProjectApplications failed:', error);
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
      console.error('handle approve failed', error);
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
      console.error('handle reject failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      showLoading(false);
    }
  };

  return (
    <Box>
      {showApplication && (
        <CloseProjectModal application={showApplication} handleClose={() => setShowApplication(undefined)} />
      )}
      <BackerNav to="/city-hall/governance" title={t('city-hall.CloseProjectAudit')} />
      <section>
        <TableBox>
          {list.length ? (
            <>
              <table className="table" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>{t('application.Project')}</th>
                    <th>{t('application.CloseReason')}</th>
                    <th style={{ width: '180px' }}>{t('Project.State')}</th>
                    <th>{t('application.Applicant')}</th>
                    <th style={{ width: '180px' }}>{t('application.ApplyTime')}</th>
                    <th className="center">{t('application.Operation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={index}>
                      <td>{item.budget_source}</td>
                      <td>
                        <ContentCell>{item.detailed_type}</ContentCell>
                      </td>
                      <td style={{ width: '180px' }}>
                        <ApplicationStatusTag status={item.status} isProj={true} />
                      </td>
                      <td>{item.submitter_name}</td>
                      <td style={{ width: '180px' }}>{item.created_date}</td>
                      <td>
                        <OperationBox>
                          <Button variant="outline-primary" onClick={() => setShowApplication(item)}>
                            {t('city-hall.Detail')}
                          </Button>
                          <Button
                            onClick={() => handleApprove(item.application_id)}
                            disabled={item.status === ApplicationStatus.Completed}
                          >
                            {t('city-hall.Pass')}
                          </Button>
                          <PinkButton
                            onClick={() => handleReject(item.application_id)}
                            disabled={
                              item.status === ApplicationStatus.Completed || item.status === ApplicationStatus.Rejected
                            }
                          >
                            {t('city-hall.Reject')}
                          </PinkButton>
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
