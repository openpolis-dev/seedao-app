import { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useCheckLogin from 'hooks/useCheckLogin';
import { useTranslation } from 'react-i18next';
import CreditLogo2 from 'assets/Imgs/light/creditLogo2.svg';
import { BorrowItemsModal, RepayItemsModal } from './itemsModal';
import BorrowModal from './borrowModal';
import RepayModal from './repayModal';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useEthersProvider } from 'hooks/ethersNew';
import { amoy } from 'utils/chain';
import { ethers } from 'ethers';
import getConfig from 'utils/envCofnig';
import BondNFTABI from 'assets/abi/BondNFT.json';
import ScoreLendABI from 'assets/abi/ScoreLend.json';
import { useCreditContext, ACTIONS } from 'pages/credit/provider';
import { erc20ABI } from 'wagmi';
import { getBorrowList, getVaultData, VaultData } from 'requests/credit';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import BorrowAndRepay from './BorrowAndRepay';

const networkConfig = getConfig().NETWORK;

type BorrowCardProps = {
  isLogin: boolean;
};

const MyBorrowingQuota = ({ isLogin }: BorrowCardProps) => {
  const { t } = useTranslation();
  const {
    state: { account },
  } = useAuthContext();
  const {
    dispatch: dispatchCreditEvent,
    state: { myAvaliableQuota, myScore, scoreLendContract },
  } = useCreditContext();
  const [maxAmount, setMaxAmount] = useState(0);

  const getData = (e?: any) => {
    const _provider = new ethers.providers.StaticJsonRpcProvider(amoy.rpcUrls.public.http[0], amoy.id);
    const scoreContract = new ethers.Contract(networkConfig.SCRContract.address, erc20ABI, _provider);
    scoreContract.balanceOf(account).then((r: ethers.BigNumber) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_SCORE,
        payload: Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals)),
      });
    });
  };

  useEffect(() => {
    scoreLendContract
      ?.maxTotalBorrowAmount()
      .then((r: ethers.BigNumber) =>
        setMaxAmount(Number(ethers.utils.formatUnits(r, networkConfig.lend.lendToken.decimals))),
      );
  }, [scoreLendContract]);

  useEffect(() => {
    if (isLogin && account) {
      getData();
    }
  }, [isLogin, account]);

  useEffect(() => {
    document.addEventListener('openMine', getData);
    return () => document.removeEventListener('openMine', getData);
  }, []);

  return (
    <CardStyle>
      <img src={CreditLogo2} alt="" className="logo" />
      <MyCardTop>
        <MyCardLine>
          <div className="label">{t('Credit.MyBorrowQuota')} (USDT)</div>
          {isLogin ? (
            <div className="value">
              <span className="num">{myAvaliableQuota.format(4, true)}</span>
            </div>
          ) : (
            <div className="secret">*********</div>
          )}
        </MyCardLine>
        <CardTips>
          <MyCardTipLine>{t('Credit.MyBorrowTip')}</MyCardTipLine>
          <MyCardTipLine>{t('Credit.MyBorrowTip3', { amount: maxAmount.format(4, true) })}</MyCardTipLine>
        </CardTips>

        <MyCardColomnLine>
          <div>
            <div className="label">{t('Credit.MySCR')}</div>
            {isLogin ? (
              <ItemAmountBox>
                <div className="value">{myScore.format(4, true)}</div>
              </ItemAmountBox>
            ) : (
              <div className="secret">*********</div>
            )}
          </div>
        </MyCardColomnLine>
      </MyCardTop>
    </CardStyle>
  );
};

const MyBorrowing = ({ isLogin }: BorrowCardProps) => {
  const { t } = useTranslation();

  const {
    state: { account },
  } = useAuthContext();

  const {
    state: { myOverdueAmount, myInuseAmount, myOverdueCount, myInUseCount },
  } = useCreditContext();

  const [earlyDate, setEarlyDate] = useState('');

  const getMyData = () => {
    getBorrowList({
      debtor: account!,
      lendStatus: CreditRecordStatus.INUSE,
      sortField: 'borrowTimestamp',
      sortOrder: 'asc',
      page: 1,
      size: 1,
    }).then((r) => {
      if (r.data.length) {
        const d = r.data[0] as ICreditRecord;
        setEarlyDate(d.overdueTime.slice(0, -5));
      }
    });
  };

  useEffect(() => {
    myInUseCount > 0 && getMyData();
  }, [myInUseCount]);

  useEffect(() => {
    document.addEventListener('openMine', getMyData);
    return () => document.removeEventListener('openMine', getMyData);
  }, [account]);

  return (
    <CardStyle2>
      <img src={CreditLogo2} alt="" className="logo" />
      <MyCardTop>
        <MyCardLine>
          <div className="label">{t('Credit.Borrowed')} (USDT)</div>
          {isLogin ? (
            <div className="value">
              <span className="num">{(myInuseAmount + myOverdueAmount).format(4, true)}</span>
            </div>
          ) : (
            <div className="secret">*********</div>
          )}
        </MyCardLine>
        <CardTips>
          <MyCardTipLine2>
            <div>
              {isLogin
                ? myInUseCount > 0
                  ? t('Credit.LatestRepaymentDate', { date: earlyDate })
                  : ` ${t('Credit.NoDate')}`
                : t('Credit.LoginAndCheck')}
            </div>
            <div>{t('Credit.MyBorrowTip2')}</div>
          </MyCardTipLine2>
        </CardTips>
        <MyCardColomnLine>
          <div>
            <div className="label">{t('Credit.CurrentBorrow', { num: isLogin ? myInUseCount : '*' })}</div>
            {isLogin ? (
              <ItemAmountBox>
                <span className="value">{myInuseAmount.format(4, true)}</span>
                <span className="unit">USDT</span>
              </ItemAmountBox>
            ) : (
              <div className="secret">*********</div>
            )}
          </div>
          <div>
            <div className="label">{t('Credit.Overdue', { num: isLogin ? myOverdueCount : '*' })}</div>
            {isLogin ? (
              <ItemAmountBox>
                <span className="value">{myOverdueAmount.format(4, true)}</span>
                <span className="unit">USDT</span>
              </ItemAmountBox>
            ) : (
              <div className="secret">*********</div>
            )}
          </div>
        </MyCardColomnLine>
      </MyCardTop>
    </CardStyle2>
  );
};

const VaultCard = () => {
  const { t } = useTranslation();
  const {
    state: { scoreLendContract },
  } = useCreditContext();
  const [total, setTotal] = useState('0.0000');
  const [data, setData] = useState<VaultData>({
    totalBorrowed: 1,
    totalBorrowedAmount: 0,
    inUseCount: 0,
    inUseAmount: 0,
    paybackCount: 0,
    paybackAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
    forfeitSCRAmount: 0,
  });

  const getData = useCallback(() => {
    scoreLendContract?.totalAvailableBorrowAmount().then((r: ethers.BigNumber) => {
      const value = ethers.utils.formatUnits(r, networkConfig.lend.lendToken.decimals);
      setTotal(Number(value).format(4, true));
    });
  }, [scoreLendContract]);

  const getDataFromIndexer = () => {
    getVaultData().then((r: VaultData) => {
      r && setData(r);
    });
  };

  useEffect(() => {
    getData();
  }, [scoreLendContract, getData]);

  useEffect(() => {
    getDataFromIndexer();
  }, []);

  useEffect(() => {
    const eventHandler = () => {
      getData();
      getDataFromIndexer();
    };
    document.addEventListener('openMine', eventHandler);
    return () => {
      document.removeEventListener('openMine', eventHandler);
    };
  }, [getData]);

  return (
    <CardStyle3>
      <img src={CreditLogo2} alt="" className="logo" />

      <div>
        <div className="label">{t('Credit.DaoTotalQuota')} (USDT)</div>
        <div className="value total-value">{total}</div>
      </div>
      <a className="tip" href="https://app.seedao.xyz/proposal/thread/55" target="_blank" rel="noopener noreferrer">
        {t('Credit.DaoTip')}
      </a>
      <VaultCardColumnLine>
        <div>
          <div className="label">{t('Credit.TotalBorrow', { num: data.totalBorrowed })}</div>
          <div className="value">
            <span>{Number(data.totalBorrowedAmount).format(4, true)}</span>
            <span className="unit">USDT</span>
          </div>
        </div>
        <div>
          <div className="label">{t('Credit.CurrentBorrow', { num: data.inUseCount })}</div>
          <div className="value">
            <span>{Number(data.inUseAmount).format(4, true)}</span>
            <span className="unit">USDT</span>
          </div>
        </div>
      </VaultCardColumnLine>
      <VaultCardColumnLine>
        <div>
          <div className="label">{t('Credit.TotalClear', { num: data.paybackCount })}</div>
          <div className="value">
            <span>{Number(data.paybackAmount).format(4, true)}</span>
            <span className="unit">USDT</span>
          </div>
        </div>
        <div>
          <div className="label">{t('Credit.TotalOverdue', { num: data.overdueCount })}</div>
          <div className="value">
            <span>{Number(data.overdueAmount).format(4, true)}</span>
            <span className="unit">USDT</span>
          </div>
        </div>
      </VaultCardColumnLine>
    </CardStyle3>
  );
};

export default function CreditCards() {
  const {
    dispatch,
    state: { account },
  } = useAuthContext();

  const {
    dispatch: dispatchCreditEvent,
    state: { scoreLendContract, bondNFTContract },
  } = useCreditContext();

  const isLogin = useCheckLogin(account);

  const loginStatus = isLogin && !!account;

  const openLogin = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const provider = useEthersProvider({});

  useEffect(() => {
    const _provider = new ethers.providers.StaticJsonRpcProvider(amoy.rpcUrls.public.http[0], amoy.id);
    const bondNFTContract = new ethers.Contract(networkConfig.lend.bondNFTContract, BondNFTABI, _provider);
    dispatchCreditEvent({ type: ACTIONS.SET_BOND_NFT_CONTRACT, payload: bondNFTContract });
    const scoreLendontract = new ethers.Contract(networkConfig.lend.scoreLendContract, ScoreLendABI, _provider);
    dispatchCreditEvent({ type: ACTIONS.SET_LEND_CONTRACT, payload: scoreLendontract });
  }, []);

  const getData = useCallback(() => {
    const decimals = networkConfig.lend.lendToken.decimals;
    bondNFTContract?.userBorrow(account).then((r: any) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_DATA,
        payload: {
          overdueCount: r.overdueCount.toNumber(),
          overdueAmount: Number(ethers.utils.formatUnits(r.overdueAmount, decimals)),
          inUseCount: r.inUseCount.toNumber(),
          inUseAmount: Number(ethers.utils.formatUnits(r.inUseAmount, decimals)),
        },
      });
    });
    scoreLendContract?.userAvailableBorrowAmount(account).then((r: any) => {
      dispatchCreditEvent({
        type: ACTIONS.SET_MY_QUOTA,
        payload: Number(ethers.utils.formatUnits(r.availableAmount, decimals)),
      });
    });
  }, [bondNFTContract, scoreLendContract, account, dispatchCreditEvent]);

  useEffect(() => {
    if (!account) {
      return;
    }
    getData();
  }, [scoreLendContract, account, getData]);

  useEffect(() => {
    // check network
    if (loginStatus && chain && switchNetwork && chain?.id !== amoy.id) {
      switchNetwork(amoy.id);
    }
  }, [loginStatus, chain, provider?.network.chainId]);

  return (
    <>
      <CardsRow>
        <MyBorrowingQuota isLogin={!!loginStatus}></MyBorrowingQuota>
        <MyBorrowing isLogin={!!loginStatus}></MyBorrowing>
        <VaultCard />
      </CardsRow>
      <BorrowAndRepay isLogin={!!loginStatus} onUpdate={getData} />
    </>
  );
}

const CardsRow = styled.div`
  display: flex;
  gap: 32px;
  > div {
    flex: 1;
  }
`;

const CardStyle = styled.div`
  border-radius: 25px;
  background: #edf8f3;
  display: flex;
  flex-direction: column;
  position: relative;
  color: rgba(52, 60, 106, 0.7);
  img.logo {
    position: absolute;
    right: 24px;
    top: 20px;
  }
  .secret {
    color: #343c6a;
  }
`;

const CardStyle2 = styled(CardStyle)`
  background: #ecf8fe;
`;

const CardStyle3 = styled(CardStyle)`
  background: #f3eeff;
  border: 1px solid #dfeaf2;
  padding: 26px;
  color: #343c6a;
  .value {
    font-size: 36px;
    font-weight: 700;
    font-family: 'Inter-SemiBold';
    &.total-value {
      margin-block: 16px;
    }
  }
  .unit {
    font-size: 12px;
    margin-left: 6px;
  }
  .label {
    font-size: 12px;
    color: #718ebf;
  }
  .tip {
    color: #0a06f4;
    font-size: 12px;
    margin-bottom: 8px;
    cursor: pointer;
  }
`;

const MyCardTop = styled.div`
  padding: 26px;
  padding-bottom: 0;
  flex: 1;
  position: relative;
`;

const MyCardLine = styled.div`
  .label {
    font-size: 12px;
  }
  .value,
  .secret {
    margin-block: 16px;
    font-size: 36px;
    color: #343c6a;
    font-weight: 700;
    font-family: 'Inter-SemiBold';
  }
  .secret {
    font-size: 30px;
  }
`;

const CardTips = styled.div`
  background: #fff;
  padding: 6px 4px;
  margin-bottom: 16px;
`;

const MyCardTipLine = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;

const MyCardTipLine2 = styled(MyCardTipLine)`
  .icon {
    position: relative;
    top: -1px;
    left: 3px;
  }
`;

const MyCardColomnLine = styled.div`
  margin-top: 20px;
  display: flex;
  > div {
    flex: 1;
  }
  .label {
    opacity: 0.7;
    font-size: 12px;
  }
`;

const VaultCardColumnLine = styled.div`
  margin-top: 8px;
  display: flex;
  > div {
    flex: 1;
  }
  .value {
    font-size: 15px;
  }
  .unit {
    font-size: 10px;
    margin-left: 4px;
  }
`;

const ItemAmountBox = styled.div`
  color: #343c6a;
  .value {
    font-size: 15px;
  }
  .unit {
    font-size: 10px;
    margin-left: 4px;
  }
`;
