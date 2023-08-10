import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

export default function SBTCard() {
  const [ethereumProvider, setEthereumProvider] = useState<any>(null);
  const [polygonProvider, setPolygonProvider] = useState<any>(null);

  useEffect(() => {
    const _ethereum_provider = new ethers.providers.StaticJsonRpcProvider(
      'https://eth-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE',
    );
    setEthereumProvider(_ethereum_provider);
    const _polygon_provider = new ethers.providers.StaticJsonRpcProvider('https://poly-rpc.gateway.pokt.network');
    setPolygonProvider(_polygon_provider);
  }, []);

  useEffect(() => {
    // TODO
  }, [ethereumProvider]);
  useEffect(() => {
    // TODO
  }, [polygonProvider]);

  return (
    <SBTCardBox>
      <div className="title">SBT</div>
      <SBTList>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </SBTList>
    </SBTCardBox>
  );
}

const SBTCardBox = styled.div`
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.18);
  height: 160px;
  .title {
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    width: 150px;
    text-align: center;
    display: inline-block;
    line-height: 160px;
  }
`;

const SBTList = styled.ul`
  width: calc(100% - 150px);
  float: right;
  overflow-x: auto;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 32px;
  li {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: #d9d9d9;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-top: 8px;
      margin-left: 8px;
    }
  }
`;
