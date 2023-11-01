import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { IApplicationDisplay } from 'type/application.type';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import { formatNumber } from 'utils/number';
import BackIconSVG from 'components/svgs/back';

interface IProps {
  list: IApplicationDisplay[];
  handleClose: () => void;
}

export default function ExpandTable({ list, handleClose }: IProps) {
  const { t } = useTranslation();

  return (
    <TableBox>
      <BackBox onClick={handleClose}>
        <BackIcon>
          <BackIconSVG />
        </BackIcon>
        <span>{t('general.back')}</span>
      </BackBox>
      {list.length ? (
        <>
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
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
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.application_id}>
                  <td>{item.created_date}</td>
                  <td>
                    <div>
                      <span>{publicJs.AddressToShow(item.target_user_wallet)}</span>
                      {/* <CopyBox text={item.target_user_wallet}>
                        <EvaIcon name="clipboard-outline" />
                      </CopyBox> */}
                    </div>
                  </td>
                  <td>{formatNumber(item.credit_amount)}</td>
                  <td>{formatNumber(item.token_amount)}</td>
                  <td>{item.detailed_type}</td>
                  <td>{item.budget_source}</td>
                  <td>{item.comment}</td>
                  <td>{t(formatApplicationStatus(item.status))}</td>
                  <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
                  <td>{item.reviewer_name || publicJs.AddressToShow(item.reviewer_wallet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <NoItem />
      )}
    </TableBox>
  );
}

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
  position: absolute;
  left: 0;
  top: 0;
  min-height: 100%;
`;

const BackBox = styled.div`
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  color: var(--bs-primary);
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color);
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
