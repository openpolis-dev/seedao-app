import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { EvaIcon } from '@paljs/ui/Icon';

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
const Box = styled.div`
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
      min-width: 450px;
    }
    span {
      margin-left: 10px;
    }
  }
`;

interface Iprops {
  closeModal: () => void;
}
export default function PropsalModal(props: Iprops) {
  const { closeModal } = props;
  const [list, setList] = useState(['']);
  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: string[] = [];
    arr = [...list];
    arr[index] = value;
    setList(arr);
  };

  const handleAdd = () => {
    const arr = [...list];
    arr.push('');
    setList(arr);
  };

  const removeList = (index: number) => {
    const arr = [...list];
    arr.splice(index, 1);
    setList(arr);
  };

  return (
    <Mask>
      <Card>
        <CardHeader>关联提案</CardHeader>
        <CardBody>
          <Box>
            <ul>
              {list.map((item, index) => (
                <li key={index}>
                  <InputGroup fullWidth>
                    <input type="text" placeholder="Size small" value={item} onChange={(e) => handleInput(e, index)} />
                  </InputGroup>
                  <span onClick={() => handleAdd()}>
                    <EvaIcon name="plus-outline" status="Primary" />
                  </span>
                  {!(!index && index === list.length - 1) && (
                    <span onClick={() => removeList(index)}>
                      <EvaIcon name="minus-outline" status="Primary" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Box>
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btn" onClick={() => closeModal()}>
            取消
          </Button>
          <Button>确定</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
