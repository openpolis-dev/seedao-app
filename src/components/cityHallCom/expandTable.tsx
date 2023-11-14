import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { IApplicationDisplay } from 'type/application.type';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import BackIconSVG from 'components/svgs/back';
import ApplicationStatusTag from 'components/common/applicationStatusTag';
import { Button } from 'react-bootstrap';
import requests from 'requests';
import useToast, { ToastType } from 'hooks/useToast';
import { ContainerPadding } from 'assets/styles/global';
import { ApplicationStatus } from 'type/application.type';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';

interface IProps {
  bund_id: number;
  list: IApplicationDisplay[];
  handleClose: () => void;
  updateStatus: (status: ApplicationStatus) => void;
  showLoading: (show: boolean) => void;
  status?: ApplicationStatus;
}

export default function ExpandTable({ bund_id, list, handleClose, updateStatus, showLoading, status }: IProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const { getMultiSNS } = useQuerySNS();

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 6);
  };

  const handleSNS = async (wallets: string[]) => {
    try {
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
    } catch (error) {
      console.error('get sns failed', error);
    }
  };

  useEffect(() => {
    const _wallets = new Set<string>();
    list.forEach((r) => {
      _wallets.add(r.submitter_wallet?.toLocaleLowerCase());
      _wallets.add(r.reviewer_wallet?.toLocaleLowerCase());
      r.target_user_wallet && _wallets.add(r.target_user_wallet?.toLocaleLowerCase());
    });
    handleSNS(Array.from(_wallets));
  }, [list]);

  const handleApprove = async () => {
    showLoading(true);
    try {
      await requests.application.approveBundles([bund_id]);
      updateStatus(ApplicationStatus.Approved);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
    } catch (error) {
      console.error('handle approve failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      showLoading(false);
    }
  };

  const handleReject = async () => {
    showLoading(true);
    try {
      await requests.application.rejectBundles([bund_id]);
      updateStatus(ApplicationStatus.Rejected);
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
    } catch (error) {
      console.error('handle reject failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      showLoading(false);
    }
  };

  return (
    <TableBox>
      <BackBox onClick={handleClose}>
        <BackIcon>
          <BackIconSVG />
        </BackIcon>
        <span>{t('general.back')}</span>
      </BackBox>
      {list.length ? (
        <ContentBox>
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>{t('application.Receiver')}</th>
                <th className="center">{t('application.AddAssets')}</th>
                <th className="center">{t('application.Season')}</th>
                <th>{t('application.Content')}</th>
                <th className="center">{t('application.BudgetSource')}</th>
                <th className="center">{t('application.Operator')}</th>
                <th>{t('application.State')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.application_id}>
                  <td>{formatSNS(item.target_user_wallet?.toLocaleLowerCase())}</td>
                  <td className="center">{item.asset_display}</td>
                  <td className="center">{item.season_name}</td>
                  <td>
                    <BudgetContent>{item.detailed_type}</BudgetContent>
                  </td>
                  <td className="center">{item.budget_source}</td>
                  <td className="center">{formatSNS(item.submitter_wallet?.toLocaleLowerCase())}</td>
                  <td>
                    <ApplicationStatusTag status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <OperateBox>
            <Button
              onClick={handleApprove}
              disabled={status !== ApplicationStatus.Open && status !== ApplicationStatus.Rejected}
            >
              {t('city-hall.Pass')}
            </Button>
            <Button variant="outline-primary" onClick={handleReject} disabled={status !== ApplicationStatus.Open}>
              {t('city-hall.Reject')}
            </Button>
          </OperateBox>
        </ContentBox>
      ) : (
        <NoItem />
      )}
    </TableBox>
  );
}

const TableBox = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  ${ContainerPadding};
`;

const BackBox = styled.div`
  margin-bottom: 40px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-svg-color);
`;

const BackIcon = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: var(--bs-box-background);
  border-radius: 8px;
  text-align: center;
  svg {
    margin-top: 8px;
  }
`;

const ContentBox = styled.div`
  height: calc(100% - 80px);
  overflow-y: auto;
`;

const OperateBox = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 32px;
  margin-bottom: 20px;
  button {
    height: 40px;
    min-width: 120px;
    &.btn-outline-primary {
      background-color: transparent;
      color: #ff7193;
      border-color: #ff7193;
      &:hover,
      &:active {
        color: #ff7193 !important;
        border-color: #ff7193 !important;
        background-color: transparent !important;
      }
      &.disabled {
        background-color: #b0b0b0;
        color: #0d0c0f;
      }
    }
  }
`;
const BudgetContent = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
