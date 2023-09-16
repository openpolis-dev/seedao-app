import styled from 'styled-components';
import React from 'react';
import publicJs from 'utils/publicJs';
import CopyBox from 'components/copy';
import { X, Clipboard } from 'react-bootstrap-icons';

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

const CardBox = styled.div`
  background: #fff;
  border-radius: 0.25rem;
`;
const UlBox = styled.div`
  min-width: 500px;
  max-height: 300px;
  overflow-y: auto;
  padding: 20px;
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
const HeaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
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
      <CardBox>
        <HeaderBox>
          交易ID
          <div className="rht" onClick={() => closeShow()}>
            <X />
          </div>
        </HeaderBox>
        <div>
          <UlBox id="scrollTriggerId">
            {txs.map((item, index) => (
              <li key={index}>
                <span>{publicJs.AddressToShow(item, 8)}</span>
                <CopyBox text={item} dir="left">
                  <Clipboard />
                </CopyBox>
              </li>
            ))}
          </UlBox>
        </div>
      </CardBox>
    </Mask>
  );
}
