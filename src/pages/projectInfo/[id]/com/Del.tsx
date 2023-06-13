import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import React, { useEffect } from 'react';
import { Button } from '@paljs/ui/Button';

const Mask = styled.div`
    background: rgba(0,0,0,0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn{
    margin-right: 20px;

  }
  dl,dt,dd{
    padding: 0;
    margin: 0;
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    margin-right: 20px;
  }
`;

interface Iprops {
  closeRemove: Function;
  selectArr: number[];
}
export default function Del(props: Iprops) {
  const { closeRemove, selectArr } = props;

  useEffect(() => {
    console.log(selectArr);
  }, [selectArr]);

  return (
    <Mask>
      <Card>
        <CardHeader>移除成员</CardHeader>
        <CardBody>
          <div className="tips">确定要移除以下成员？</div>
          {[...Array(3)].map((item, index) => (
            <ItemBox key={index}>
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <div>昵称</div>
                <div>0x183F09C3cE99C02118c570e03808476b22d63191</div>
              </div>
            </ItemBox>
          ))}
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btn" onClick={() => closeRemove()}>
            取消
          </Button>
          <Button>确定</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
