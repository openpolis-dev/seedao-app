import React, { useEffect, useMemo, useState } from 'react';
import AssetList from 'components/assetsCom/assetList';
import styled from 'styled-components';
import requests from 'requests';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import publicJs from 'utils/publicJs';
import CopyBox from 'components/copy';
import { ethers } from 'ethers';
import ModifyBudgetModal from 'components/assetsCom/modifyBudget';
import { BudgetType } from 'type/project.type';
import { ContainerPadding } from 'assets/styles/global';
import BalanceIcon from 'assets/Imgs/vault/balance.png';
import EthImg from 'assets/Imgs/network/ethereumWhite.jpg';
import PolygonImg from 'assets/Imgs/network/polygonWhite.jpg';
import getConfig from 'utils/envCofnig';
import useCurrentSeason from 'hooks/useCurrentSeason';
import { getVaultBalance, IVaultBalance } from 'requests/publicData';

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
    margin-bottom: 25px;
  }
  @media (max-width: 1100px) {
    .num {
      font-size: 20px;
    }
  }
`;

const SAFE_CHAIN: { [k: string]: { short: string; name: string } } = {
  '1': {
    short: 'eth',
    name: 'Ethereum',
  },
  '137': {
    short: 'POL',
    name: 'Polygon',
  },
};

const SCR_CONTRACT = '0xE4825A1a31a76f72befa47f7160B132AA03813E0';
const SCR_PRICE = 0.03;

const getChainIcon = (chainId: number) => {
  switch (chainId) {
    case 1:
      return <img src={EthImg} alt="" />;
    case 137:
      return <img src={PolygonImg} alt="" />;
    default:
      return '';
  }
};

const VaultAddress = {
  CommunityVault: '0x7FdA3253c94F09fE6950710E5273165283f8b283',
  CommunityVaultPolygon: '0x4876eaD85CE358133fb80276EB3631D192196e24',
  CityHallVault: '0x70F97Ad9dd7E1bFf40c3374A497a7583B0fAdd25',
  IncubatorVault: '0x444C1Cf57b65C011abA9BaBEd05C6b13C11b03b5',
};

const getVaultName = (address: string) => {
  switch (address) {
    case VaultAddress.CommunityVault:
      return 'Assets.CommunityVault';
    case VaultAddress.CommunityVaultPolygon:
      return 'Assets.CommunityVault';
    case VaultAddress.CityHallVault:
      return 'Assets.CityHallVault';
    case VaultAddress.IncubatorVault:
      return 'Assets.IncubatorVault';
    default:
      return '';
  }
};

const SeeVault = ({ v, t }: { v: IVaultBalance; t: Function }) => {
  if (!v) {
    return null;
  }
  return (
    <VaultItem key={v.wallet}>
      <div className="info-left">
        <span className="name">
          <span>{t(getVaultName(v.wallet) as any)}</span>
        </span>
        <div className="balance">
          <span> ${Number(v.fiatTotal).format()}</span>
        </div>
        <div className="info">
          <div className="address">
            <CopyBox text={v.wallet}>
              <span>{publicJs.AddressToShow(v.wallet)}</span>
            </CopyBox>
          </div>
          <a
            href={`https://app.safe.global/balances?safe=${SAFE_CHAIN[String(v.chainId)].short}:${v.wallet}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="tag">
              <Tag>
                {getChainIcon(v.chainId)}
                <span>
                  {v.threshold}/{v.owners}
                </span>
              </Tag>
            </div>
          </a>
        </div>
      </div>
    </VaultItem>
  );
};

export default function Index() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const { Toast, showToast } = useToast();
  // const canUseCityhall = usePermission(PermissionAction.AssetsBudget, PermissionObject.Treasury);

  const currentSeason = useCurrentSeason();

  const [asset, setAsset] = useState({
    token_used_amount: 0,
    token_total_amount: 0,
    credit_used_amount: 0,
    credit_total_amount: 0,
  });
  const [showModifyModal, setshowModifyModal] = useState<BudgetType>();
  const [totalBalance, setTotalBalance] = useState('0.00');
  const [totalSCR, setTotalSCR] = useState('0');
  const [nftData, setNftData] = useState({
    floorPrice: '0',
    totalSupply: '0',
  });
  const [wallets, setWallets] = useState<{ [address: string]: IVaultBalance }>({});

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
      logError('getTreasury error', error);
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
        showModifyModal === BudgetType.Token ? 'USDC' : 'SCR',
      );
      getAssets();
      showToast('success', ToastType.Success);
      setshowModifyModal(undefined);
    } catch (error: any) {
      logError('updateBudget error', error);
      showToast(error?.data?.msg || 'failed', ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const getFloorPrice = async () => {
    fetch(`${getConfig().INDEXER_ENDPOINT}/insight/erc721/total_supply/0x30093266E34a816a53e302bE3e59a93B52792FD4`)
      .then((res) => res.json())
      .then((r) => {
        setNftData({
          floorPrice: '0',
          totalSupply: r.totalSupply,
        });
      })
      .catch((error) => {
        logError('getFloorPrice error', error);
      });
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(getConfig().NETWORK.rpcs[0]);
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
      setTotalSCR(Number(ethers.utils.formatEther(supply)).format());
    } catch (error) {
      logError('getSCR error', error);
    }
  };

  const getVaultData = async () => {
    try {
      const res = await getVaultBalance();
      const _w: { [a: string]: IVaultBalance } = {};
      res.data.wallets.forEach((r) => {
        _w[r.wallet.toLocaleLowerCase()] = r;
      });
      setWallets(_w);
      let v: number = 0;
      res.data.wallets.forEach((w) => (v += Number(w.fiatTotal)));
      setTotalBalance(v.format());
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    getSCR();
    getFloorPrice();
    getVaultData();
  }, []);

  const borderStyle = useMemo(() => {
    return theme ? '1px solid #29282F' : 'unset';
  }, [theme]);

  return (
    <BoxOuter>
      {Toast}
      {/* TODO remove budget */}
      {/* {!!showModifyModal && (
        <ModifyBudgetModal handleClose={() => setshowModifyModal(undefined)} handleModify={handleModifyBudget} />
      )} */}
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
                  <div className="balance num topLft">${totalBalance}</div>
                </div>
              </InfoItem>
              {/*<div className="right">*/}

              <VaultInfo>
                <SeeVault v={wallets[VaultAddress.CommunityVaultPolygon.toLocaleLowerCase()]} t={t} />
                <SeeVault v={wallets[VaultAddress.CommunityVault.toLocaleLowerCase()]} t={t} />
                <SeeVault v={wallets[VaultAddress.CityHallVault.toLocaleLowerCase()]} t={t} />
                <SeeVault v={wallets[VaultAddress.IncubatorVault.toLocaleLowerCase()]} t={t} />
              </VaultInfo>
            </div>
          </VaultOverview>
        </Vault>
        <FirstLine border={borderStyle}>
          <li>
            <LiHead>
              <LiTitle>{t('Assets.SupplySCR')}</LiTitle>
            </LiHead>
            <div className="num">{totalSCR}</div>
            {/*<AssetBox></AssetBox>*/}
            <BorderDecoration color="#FF86CB" />
          </li>
          <li className="center">
            <LiHead>
              <LiTitle>{t('Assets.SupplySGN')}</LiTitle>
            </LiHead>
            <div className="num">{nftData.totalSupply}</div>
            {/*<div className="tips">*/}
            {/*  {t('Assets.FloorPrice')} : <span>{nftData.floorPrice} ETH</span>*/}
            {/*</div>*/}
            <BorderDecoration color="#FFB842" />
          </li>
          <li>
            <LiHead>
              <LiTitle>{t('Assets.SeasonUseUSD', { season: currentSeason })}</LiTitle>
            </LiHead>
            <div className="num">{Number(asset.token_used_amount).format()}</div>
            {/*<AssetBox className="tips">*/}
            {/*  /!* <span>{t('Assets.SeasonBudget')} : </span>*/}
            {/*  <span>{formatNumber(asset.token_total_amount)}</span>*/}
            {/*  {canUseCityhall && (*/}
            {/*    <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Token)}>*/}
            {/*      <Pencil />*/}
            {/*    </span>*/}
            {/*  )} *!/*/}
            {/*</AssetBox>*/}
            <BorderDecoration color="#03DACD" />
          </li>
          <li className="center">
            <LiHead>
              <LiTitle>{t('Assets.SeasonUsedSCR', { season: currentSeason })}</LiTitle>
            </LiHead>
            <div className="num">{Number(asset.credit_used_amount).format()}</div>
            {/*<AssetBox className="tips">*/}
            {/*  /!* <span>{t('Assets.SeasonBudget')} : </span>*/}
            {/*  <span>{formatNumber(asset.credit_total_amount)}</span>*/}
            {/*  {canUseCityhall && (*/}
            {/*    <span className="btn-edit" onClick={() => setshowModifyModal(BudgetType.Credit)}>*/}
            {/*      <Pencil />*/}
            {/*    </span>*/}
            {/*  )} *!/*/}
            {/*</AssetBox>*/}
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
  min-height: 24px;
`;

const Vault = styled.div`
  //padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  //background: #fff;
`;

const VaultOverview = styled.div<{ border: string }>`
  background: #8145ff;
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
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 40px;
  min-width: 300px;
  flex-shrink: 0;
  .topLft {
    color: #ffa842;
  }
  .title {
    font-size: 14px;
    color: #fff;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
  }
  .num {
    font-size: 22px;
    font-family: Poppins-Medium, Poppins;
  }

  .info-right {
    display: flex;
    flex-direction: column;
    gap: 5px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
const VaultItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 25%;
  color: #fff;
  .info-left {
    .name {
      width: 160px;
      font-size: 14px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
    }
  }
  .info,
  .address {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    line-height: 14px;
  }
  .iconBox {
    cursor: pointer;
    margin: 0 0 10px 10px;
  }
  .balance {
    font-size: 20px;
    font-family: Poppins-SemiBold;
    display: flex;
    gap: 16px;
    align-items: center;
    font-weight: 600;
    padding: 9px 0;
  }
`;

const Tag = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 15px;
  span {
    margin-left: 5px;
  }
  img {
    width: 16px;
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
