import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import Select from 'components/common/select';
import { Button, Form } from 'react-bootstrap';
import { useState, FormEvent, useEffect } from 'react';
import DeleteIcon from 'assets/Imgs/delete.svg';
import AddIcon from 'assets/Imgs/add.svg';
import { AssetName } from 'utils/constant';

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

  return (
    <>
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
      <div>
        <AddButton onClick={addOne}>
          <img src={AddIcon} alt="" />
          {t('Assets.RegisterAdd')}
        </AddButton>
      </div>
    </>
  );
};

export default CustomTable;

const DeleteImg = styled.img`
  cursor: pointer;
  position: relative;
  top: 4px;
`;

export const AddButton = styled.button<{ long?: boolean }>`
  height: 34px;
  background: #b0b0b0;
  border-radius: 8px;
  color: #0d0c0f;
  padding-inline: 10px;
  border: none;
  font-family: Poppins-SemiBold, Poppins;
  img {
    margin-right: 8px;
  }
`;

const AssetSelect = styled(Select)`
  width: 100px;
`;
