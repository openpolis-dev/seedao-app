import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import Select from 'components/common/select';
import { Button, Form } from 'react-bootstrap';
import { useState, FormEvent, useEffect } from 'react';

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
            <th>&nbsp;</th>
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
              <td>{index + 1}</td>
              <td>
                <Form.Control value={item.address} onChange={(e) => handleInput(e, index, 'address')} />
              </td>
              <td>
                <Select
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
                <Button onClick={() => deleteOne(index)}>删除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Button onClick={addOne}>添加</Button>
      </div>
    </>
  );
};

export default CustomTable;
