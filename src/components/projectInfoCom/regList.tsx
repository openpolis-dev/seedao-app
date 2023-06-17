import styled from 'styled-components';
import React from 'react';
import useTranslation from 'hooks/useTranslation';
import { ExcelObj } from 'type/project.type';

const Box = styled.div``;

interface Iprops {
  uploadList: ExcelObj[];
}
export default function RegList(props: Iprops) {
  const { t } = useTranslation();
  const { uploadList } = props;

  return (
    <Box>
      <table className="table" cellPadding="0" cellSpacing="0">
        <tr>
          <th>{t('Project.Address')}</th>
          <th>{t('Project.AddPoints')}</th>
          <th>{t('Project.AddToken')}</th>
          <th>{t('Project.Content')}</th>
          <th>{t('Project.Note')}</th>
        </tr>
        {uploadList.map((item, index) => (
          <tr key={index}>
            <td>{item.address}</td>
            <td>{item.points}</td>
            <td>{item.token}</td>
            <td>{item.content}</td>
            <td>{item.note}</td>
          </tr>
        ))}
      </table>
    </Box>
  );
}
