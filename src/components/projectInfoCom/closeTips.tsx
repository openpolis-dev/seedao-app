import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import React from 'react';

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

interface Iprops {
  closeModal: () => void;
}

export default function CloseTips(props: Iprops) {
  const { closeModal } = props;

  return (
    <Mask>
      <Card>
        <CardHeader>关闭项目</CardHeader>
        <CardBody>已申请关闭项目，审核通过后项目将被关闭</CardBody>
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
