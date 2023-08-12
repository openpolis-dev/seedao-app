import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';

const getNftsByContract = (account: string, contract: string, chain: number) => {
  let base = '';
  switch (chain) {
    case 1:
      base = 'https://api.nftscan.com';
      break;
    case 137:
      base = 'https://polygonapi.nftscan.com';
      break;
  }
  return axios.get(
    `${base}/api/v2/account/own/${account}?erc_type=erc1155&show_attribute=false&sort_field=&sort_direction=&contract_address=${contract}`,
    {
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_NFTSCAN_KEY,
      },
    },
  );
};

type SBTtype = {
  name: string;
  image: string;
};

export default function SBTCard() {
  const { account } = useWeb3React();
  const [polygonProvider, setPolygonProvider] = useState<any>(null);

  const [govSBTs, setGovSBTs] = useState<SBTtype[]>([]);
  const [newSBTs, setNewSBTs] = useState<SBTtype[]>([]);

  useEffect(() => {
    const _polygon_provider = new ethers.providers.StaticJsonRpcProvider('https://poly-rpc.gateway.pokt.network');
    setPolygonProvider(_polygon_provider);
  }, []);

  useEffect(() => {
    // TODO
    // msc
    const getMSC = async () => {
      const contract = new ethers.Contract(
        '0x2C436d61C5Af62bcbfeE40B1f0BE5B483DfA0E11',
        [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        polygonProvider,
      );
    };
    // getMSC();
  }, [polygonProvider]);

  useEffect(() => {
    const getSBTs = async (account: string) => {
      // Governance Node
      getNftsByContract(account, '0x9d34D407D8586478b3e4c39BE633ED3D7be1c80c', 1)
        .then((res) => {
          setGovSBTs(res.data.content.map((item: any) => ({ name: item.name, image: item.image_uri })));
        })
        .catch((err) => {
          console.error('[SBT] gov failed', err);
        });
      // new SBT
      getNftsByContract(account, '0x2C436d61C5Af62bcbfeE40B1f0BE5B483DfA0E11', 137)
        .then((res) => {
          setNewSBTs(
            res.data.content
              .filter((c: any) => !!c.image_uri)
              .map((item: any) => ({ name: item.name, image: item.image_uri })),
          );
        })
        .catch((err) => {
          console.error('[SBT] new failed', err);
        });
    };
    // account && getSBTs(account);
  }, [account]);

  return (
    <Box>
      <div className="title">SBT</div>
      <SBTCardBox>
        <SBTList>
          {[...govSBTs, ...newSBTs].map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.name} />
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
