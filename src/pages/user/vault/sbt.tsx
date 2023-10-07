import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../../providers/authProvider';

const getNftsByContract = (account: string, contract: string, chain: number) => {
  let base = '';
  switch (chain) {
    case 1:
      base = 'https://restapi.nftscan.com';
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

const NFT_ABI = [
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

type SBTtype = {
  name?: string;
  image?: string;
  tokenId?: number | string;
  href?: string;
};

export default function SBTCard() {
  const { t } = useTranslation();
  // const { account } = useWeb3React();
  const {
    state: { account },
  } = useAuthContext();
  const [polygonProvider, setPolygonProvider] = useState<any>(null);

  const [govSBTs, setGovSBTs] = useState<SBTtype[]>([]);
  const [newSBTs, setNewSBTs] = useState<SBTtype[]>([]);
  const [mscSBT, setMscSBT] = useState<SBTtype>();
  const [onBoardingSBT, setOnBoardingSBT] = useState<SBTtype>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const _polygon_provider = new ethers.providers.StaticJsonRpcProvider('https://poly-rpc.gateway.pokt.network');
    setPolygonProvider(_polygon_provider);
  }, []);

  useEffect(() => {
    // msc
    const getOnBoarding = async () => {
      // SBT: onboarding
      const address = '0x0D9ea891B4C30e17437D00151399990ED7965F00';
      const token = 157;
      const tokenHex = '000000000000000000000000000000000000000000000000000000000000009d';
      try {
        const contract = new ethers.Contract(address, NFT_ABI, polygonProvider);
        const balance = await contract.balanceOf(account, token);
        console.log('onboarding balance: ', balance);
        const _balance_num = balance.toNumber();
        if (_balance_num > 0) {
          const uri = await contract.uri(token); // uri: https://deschool.s3.amazonaws.com/nft/proofs/{id}.json
          const tokenUri = uri.replace('{id}', tokenHex);
          fetch(tokenUri)
            .then((res) => res.json())
            .then((res) => {
              setOnBoardingSBT({
                name: res.name,
                tokenId: token,
                image: res.image,
                href: `https://polygonscan.com/token/${address}?a=${token}`,
              });
            })
            .catch((err) => {
              setOnBoardingSBT({
                name: '',
                tokenId: token,
                href: `https://polygonscan.com/token/${address}?a=${token}`,
              });
            });
        }
      } catch (error) {
        console.error('[SBT] onboarding balance failed', error);
      }
    };
    const getMSC = async () => {
      // SBT: MSC
      const address = '0x2C436d61C5Af62bcbfeE40B1f0BE5B483DfA0E11';
      const token = 155;
      try {
        const contract = new ethers.Contract(address, NFT_ABI, polygonProvider);
        const balance = await contract.balanceOf(account, token);
        console.log('MSC balance: ', balance);
        const _balance = balance.toNumber();
        if (_balance > 0) {
          // NOTE: use hardcode uri temporarily, cause the token uri is not available
          setMscSBT({
            name: '',
            tokenId: token,
            image:
              'https://i.seadn.io/gae/KX5YGBwjs16hUMa-fPm7PctWEc3kMkCNz7unhTsLigsKKc7o-Pa-DkRAWgLx8GQw32jiNq12R8Xlx9iePIJl2YNdLGJrPQCrkXbi?w=500&auto=format',
            href: `https://polygonscan.com/token/${address}?a=${token}`,
          });
        }
      } catch (error) {
        console.error('[SBT] MSC balance failed', error);
      }
    };
    if (polygonProvider && account) {
      getOnBoarding();
      getMSC();
    }
  }, [polygonProvider, account]);

  useEffect(() => {
    const getSBTs = async (account: string) => {
      setLoading(true);
      // Governance Node
      const g_address = '0x9d34D407D8586478b3e4c39BE633ED3D7be1c80c';
      getNftsByContract(account, g_address, 1)
        .then((res) => {
          console.log('res', res);
          setLoading(false);
          setGovSBTs(
            res.data.data.content.map((item: any) => ({
              name: item.name,
              image: item.image_uri,
              tokenId: item.token_id,
              href: `https://etherscan.io/token/${g_address}?a=${item.token_id}`,
            })),
          );
        })
        .catch((err) => {
          console.error('[SBT] gov failed', err);
        });
      // new SBT
      const n_address = '0x2221F5d189c611B09D7f7382Ce557ec66365C8fc';
      getNftsByContract(account, n_address, 137)
        .then((res) => {
          setLoading(false);
          console.log('res', res);
          setNewSBTs(
            res.data.data.content
              .filter((c: any) => !!c.image_uri)
              .map((item: any) => ({
                name: item.name,
                image: item.image_uri,
                tokenId: item.token_id,
                href: `https://polygonscan.com/token/${n_address}?a=${item.token_id}`,
              })),
          );
        })
        .catch((err) => {
          console.error('[SBT] new failed', err);
        });
    };
    if (account && process.env.NODE_ENV !== 'development') getSBTs(account);
  }, [account]);

  const sbtList = useMemo(() => {
    const lst = [...govSBTs, ...newSBTs];
    if (mscSBT) lst.push(mscSBT);
    if (onBoardingSBT) lst.push(onBoardingSBT);
    return lst;
  }, [govSBTs, newSBTs, mscSBT, onBoardingSBT]);

  return (
    <Box>
      <div className="title">SBT</div>
      {loading ? (
        <LoadingStyled>
          <img src="/images/loader.svg" alt="" className="icon" width="20px" height="20px" />
        </LoadingStyled>
      ) : (
        <SBTCardBox>
          {sbtList.length === 0 ? (
            <SBTList>
              <div className="empty">{t('My.EmptySBT')}</div>
            </SBTList>
          ) : (
            <SBTList>
              {sbtList.map((item, index) => (
                <li
                  className="sbt"
                  key={index}
                  onClick={() => {
                    console.log('>> ', item);
                    if (item.href) {
                      window.open(item.href, '_blank');
                    }
                  }}
                >
                  {item.image ? <img src={item.image} alt={item.name} /> : <div>{`SBT ${item.tokenId}`}</div>}
                </li>
              ))}
            </SBTList>
          )}
        </SBTCardBox>
      )}
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
  height: 96px;

  li {
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: #d9d9d9;
    img {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      margin-top: 6px;
      margin-left: 6px;
    }
    div {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background-color: #c6c6c6;
      margin-top: 6px;
      margin-left: 6px;
      text-align: center;
      line-height: 84px;
      color: #fff;
    }
    &.sbt {
      cursor: pointer;
    }
  }
  .empty {
    color: #929191;
  }
`;

const LoadingStyled = styled.div`
  height: 96px;
  margin: 20px 0 40px;
  padding-top: 40px;
  .icon {
    animation: spin 2.5s linear infinite;
    margin-top: 40px;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
