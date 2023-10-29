import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import Select from 'components/common/select';
import { Button, Form } from 'react-bootstrap';
import { useState, FormEvent, useEffect } from 'react';
import DeleteIcon from 'assets/Imgs/delete.svg';

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

  console.log(list);
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
            <th>SNS/钱包地址</th>
            <th>资产类型</th>
            <th>资产数量</th>
            <th>{t('Project.Content')}</th>
            <th>{t('Project.Note')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              <td>
                <Form.Control value={item.address} onChange={(e) => handleInput(e, index, 'address')} />
              </td>
              <td>
                <AssetSelect
                  options={[
                    { value: 'scr', label: 'SCR' },
                    { value: 'eth', label: 'ETH' },
                  ]}
                  placeholder=""
                  onChange={(value: any) => handleSelect(value?.value, index)}
                />
              </td>
              <td>
                <Form.Control value={item.amount} onChange={(e) => handleInput(e, index, 'amount')} />
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
        <AddButton onClick={addOne}>{t('Assets.RegisterAdd')}</AddButton>
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

const AssetSelect = styled(Select)`
  width: 94px;
  min-width: unset;
`;

export const AddButton = styled.button<{ long?: boolean }>`
  width: ${(props) => (props.long ? '137px' : 'unset')};
  height: 34px;
  background: #b0b0b0;
  border-radius: 8px;
  color: #0d0c0f;
  padding-inline: 10px;
`;
