import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-right: 20px;
  }
`;
const ItemBox = styled.div`
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
  }
  .title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  ul {
    margin-top: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    input {
      margin-right: 10px;
      min-width: 650px;
    }
    span {
      margin-left: 10px;
    }
  }
`;
interface obj {
  address: string;
}
interface Iprops {
  closeShow: () => void;
  handleConfirm: (data: string[]) => void;
}
export default function IssuedModal(props: Iprops) {
  const { closeShow, handleConfirm } = props;

  const [adminList, setAdminList] = useState<obj[]>([
    {
      address: '0x183F09C3cE99C02118c570e03808476b22d63191',
    },
  ]);
  const [memberList, setMemberList] = useState<obj[]>([
    {
      address: '0x183F09C3cE99C02118c570e03808476b22d63191',
    },
  ]);

  const handleInput = (e: ChangeEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    let arr: obj[] = [];
    if (type === 'member') {
      arr = [...memberList];
      arr[index].address = value;
      setMemberList(arr);
    } else {
      arr = [...adminList];
      arr[index].address = value;
      setAdminList(arr);
    }
  };

  const handleAddMember = () => {
    const arr = [...memberList];
    arr.push({
      address: '',
    });
    setMemberList(arr);
  };
  const handleAddAdmin = () => {
    const arr = [...adminList];
    arr.push({
      address: '',
    });
    setAdminList(arr);
  };
  const removeMember = (index: number) => {
    const arr = [...memberList];
    arr.splice(index, 1);
    setMemberList(arr);
  };
  const removeAdmin = (index: number) => {
    const arr = [...adminList];
    arr.splice(index, 1);
    setAdminList(arr);
  };

  return (
    <Mask>
      <Card>
        <CardHeader>发放完成</CardHeader>
        <CardBody>
          <ItemBox>
            <div className="title">请填入发放记录的交易ID</div>
            <ul>
              {memberList.map((item, index) => (
                <li key={`member_${index}`}>
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      placeholder="Size small"
                      value={item.address}
                      onChange={(e) => handleInput(e, index, 'member')}
                    />
                  </InputGroup>
                  <span onClick={() => handleAddMember()}>
                    <EvaIcon name="plus-outline" status="Primary" />
                  </span>
                  {!(!index && index === memberList.length - 1) && (
                    <span onClick={() => removeMember(index)}>
                      <EvaIcon name="minus-outline" status="Primary" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </ItemBox>
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btn" onClick={() => closeShow()}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确定</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
