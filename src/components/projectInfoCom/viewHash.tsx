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
  closeShow: () => void;
}

export default function ViewHash(props: Iprops) {
  const [show, setShow] = useState(false);
  const { closeShow } = props;

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
            {[...Array(8)].map((item, index) => (
              <li key={index}>
                <span>0x183F09C3cE99C02118c570e03808476b22d63191</span>
                <EvaIcon name="clipboard-outline" />
              </li>
            ))}
          </UlBox>
        </CardBody>
      </Card>
    </Mask>
  );
}
