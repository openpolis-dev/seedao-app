import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { useState } from 'react';

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
const UlBox = styled.div`
  min-width: 500px;
  max-height: 300px;
  overflow-y: auto;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 10px;
    margin-bottom: 10px;
  }
`;
const HeaderBox = styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .rht {
    cursor: pointer;
  }
`;
interface Iprops {
  txs: string[];
  closeShow: () => void;
}

export default function ViewHash(props: Iprops) {
  const { closeShow, txs } = props;

  return (
    <Mask>
      <Card>
        <HeaderBox>
          交易ID
          <div className="rht" onClick={() => closeShow()}>
            <EvaIcon name="close-outline" />
          </div>
        </HeaderBox>
        <CardBody>
          <UlBox id="scrollTriggerId">
            {txs.map((item, index) => (
              <li key={index}>
                <span>{item}</span>
                <EvaIcon name="clipboard-outline" />
              </li>
            ))}
          </UlBox>
        </CardBody>
      </Card>
    </Mask>
  );
}
