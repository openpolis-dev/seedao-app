import styled from 'styled-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import { AssetName } from 'utils/constant';

interface IProps {
  list: IExcelObj[];
}

export default function ExcelTable({ list }: IProps) {
  const { t } = useTranslation();

  const totalAssets = useMemo(() => {
    let usdt_count = 0;
    let scr_count = 0;
    list.forEach((item) => {
      if (item.assetType === AssetName.Credit) scr_count += Number(item.amount) || 0;
      if (item.assetType === AssetName.Token) usdt_count += Number(item.amount) || 0;
    });
    return [usdt_count, scr_count];
  }, [list]);

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
      <TotalAsset>
        <LeftAssets>
          <span>{t('Assets.Total')}</span>
          <span className="value">{totalAssets[0]}</span>
          <span>{AssetName.Token}</span>
          <span className="value">{totalAssets[1]}</span>
          <span>{AssetName.Credit}</span>
        </LeftAssets>
      </TotalAsset>
    </>
  );
}

const TotalAsset = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--table-header);
  padding: 19px 32px;
`;

const LeftAssets = styled.div`
  line-height: 36px;
  color: var(--bs-body-color_active);
  display: flex;
  gap: 8px;
  .value {
    font-size: 20px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
  }
`;
