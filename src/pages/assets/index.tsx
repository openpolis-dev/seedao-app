import React, { useEffect, useMemo, useState } from 'react';
import AssetList from 'components/assetsCom/assetList';
import styled from 'styled-components';
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
import { Button } from 'react-bootstrap';
import { ChevronDown, ChevronUp, Pencil } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import { Link } from 'react-router-dom';
import BalanceIcon from 'assets/Imgs/vault/balance.png';
import WalletIcon from 'assets/Imgs/vault/wallet.png';
import ChainIcon from 'assets/Imgs/vault/chain.png';
import SignerIcon from 'assets/Imgs/vault/signer.png';
import CopyIconSVG from 'components/svgs/copy';
import ShareIconSVG from 'components/svgs/share';
import ArrowIconSVG from 'components/svgs/downArrow';

const BoxOuter = styled.div`
  ${ContainerPadding};
  color: var(--bs-body-color_active);
  font-family: Poppins-Regular, Poppins;
`;

const CardBox = styled.div`
  height: 100%;
`;

const FirstLine = styled.ul<{ border: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  li {
    position: relative;
    width: 23%;
    height: 153px;
    border-radius: 16px;
    padding: 20px 25px;
    overflow: hidden;
    position: relative;
    background-color: var(--bs-box--background);
    border: ${(props) => props.border};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: var(--box-shadow);
    &:hover {
      background-color: var(--home-right_hover);
    }

    @media screen and (max-width: 1000px) {
      width: 48%;
    }
    @media (max-width: 695px) {
      width: 100%;
    }
  }
  .num {
    font-size: 28px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
  }
  @media (max-width: 1100px) {
    .num {
      font-size: 20px;
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
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
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
      const url = 'https://restapi.nftscan.com/api/v2/statistics/collection/0x30093266e34a816a53e302be3e59a93b52792fd4';
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

  const borderStyle = useMemo(() => {
    return theme ? '1px solid #29282F' : 'unset';
  }, [theme]);

  return (
    <BoxOuter>
      {Toast}
      {!!showModifyModal && (
        <ModifyBudgetModal handleClose={() => setshowModifyModal(undefined)} handleModify={handleModifyBudget} />
      )}
      <CardBox>
        <Vault>
          <VaultOverview border={borderStyle}>
            <div className="vaultInner">
              <InfoItem className="left">
                <div>
                  <IconStyle src={BalanceIcon} alt="" />
                </div>
                <div className="info-right">
                  <div className="title">{t('Assets.TotalBalance')}</div>
                  <div className="balance num topLft">${formatNumber(Number(totalBalance))}</div>
                </div>
              </InfoItem>
              {/*<div className="right">*/}
              <InfoItem>
                <div>
                  <IconStyle src={WalletIcon} alt="" />
                </div>
                <div className="info-right">
                  <div className="title">{t('Assets.Wallet')}</div>
                  <div className="num">4</div>
                </div>
              </InfoItem>
              <InfoItem>
                <div>
                  <IconStyle src={SignerIcon} alt="" />
                </div>
                <div className="info-right">
                  <div className="title">{t('Assets.MultiSign')}</div>
                  <div className="num">{totalSigner}</div>
                </div>
              </InfoItem>
              <InfoItem>
                <div>
                  <IconStyle src={ChainIcon} alt="" />
                </div>
                <div className="info-right">
                  <div className="title">{t('Assets.Chain')}</div>
                  <div className="num">2</div>
                </div>
              </InfoItem>
              <OptionBox>
                <Link to="/assets/register">
                  <Button style={{ height: '36px' }}>{t('application.Register')}</Button>
                </Link>
                <DetailButton onClick={() => setShowVaultDetail(!showVaultDetail)}>
                  <span>{t('Assets.Detail')}</span>
                  <ArrowIconSVG style={{ transform: showVaultDetail ? 'rotate(180deg)' : 'unset' }} />
                </DetailButton>
              </OptionBox>
              {/*</div>*/}
            </div>
            {showVaultDetail && (
              <VaultInfo>
                {VAULTS.map((v) => (
                  <VaultItem key={v.address}>
                    <div className="info-left">
                      <span className="name">
                        <DotIcon />
                        <span>{t(v.name as any)}</span>
                      </span>
                      <div className="info">
                        <div className="address">
                          <span>{publicJs.AddressToShow(v.address)}</span>
                          <div>
                            <CopyBox text={v.address}>
                              <CopyIconSVG />
                            </CopyBox>
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
                    <div className="balance">
                      <span> ${formatNumber(Number(vaultsMap[v.id]?.balance || 0.0))}</span>
                      <a
                        href={`https://app.safe.global/balances?safe=${SAFE_CHAIN[v.chainId].short}:${v.address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ShareIconSVG />
                      </a>
                    </div>
                  </VaultItem>
                ))}
              </VaultInfo>
            )}
          </VaultOverview>
        </Vault>
        <FirstLine border={borderStyle}>
          <li>
            <LiHead>
              <LiTitle>{t('Assets.SupplySCR')}</LiTitle>
            </LiHead>
            <div className="num">{formatNumber(Number(totalSCR))}</div>
            <div style={{ textAlign: 'left' }}>
              <p className="tips">{/* ≈ {formatNumber(Number(SCRValue.toFixed(2)))} U 1SCR ≈ {SCR_PRICE} U */}</p>
            </div>
            <BorderDecoration color="#FF86CB" />
          </li>
          <li className="center">
            <LiHead>
              <LiTitle>{t('Assets.SupplySGN')}</LiTitle>
            </LiHead>
            <div className="num">{nftData.totalSupply}</div>
            <div className="tips">
              {t('Assets.FloorPrice')} : <span>{nftData.floorPrice} ETH</span>
            </div>
            <BorderDecoration color="#FFB842" />
          </li>
          <li>
            <LiHead>
              <LiTitle>{t('Assets.SeasonUseUSD')}</LiTitle>
            </LiHead>
            <div className="num">{formatNumber(asset.token_used_amount)}</div>
            <AssetBox className="tips">
              <span>{t('Assets.SeasonBudget')} : </span>
              <span>{formatNumber(asset.token_total_amount)}</span>
              {canUseCityhall && (
                <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Token)}>
                  <Pencil />
                  {/*<EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />*/}
                </span>
              )}
            </AssetBox>
            <BorderDecoration color="#03DACD" />
          </li>
          <li className="center">
            <LiHead>
              <LiTitle>
                {t('Assets.SeasonUsedSCR')}({t('Assets.SCRTip')})
              </LiTitle>
            </LiHead>
            <div className="num">{formatNumber(asset.credit_used_amount)}</div>
            <AssetBox className="tips">
              <span>{t('Assets.SeasonBudget')} : </span>
              <span>{formatNumber(asset.credit_total_amount)}</span>
              {canUseCityhall && (
                <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Credit)}>
                  <Pencil />
                  {/*<EvaIcon name="edit-2-outline" options={{ width: '16px', height: '16px' }} />*/}
                </span>
              )}
            </AssetBox>
            <BorderDecoration color="#4378FF" />
          </li>
        </FirstLine>

        <AssetList />
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
`;

const VaultOverview = styled.div<{ border: string }>`
  background: var(--bs-box--background);
  border: ${(props) => props.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  .vaultInner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 152px;
    padding-left: 29px;
    padding-right: 62px;
  }
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //gap: 60px;
  }

  @media (max-width: 950px) {
    .vaultInner {
      flex-direction: column;
      padding-top: 20px;
      padding: 20px 16px 0 16px;
      align-items: flex-start;
    }
    .left {
      width: 100%;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--bs-body-color);
    }
    .right {
      width: 100%;
      gap: unset;
      margin-bottom: 20px;
    }
  }
`;

const InfoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 22px;
  .topLft {
    color: #ffa842;
  }
  .title {
    font-size: 14px;
    color: var(--bs-body-color);
  }
  .num {
    font-size: 28px;
    font-family: Poppins-Medium, Poppins;
  }

  .info-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &.detail {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.4);
    padding: 10px 20px;
    border-radius: 10px;

    div {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  > span:first-child {
  }

  @media (max-width: 950px) {
    gap: 8px;
    &:first-child,
    &:nth-child(2) {
      padding-right: 40px;
    }
  }
`;

const VaultInfo = styled.ul`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 20px;
`;
const VaultItem = styled.li`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 40px;
  &:hover {
    background-color: var(--bs-menu-hover);
  }
  &:last-child {
    border-bottom: 0;
  }
  .info-left {
    display: flex;
    gap: 60px;
    align-items: center;
    .name {
      width: 160px;
      font-size: 14px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
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
    gap: 8px;
  }
  .iconBox {
    cursor: pointer;
    margin: 0 0 10px 10px;
  }
  .balance {
    font-size: 18px;
    font-family: Poppins-SemiBold, Poppins;
    display: flex;
    gap: 16px;
    align-items: center;
  }
  @media (max-width: 950px) {
    padding: 12px 16px;
  }
`;

const Tag = styled.div`
  background: #ebe9ff;
  color: var(--bs-primary);
  text-align: center;
  border-radius: 8px;
  width: 128px;
  line-height: 30px;
  span {
    margin-left: 5px;
  }
`;

const LiHead = styled.div`
  //height: 40px;
  width: 100%;
`;

const LiTitle = styled.div`
  color: var(--bs-body-color);
  line-height: 18px;
`;

const IconStyle = styled.img`
  width: 54px;
  height: 54px;
`;

const DotIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--bs-primary);
  border-radius: 50%;
  margin-right: 14px;
`;

const OptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  button {
    min-width: 111px;
    font-size: 14px;
  }
  button.btn-outline-primary {
    border: 1px solid var(--bs-border-color);
    background-color: var(--bs-box--background);
    color: var(--bs-body-color_active) !important;
    &:hover {
      background-color: unset !important;
    }
  }
`;

const DetailButton = styled.button`
  min-width: 111px;
  font-size: 14px;
  height: 36px;
  background: var(--bs-d-button-bg);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--bs-d-button-border);
  color: var(--bs-body-color_active);
  .svg-fill {
    fill: var(--bs-body-color) !important;
  }
`;

const BorderDecoration = styled.div<{ color: string }>`
  width: 8px;
  height: calc(100% - 48px);
  box-sizing: border-box;
  background-color: ${(props) => props.color};
  position: absolute;
  top: 24px;
  left: 0%;
  border-radius: 0 100px 100px 0;
`;
