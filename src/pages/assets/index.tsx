import React, { useEffect, useMemo, useState } from 'react';
import AssetList from 'components/assetsCom/assetList';
import styled, { css } from 'styled-components';
import requests from 'requests';
import { useTranslation } from 'react-i18next';
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
import { formatNumber } from 'utils/number';
import BgImg from '../../assets/images/homebg.png';
import { Clipboard, Share, ChevronDown, ChevronUp, Pencil } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import { Link } from 'react-router-dom';

const BoxOuter = styled.div`
  ${ContainerPadding};
`;

const Box = styled.div`
  padding: 40px 20px;
`;
const CardBox = styled.div`
  background: #fff;
  box-shadow: rgba(44, 51, 73, 0.1) 0px 0.5rem 1rem 0px;
  height: 100%;
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
    height: 192px;
    //border: 1px solid #f1f1f1;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    position: relative;

    background: #fff;
    color: #fff;
    &:first-child {
      background: linear-gradient(to right, #9d72fa, #6961fa);
    }
    &:nth-child(2) {
      background: linear-gradient(to right, #f9a488, #fe7c7c);
    }
    &:nth-child(3) {
      background: linear-gradient(to right, #f1a6b6, #8f69d2);
    }
    &:nth-child(4) {
      background: linear-gradient(to right, #3bdabe, #44b5f4);
    }
    .inner {
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      //position: relative;
      //z-index: 9;
      color: #000;
    }

    .decorBg {
      position: absolute;
      right: 0;
      bottom: -25px;
      font-size: 90px;
      font-family: 'Jost-Bold';
      opacity: 0.04;
      color: #000;
    }
    div {
      text-align: center;
    }
    @media screen and (max-width: 1000px) {
      width: 48%;
    }
    @media (max-width: 695px) {
      width: 100%;
    }
  }
  .num {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 10px;
    color: #fff;
  }
  .tips {
    font-size: 0.9rem;
    color: #fff;
  }
  @media (max-width: 1100px) {
    .num {
      font-size: 20px;
    }
    .tips {
      font-size: 12px;
    }
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
  const canUseCityhall = usePermission(PermissionAction.AssetsBudget, PermissionObject.Treasury);

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
    floorPrice: '0',
    totalSupply: '0',
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
          'X-API-KEY': 'laP3Go52WW4oBXdt7zhJ7aoj',
        },
      });
      setNftData({
        floorPrice: formatNumber(res.data?.data?.floor_price || 0),
        totalSupply: formatNumber(res.data?.data?.items_total || 0),
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
    const users: any[] = [];
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
    process.env.NODE_ENV === 'production' && getFloorPrice();
    getVaultsInfo();
  }, []);

  return (
    <BoxOuter>
      {Toast}
      {!!showModifyModal && (
        <ModifyBudgetModal handleClose={() => setshowModifyModal(undefined)} handleModify={handleModifyBudget} />
      )}
      <CardBox>
        <Box>
          <Vault>
            <VaultOverview>
              <div className="vaultInner">
                <div className="LftBox">
                  <TotalBalance>{t('Assets.TotalBalance')}</TotalBalance>
                  <TotalBalanceNum>${formatNumber(Number(totalBalance))}</TotalBalanceNum>
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
                    <Link to="/assets/register">登记</Link>
                    <div onClick={() => setShowVaultDetail(!showVaultDetail)}>
                      <span>{t('Assets.Detail')}</span>
                      {showVaultDetail ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </InfoItem>
                </div>
              </div>
            </VaultOverview>
            {showVaultDetail && (
              <VaultInfo>
                {VAULTS.map((v) => (
                  <VaultItem key={v.address}>
                    <div className="left">
                      <span className="name">{t(v.name as any)}</span>
                      <div className="info">
                        <div className="address">
                          <span>{publicJs.AddressToShow(v.address)}</span>
                          <div>
                            <CopyBox text={v.address}>
                              <Clipboard className="iconBox" />
                            </CopyBox>
                          </div>
                          <div>
                            <a
                              href={`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Share className="iconBox" />
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
                    <div className="balance">${formatNumber(Number(vaultsMap[v.id]?.balance || 0.0))}</div>
                  </VaultItem>
                ))}
              </VaultInfo>
            )}
          </Vault>
          <FirstLine>
            <li>
              <div className="inner">
                <LiHead>
                  <LiTitle>{t('Assets.SupplySCR')}</LiTitle>
                  <div className="tips"></div>
                </LiHead>
                <div className="num">{formatNumber(Number(totalSCR))}</div>
                <div style={{ textAlign: 'left' }}>
                  <p className="tips">≈{formatNumber(Number(SCRValue.toFixed(2)))}U</p>
                  <p className="tips">1SCR ≈ {SCR_PRICE}U</p>
                </div>
              </div>
              <div className="decorBg">SEEDAO</div>
            </li>
            <li className="center">
              <div className="inner">
                <LiHead>
                  <LiTitle>{t('Assets.SupplySGN')}</LiTitle>
                  <div className="tips"></div>
                </LiHead>
                <div className="num">{nftData.totalSupply}</div>
                <div className="tips">
                  {t('Assets.FloorPrice')}: <span>{nftData.floorPrice}ETH</span>
                </div>
              </div>
              <div className="decorBg">SEEDAO</div>
            </li>
            <li>
              <div className="inner">
                <LiHead>
                  <LiTitle>{t('Assets.SeasonUseUSD')}</LiTitle>
                </LiHead>
                <div className="num">{formatNumber(asset.token_used_amount)}</div>
                <AssetBox className="tips">
                  <span>{t('Assets.SeasonBudget')}:</span>
                  <span>{formatNumber(asset.token_total_amount)}</span>
                  {canUseCityhall && (
                    <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Token)}>
                      <Pencil />
                      {/*<EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />*/}
                    </span>
                  )}
                </AssetBox>
              </div>
              <div className="decorBg">SEEDAO</div>
            </li>
            <li className="center">
              <div className="inner">
                <LiHead>
                  <LiTitle>{t('Assets.SeasonUsedSCR')}</LiTitle>
                  <div className="tips">({t('Assets.SCRTip')})</div>
                </LiHead>
                <div className="num">{formatNumber(asset.credit_used_amount)}</div>
                <AssetBox className="tips">
                  <span>{t('Assets.SeasonBudget')}:</span>
                  <span>{formatNumber(asset.credit_total_amount)}</span>
                  {canUseCityhall && (
                    <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Credit)}>
                      <Pencil />
                      {/*<EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />*/}
                    </span>
                  )}
                </AssetBox>
              </div>
              <div className="decorBg">SEEDAO</div>
            </li>
          </FirstLine>

          <AssetList />
        </Box>
      </CardBox>
    </BoxOuter>
  );
}

const AssetBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  //gap: 8px;
  font-size: 0.9rem !important;
  .btn-edit {
    cursor: pointer;
    height: 18px;
    padding-left: 10px;
    margin-bottom: 5px;
    z-index: 9;
  }
`;

const Vault = styled.div`
  //padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  //background: #fff;
  color: #000;
`;

const VaultOverview = styled.div`
  background: url(${BgImg}) top no-repeat;
  background-size: 100%;
  background-attachment: fixed;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  .vaultInner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(161, 110, 255, 0.2);
    padding: 30px 40px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }

  @media (max-width: 950px) {
    .vaultInner {
      flex-direction: column;
    }
    .LftBox {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
  }
`;

const InfoItem = styled.li`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    color: #fff;
    &.detail {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.4);
      color: #000;
      padding: 10px 20px;
      border-radius: 10px;

      div {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
    > span:first-child {
      font-weight: ${theme.textSubtitleFontWeight};
    }

    @media (max-width: 950px) {
      color: #000;
      gap: 0;
      &:first-child,
      &:nth-child(2) {
        padding-right: 40px;
        border-right: 1px solid #eee;
      }
    }
  `}
`;

const VaultInfo = styled.ul`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  margin: 0 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 30px 20px 20px;
`;
const VaultItem = styled.li`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-block: 15px;
  color: #000;
  &:last-child {
    border-bottom: 0;
  }
  .left {
    display: flex;
    gap: 60px;
    align-items: center;
    .name {
      width: 160px;
      font-size: 14px;
    }
  }
  .tag {
    margin-left: 20px;
  }
  .info,
  .address {
    display: flex;
    align-items: center;
    font-size: 14px;
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
  .iconBox {
    cursor: pointer;
    margin: 0 0 10px 10px;
  }
  .balance {
    font-weight: 600;
  }
  @media (max-width: 950px) {
    .left {
      gap: 0;
    }
  }
`;

const TotalBalance = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
`;

const TotalBalanceNum = styled.div`
  font-weight: 600;
  font-size: 1.375rem;
  margin-top: 20px;
  text-align: center;

  @media (max-width: 950px) {
    text-align: left;
    margin-top: 0;
    margin-left: 20px;
  }
`;

const Tag = styled.span`
  border: 1px solid var(--bs-primary);
  background: var(--bs-primary);
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
  //height: 40px;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const LiTitle = styled.div`
  color: #fff;
  font-size: 1.2rem;
`;
