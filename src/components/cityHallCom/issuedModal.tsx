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

interface Iprops {
  closeShow: () => void;
  handleConfirm: (data: string[]) => void;
}
export default function IssuedModal(props: Iprops) {
  const { closeShow, handleConfirm } = props;

  const [memberList, setMemberList] = useState<string[]>(['']);

  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: string[] = [];
    arr = [...memberList];
    arr[index] = value;
    setMemberList(arr);
  };

  const handleAddMember = () => {
    setMemberList([...memberList, '']);
  };

  const removeMember = (index: number) => {
    const arr = [...memberList];
    arr.splice(index, 1);
    setMemberList(arr);
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
                    <input type="text" placeholder="Size small" value={item} onChange={(e) => handleInput(e, index)} />
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
          <Button onClick={() => handleConfirm(memberList)}>确定</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
