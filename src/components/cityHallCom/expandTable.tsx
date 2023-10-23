import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import Page from 'components/pagination';
import { IApplicationDisplay } from 'type/application.type';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import { formatNumber } from 'utils/number';
import { ChevronLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function ExpandTable({ handleClose }: { handleClose: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);

  const getRecords = () => {
    // TODO get records
  };

  useEffect(() => {
    getRecords();
  }, [page, pageSize]);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  return (
    <TableBox>
      <BackBox onClick={handleClose}>
        <ChevronLeft className="back" />
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
  background-color: #fff;
  min-height: 100%;
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

const BackBox = styled.div`
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .back {
    margin-right: 10px;
  }
`;
