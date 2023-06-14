import styled from 'styled-components';
import AssetList from './assetList';
import React from 'react';

const Box = styled.div`
  padding: 40px 20px;
`;

const FirstLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  li {
    border: 1px solid #f1f1f1;
    margin-bottom: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 48%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      text-align: center;
    }
  }
  .num {
    font-size: 25px;
    padding-top: 10px;
    font-weight: bold;
  }
`;

export default function Assets() {
  return (
    <Box>
      <FirstLine>
        <li>
          <div className="line">
            <div>剩余USD预算</div>
            <div className="num">9999</div>
          </div>
          <div>
            <div>USD预算</div>
            <div className="num">9999</div>
          </div>
        </li>
        <li>
          <div>
            <div>剩余积分预算</div>
            <div className="num">9999</div>
          </div>
          <div>
            <div>积分预算</div>
            <div className="num">9999</div>
          </div>
        </li>
      </FirstLine>

      <AssetList />
    </Box>
  );
}
