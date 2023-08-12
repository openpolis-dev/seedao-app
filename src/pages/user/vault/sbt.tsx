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
    <Box>
      <div className="title">SBT</div>
      <SBTCardBox>
        <SBTList>
          {[...Array(5)].map((item, index) => (
            <li key={index}>
              {/*<img*/}
              {/*  src="https://seedao-os-superapp.s3.ap-northeast-2.amazonaws.com/user_avatars/0x183f09c3ce99c02118c570e03808476b22d63191.jpg"*/}
              {/*  alt=""*/}
              {/*/>*/}
            </li>
          ))}
        </SBTList>
      </SBTCardBox>
    </Box>
  );
}

const Box = styled.div`
  .title {
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    text-align: center;
    display: inline-block;
  }
`;

const SBTCardBox = styled.div`
  //border-radius: 20px;
  //box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.18);
  //height: 160px;
  //background: #f00;
`;

const SBTList = styled.ul`
  //width: calc(100% - 150px);
  width: 100%;
  float: right;
  //overflow-x: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin: 20px 0 40px;

  li {
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: #d9d9d9;
    img {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      margin-top: 4px;
      margin-left: 4px;
    }
  }
`;
