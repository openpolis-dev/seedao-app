import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import Select from 'components/common/select';
import { Form } from 'react-bootstrap';
import { useState, FormEvent, useEffect, useMemo } from 'react';
import DeleteIcon from 'assets/Imgs/delete.svg';
import AddIcon from 'assets/Imgs/dark/add.svg';
import { AssetName } from 'utils/constant';
import VaultSVGIcon from 'components/svgs/vault';
import { PrimaryOutlinedButton } from 'components/common/button';

interface IProps {
  updateList: (data: IExcelObj[]) => void;
}

const CustomTable = ({ updateList }: IProps) => {
  const { t } = useTranslation();
  const [list, setList] = useState<IExcelObj[]>([
    {
      address: '',
      amount: '',
      assetType: '',
      content: '',
      note: '',
    },
  ]);

  const handleInput = (e: FormEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    const _list = [...list];
    switch (type) {
      case 'amount':
        _list[index].amount = value;
        break;
      case 'address':
        _list[index].address = value;
        break;
      case 'content':
        _list[index].content = value;
        break;
      case 'note':
        _list[index].note = value;
        break;
    }
    setList(_list);
  };

  const handleSelect = (v: string, index: number) => {
    const _list = [...list];
    _list[index].assetType = v;
    setList(_list);
  };

  const addOne = () => {
    setList([
      ...list,
      {
        address: '',
        amount: '',
        assetType: '',
        content: '',
        note: '',
      },
    ]);
  };

  const deleteOne = (index: number) => {
    list.splice(index, 1);
    setList([...list]);
  };

  useEffect(() => {
    updateList(list);
  }, [list]);

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
    <Box>
      <table className="table" cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <th>{t('application.AddressName')}</th>
            <th style={{ width: '120px' }}>{t('application.AssetType')}</th>
            <th style={{ width: '140px' }}>{t('application.AssetAmount')}</th>
            <th>{t('application.Content')}</th>
            <th>{t('application.RegisterNote')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              <td style={{ width: '380px' }}>
                <Form.Control
                  style={{ width: '368px' }}
                  value={item.address}
                  onChange={(e) => handleInput(e, index, 'address')}
                  placeholder={t('application.RegisterAddressHint')}
                />
              </td>
              <td style={{ width: '120px' }}>
                <AssetSelect
                  width="80px"
                  options={[
                    { value: AssetName.Credit, label: AssetName.Credit },
                    { value: AssetName.Token, label: AssetName.Token },
                  ]}
                  placeholder=""
                  NotClear={true}
                  onChange={(value: any) => handleSelect(value?.value, index)}
                />
              </td>
              <td style={{ width: '140px' }}>
                <Form.Control
                  style={{ width: '120px' }}
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleInput(e, index, 'amount')}
                />
              </td>
              <td>
                <Form.Control value={item.content} onChange={(e) => handleInput(e, index, 'content')} />
              </td>
              <td>
                <Form.Control value={item.note} onChange={(e) => handleInput(e, index, 'note')} />
              </td>
              <td>
                <DeleteImg src={DeleteIcon} alt="" onClick={() => deleteOne(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddBox>
        <AddButton onClick={addOne}>
          <img src={AddIcon} alt="" /> {t('Assets.RegisterAdd')}
        </AddButton>
      </AddBox>
      <TotalAsset>
        <LeftAssets>
          <VaultSVGIcon />
          <span>{t('Assets.Total')}</span>
          <span className="value">
            {totalAssets[0]} {AssetName.Token}
          </span>
          <span className="value">
            {totalAssets[1]} {AssetName.Credit}
          </span>
        </LeftAssets>
      </TotalAsset>
    </Box>
  );
};

export default CustomTable;

const Box = styled.div`
  background: transparent;
  .table > :not(caption) > * > * {
    background: none;
    padding: 0;
  }
  .table {
    border-bottom: 1px solid var(--bs-border-color_opacity);
    td,
    th {
      vertical-align: middle;
      border: 0;
    }
    td {
      padding: 0 20px;
    }
    tbody {
      tr {
        border: 0;
      }
    }
    th {
      padding-inline: 20px;
      background: var(--table-header);
      height: 70px;
      &:first-child {
        width: 400px;
      }
      &:last-child {
        width: 80px;
      }
      &:nth-child(3) {
        width: 150px;
      }
    }

    input {
      border: 1px solid var(--bs-border-color);
      background: var(--bs-box--background);
      padding: 10px 14px;
      border-radius: 8px;
      width: 100%;
    }
  }
`;

const DeleteImg = styled.img`
  cursor: pointer;
  position: relative;
  top: 4px;
`;

const AddBox = styled.div`
  text-align: center;
`;

export const AddButton = styled(PrimaryOutlinedButton)<{ long?: boolean }>`
  height: 36px;
  img {
    margin-right: 8px;
  }
`;

const AssetSelect = styled(Select)`
  width: 100px;
`;

const TotalAsset = styled.div`
  padding-inline: 32px;
`;

const LeftAssets = styled.div`
  line-height: 36px;
  color: var(--bs-body-color_active);
  gap: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  svg {
    margin-right: -2px;
  }
`;
