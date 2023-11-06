import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';

interface IProps {
  list: IExcelObj[];
}

export default function ExcelTable({ list }: IProps) {
  const { t } = useTranslation();

  return (
    <>
      <table className="table" cellPadding="0" cellSpacing="0">
        <tr>
          <th>&nbsp;</th>
          <th>{t('application.AddressName')}</th>
          <th>{t('application.AssetType')}</th>
          <th>{t('application.AssetAmount')}</th>
          <th>{t('application.Content')}</th>
          <th>{t('application.RegisterNote')}</th>
        </tr>
        {list.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.address}</td>
            <td>{item.assetType}</td>
            <td>{item.amount}</td>
            <td>{item.content}</td>
            <td>{item.note}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
