import React, { useEffect, useMemo, useState } from 'react';
import Layout from 'Layouts';
import AssetList from 'components/assetsCom/assetList';
import styled, { css } from 'styled-components';
import { Card } from '@paljs/ui/Card';
import requests from 'requests';
import { EvaIcon } from '@paljs/ui';
import useTranslation from 'hooks/useTranslation';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';
import publicJs from 'utils/publicJs';
import axios from 'axios';
import CopyBox from 'components/copy';
import { ethers } from 'ethers';
import ModifyBudgetModal from 'components/assetsCom/modifyBudget';
import { BudgetType } from 'type/project.type';

const Box = styled.div`
  padding: 40px 20px;
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;

const FirstLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  li {
    width: 23%;
    height: 172px;
    border: 1px solid #f1f1f1;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    //background: #008800;
    background: #fff;
    color: #000;
    div {
      text-align: center;
    }
    @media screen and (max-width: 1000px) {
      width: 48%;
    }
  }
  .num {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 10px;
    color: #000;
  }
  .tips {
    font-size: 12px;
    color: #000;
  }
`;

const enum CHAINS {
  ETH = 1,
  Polygon = 137,
}

const SAFE_CHAIN = {
  [CHAINS.ETH]: {
    short: 'eth',
    name: 'Ethereum',
  },
  [CHAINS.Polygon]: {
    short: 'matic',
    name: 'Polygon',
  },
};

const VAULTS = [
  {
    name: 'Assets.CommunityVault',
    address: '0x7FdA3253c94F09fE6950710E5273165283f8b283',
    chainId: CHAINS.ETH,
    id: 1,
  },
  {
    name: 'Assets.CommunityVault',
    address: '0x4876eaD85CE358133fb80276EB3631D192196e24',
    chainId: CHAINS.Polygon,
    id: 2,
  },
  {
    name: 'Assets.CityHallVault',
    address: '0x70F97Ad9dd7E1bFf40c3374A497a7583B0fAdd25',
    chainId: CHAINS.ETH,
    id: 3,
  },
  {
    name: 'Assets.IncubatorVault',
    address: '0x444C1Cf57b65C011abA9BaBEd05C6b13C11b03b5',
    chainId: CHAINS.ETH,
    id: 4,
  },
];

const SCR_CONTRACT = '0xc74dee15a4700d5df797bdd3982ee649a3bb8c6c';
const SCR_PRICE = 0.03;

type VaultType = {
  name: string;
  address: string;
  chainId: CHAINS;
  id: number;
};

type VaultInfoMap = {
  [k: number]: { balance?: string; total?: number; threshold?: number };
};

export default function Index() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();
  const canUseCityhall = usePermission(PermissionAction.AssetsBudget, PermissionObject.SeeDAO);

  const [asset, setAsset] = useState({
    token_used_amount: 0,
    token_total_amount: 0,
    credit_used_amount: 0,
    credit_total_amount: 0,
  });
  const [showModifyModal, setshowModifyModal] = useState<BudgetType>();
  const [showVaultDetail, setShowVaultDetail] = useState(false);
  const [vaultsMap, setVaultsMap] = useState<VaultInfoMap>({});
  const [totalSigner, setTotalSigner] = useState(0);
  const [totalBalance, setTotalBalance] = useState('0.00');
  const [totalSCR, setTotalSCR] = useState('0');
  const [nftData, setNftData] = useState({
    floorPrice: 0,
    totalSupply: 0,
  });

  const getAssets = async () => {
    try {
      const res = await requests.treasury.getTreasury();
      setAsset({
        token_used_amount: Number(res.data.token_used_amount),
        token_total_amount: Number(res.data.token_total_amount),
        credit_used_amount: Number(res.data.credit_used_amount),
        credit_total_amount: Number(res.data.credit_total_amount),
      });
    } catch (error) {
      console.error('getTreasury error', error);
    }
  };
  useEffect(() => {
    getAssets();
  }, []);

  const handleModifyBudget = async (budget: number) => {
    if (!showModifyModal) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await requests.treasury.updateBudget(
        budget,
        showModifyModal,
        showModifyModal === BudgetType.Token ? 'USDT' : 'SCR',
      );
      getAssets();
      showToast('success', ToastType.Success);
      setshowModifyModal(undefined);
    } catch (error: any) {
      console.error('updateBudget error', error);
      showToast(error?.data?.msg || 'failed', ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const getFloorPrice = async () => {
    try {
      const url = 'https://restapi.nftscan.com/api/v2/statistics/collection/0x23fda8a873e9e46dbe51c78754dddccfbc41cfe1';
      const res = await axios.get(url, {
        headers: {
          'X-API-KEY': '3zrxnAwBgp72veeonB8KW2fa',
        },
      });
      setNftData({
        floorPrice: res.data?.data?.floor_price || 0,
        totalSupply: res.data?.data?.items_total || 0,
      });
    } catch (error) {
      console.error('getFloorPrice error', error);
    }
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      'https://eth-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE',
    );
    try {
      const contract = new ethers.Contract(
        SCR_CONTRACT,
        [
          {
            inputs: [],
            name: 'totalSupply',
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
        provider,
      );
      const supply = await contract.totalSupply();
      setTotalSCR(ethers.utils.formatEther(supply));
    } catch (error) {
      console.error('getSCR error', error);
    }
  };

  const getVaultBalance = async ({ chainId, address }: VaultType) => {
    return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}/balances/usd?trusted=true`);
  };
  const getVaultInfo = async ({ chainId, address }: VaultType) => {
    return axios.get(`https://safe-client.safe.global/v1/chains/${chainId}/safes/${address}`);
  };
  const getVaultsInfo = async () => {
    const vaults_map: VaultInfoMap = {};
    const users: string[] = [];
    let _total = 0;

    try {
      const reqs = VAULTS.map((item) => getVaultBalance(item));
      const results = await Promise.allSettled(reqs);
      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          const _v = Number(res.value.data?.fiatTotal || 0);
          vaults_map[VAULTS[index].id] = {
            balance: _v.toFixed(2),
          };
          _total += _v;
        }
      });
    } catch (error) {
      console.error('getVaultBalance error', error);
    }
    try {
      const reqs = VAULTS.map((item) => getVaultInfo(item));
      const results = await Promise.allSettled(reqs);
      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          const _id = VAULTS[index].id;
          if (!vaults_map[_id]) {
            vaults_map[_id] = {};
          }
          vaults_map[_id].total = res.value.data?.owners.length || 0;
          vaults_map[_id].threshold = res.value.data?.threshold || 0;
          users.push(...res.value.data?.owners.map((item: any) => item.value));
        }
      });
    } catch (error) {
      console.error('getVaultInfo error', error);
    }
    setTotalSigner([...new Set(users)].length);
    setTotalBalance(_total.toFixed(2));
    setVaultsMap(vaults_map);
  };

  const SCRValue = useMemo(() => {
    return Number(totalSCR) * SCR_PRICE;
  }, [totalSCR]);

  useEffect(() => {
    getSCR();
    getFloorPrice();
    getVaultsInfo();
  }, []);

  return (
    <Layout title="SeeDAO Assets">
      {Toast}
      {!!showModifyModal && (
        <ModifyBudgetModal handleClose={() => setshowModifyModal(undefined)} handleModify={handleModifyBudget} />
      )}
      <CardBox>
        <Box>
          <Vault>
            <VaultOverview>
              <div>
                <TotalBalance>{t('Assets.TotalBalance')}</TotalBalance>
                <TotalBalanceNum>${totalBalance}</TotalBalanceNum>
              </div>
              <div className="right">
                <InfoItem>
                  <span>{t('Assets.Wallet')}</span>
                  <span>4</span>
                </InfoItem>
                <InfoItem>
                  <span>{t('Assets.MultiSign')}</span>
                  <span>{totalSigner}</span>
                </InfoItem>
                <InfoItem>
                  <span>{t('Assets.Chain')}</span>
                  <span>2</span>
                </InfoItem>
                <InfoItem className="detail">
                  <div onClick={() => setShowVaultDetail(!showVaultDetail)}>
                    <span>{t('Assets.Detail')}</span>
                    <EvaIcon name={showVaultDetail ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} />
                  </div>
                </InfoItem>
              </div>
            </VaultOverview>
            {showVaultDetail && (
              <VaultInfo>
                {VAULTS.map((v) => (
                  <VaultItem key={v.address}>
                    <div className="left">
                      <span className="name">{t(v.name)}</span>
                      <div className="info">
                        <div className="address">
                          <span>{publicJs.AddressToShow(v.address)}</span>
                          <div>
                            <CopyBox text={v.address}>
                              <EvaIcon name="clipboard-outline" options={{ width: '18px', height: '18px' }} />
                            </CopyBox>
                          </div>
                          <div>
                            <a
                              href={`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <EvaIcon name="external-link-outline" options={{ width: '18px', height: '18px' }} />
                            </a>
                          </div>
                        </div>
                        <div className="tag">
                          <Tag>
                            {SAFE_CHAIN[v.chainId].name}
                            <span>
                              {vaultsMap[v.id]?.threshold || 0}/{vaultsMap[v.id]?.total || 0}
                            </span>
                          </Tag>
                        </div>
                      </div>
                    </div>
                    <div className="balance">${vaultsMap[v.id]?.balance || 0.0}</div>
                  </VaultItem>
                ))}
              </VaultInfo>
            )}
          </Vault>
          <FirstLine>
            <li className="center">
              <LiHead>
                <LiTitle>{t('Assets.SupplySCR')}</LiTitle>
                <div className="tips"></div>
              </LiHead>
              <div className="num">{totalSCR}</div>
              <div style={{ textAlign: 'left' }}>
                <p className="tips">≈{SCRValue.toFixed(2)}U</p>
                <p className="tips">1SCR ≈ {SCR_PRICE}U</p>
              </div>
            </li>
            <li className="center">
              <LiHead>
                <LiTitle>{t('Assets.SupplySGN')}</LiTitle>
                <div className="tips"></div>
              </LiHead>
              <div className="num">{nftData.totalSupply}</div>
              <div className="tips">
                {t('Assets.FloorPrice')}: <span>{nftData.floorPrice}ETH</span>
              </div>
            </li>
            <li>
              <LiHead>
                <LiTitle>{t('Assets.SeasonUseUSD')}</LiTitle>
              </LiHead>
              <div className="num">{asset.token_used_amount}</div>
              <AssetBox className="tips">
                <span>{t('Assets.SeasonBudget')}:</span>
                <span>{asset.token_total_amount}</span>
                {canUseCityhall && (
                  <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Token)}>
                    <EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />
                  </span>
                )}
              </AssetBox>
            </li>
            <li className="center">
              <LiHead>
                <LiTitle>{t('Assets.SeasonUsedSCR')}</LiTitle>
                <div className="tips">({t('Assets.SCRTip')})</div>
              </LiHead>
              <div className="num">{asset.credit_used_amount}</div>
              <AssetBox className="tips">
                <span>{t('Assets.SeasonBudget')}:</span>
                <span>{asset.credit_total_amount}</span>
                {canUseCityhall && (
                  <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Credit)}>
                    <EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />
                  </span>
                )}
              </AssetBox>
            </li>
          </FirstLine>

          <AssetList />
        </Box>
      </CardBox>
    </Layout>
  );
}

const AssetBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .btn-edit {
    cursor: pointer;
    height: 18px;
  }
`;

const Vault = styled.div`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #fff;
  color: #000;
`;

const VaultOverview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }
`;

const InfoItem = styled.li`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    color: #000;
    &.detail {
      cursor: pointer;
      div {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
    > span:first-child {
      font-weight: ${theme.textSubtitleFontWeight};
    }
  `}
`;

const VaultInfo = styled.ul`
  margin-top: 30px;
`;
const VaultItem = styled.li`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-block: 20px;
  color: #000;
  .left {
    display: flex;
    gap: 60px;
    align-items: center;
    .name {
      width: 160px;
    }
  }
  .tag {
    margin-left: 20px;
  }
  .info,
  .address {
    display: flex;
    align-items: center;
  }
  .address {
    gap: 5px;
    > div {
      height: 20px;
      cursor: pointer;
      a {
        color: unset;
      }
    }
  }
  .balance {
    font-weight: 600;
  }
`;

const TotalBalance = styled.div`
  ${({ theme }) => css`
    font-weight: ${theme.textSubtitleFontWeight};
    font-size: ${theme.textHeading6FontSize};
  `}
`;

const TotalBalanceNum = styled.div`
  ${({ theme }) => css`
    font-weight: ${theme.textSubtitleFontWeight};
    font-size: ${theme.textHeading5FontSize};
    margin-top: 20px;
    text-align: center;
  `}
`;

const Tag = styled.span`
  ${({ theme }) => css`
    border: 1px solid ${theme.colorPrimary500};
    background: ${theme.colorPrimary500};
  `}
  //border: 1px solid #eecf00;
  border-radius: 6px;
  color: #fff;

  padding: 4px 6px;
  font-size: 12px;
  span {
    margin-left: 5px;
  }
`;

const LiHead = styled.div`
  height: 40px;
`;

const LiTitle = styled.div`
  ${({ theme }) => css`
    font-weight: ${theme.textSubtitleFontWeight};
  `}
`;
