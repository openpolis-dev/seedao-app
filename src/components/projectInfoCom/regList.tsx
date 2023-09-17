import styled, { css } from 'styled-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExcelObj } from 'type/project.type';
// import { EvaIcon } from '@paljs/ui/Icon';
import { ExclamationDiamond } from 'react-bootstrap-icons';

const Box = styled.div``;

const TipsBox = styled.div`
  padding: 80px;
  background: rgba(161, 100, 255, 0.08);
  margin-top: 10px;
  text-align: center;
  color: var(--bs-primary);
  .iconTop {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

interface Iprops {
  uploadList: ExcelObj[];
}
export default function RegList(props: Iprops) {
  const { t } = useTranslation();
  const { uploadList } = props;

  return (
    <Box>
      <table className="table" cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>{t('Project.Address')}</th>
            <th>{t('Project.AddPoints')}</th>
            <th>{t('Project.AddToken')}</th>
            <th>{t('Project.Content')}</th>
            <th>{t('Project.Note')}</th>
          </tr>
        </thead>
        <tbody>
          {uploadList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.address}</td>
              <td>{item.points}</td>
              <td>{item.token}</td>
              <td>{item.content}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!uploadList?.length && (
        <TipsBox>
          {/*<div>/!*<EvaIcon name="alert-triangle-outline" status="Primary" className="iconTop" />*!/</div>*/}
          <div className="iconTop">
            <ExclamationDiamond />
          </div>
          <div>{t('Project.Tips')}</div>
        </TipsBox>
      )}
    </Box>
  );
}
