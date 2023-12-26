import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CircleProgress from 'components/circleProgress';
import { Button } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import { ACTIONS, useSNSContext } from './snsProvider';
import { useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import useTransaction, { TX_ACTION } from './useTransaction';
import CancelModal from './cancelModal';
import getConfig from 'utils/envCofnig';
import { ethers } from 'ethers';
import useCheckBalance from './useCheckBalance';
import { useEthersProvider } from 'hooks/ethersNew';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const networkConfig = getConfig().NETWORK;

export default function RegisterSNSStep2() {
  const { t } = useTranslation();

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const provider = useEthersProvider({});
  const {
    state: { account, theme },
  } = useAuthContext();
  const {
    state: { localData, sns, user_proof, hadMintByWhitelist, whitelistIsOpen },
    dispatch: dispatchSNS,
  } = useSNSContext();
  const { showToast } = useToast();

  const { handleTransaction, approveToken } = useTransaction();
  const checkBalance = useCheckBalance(provider);

  const startTimeRef = useRef<number>(0);
  const [leftTime, setLeftTime] = useState<number>(0);
  const [secret, setSecret] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const parseLocalData = () => {
      if (!account || !localData) {
        return;
      }
      const d = localData[account];
      setSecret(d.secret);
      startTimeRef.current = d.timestamp || 0;
    };
    parseLocalData();
  }, [localData]);

  useEffect(() => {
    let timer: any;
    const timerFunc = () => {
      if (!startTimeRef.current) {
        return;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const delta = currentTime - startTimeRef.current;
      if (delta > 60) {
        setLeftTime(0);
        clearInterval(timer);
        return;
      }
      setLeftTime(60 - delta);
    };
    timerFunc();
    timer = setInterval(timerFunc, 2000);
    return () => clearInterval(timer);
  }, []);

  const progress = (leftTime / 60) * 100;

  const handleCheckNetwork = async () => {
    if (chain && switchNetworkAsync && chain?.id !== networkConfig.chainId) {
      try {
        await switchNetworkAsync(networkConfig.chainId);
      } catch (error) {
        logError('switch network error', error);
        showToast(t('SNS.NetworkNotReady'), ToastType.Danger, { hideProgressBar: true });
        throw new Error('switch network error');
      }
      return true;
    }
  };

  const handleRegister = async () => {
    if (!account) {
      return;
    }
    // check network
    try {
      const r = await handleCheckNetwork();
      if (r) {
        return;
      }
    } catch (error) {
      return;
    }

    // check native balance
    const token = await checkBalance(true);
    if (token) {
      showToast(t('SNS.NotEnoughBalance', { token }), ToastType.Danger, { hideProgressBar: true });
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      return;
    }
    dispatchSNS({ type: ACTIONS.SHOW_LOADING });
    try {
      const d = { ...localData };

      let txHash: string = '';
      if (user_proof && !hadMintByWhitelist && whitelistIsOpen) {
        txHash = (await handleTransaction(TX_ACTION.WHITE_MINT, { sns, secret, proof: user_proof })) as string;
      } else {
        // approve
        await approveToken();
        // check balance
        const token = await checkBalance(true, true);
        if (token) {
          showToast(t('SNS.NotEnoughBalance', { token }), ToastType.Danger, { hideProgressBar: true });
          dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
          return;
        }

        txHash = (await handleTransaction(TX_ACTION.PAY_MINT, { sns, secret })) as string;
      }
      if (!txHash) {
        throw new Error('txHash is empty');
      }

      d[account].registerHash = txHash;
      d[account].step = 'register';
      d[account].stepStatus = 'pending';
      dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(d) });
      // go to step3
      // dispatchSNS({ type: ACTIONS.ADD_STEP });
    } catch (error: any) {
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      logError('register failed', error);
      showToast(error?.reason || error?.data?.message || 'error', ToastType.Danger);
    } finally {
    }
  };

  useEffect(() => {
    if (!account || !localData || !provider) {
      return;
    }
    const hash = localData[account]?.registerHash;
    console.log(localData[account], hash);
    if (!hash || localData[account]?.stepStatus === 'failed') {
      return;
    }
    let timer: any;
    const timerFunc = () => {
      if (!account || !localData) {
        return;
      }
      console.log(localData, account);
      provider.getTransactionReceipt(hash).then((r: any) => {
        console.log('r:', r);
        const _d = { ...localData };
        if (r && r.status === 1) {
          // means tx success
          _d[account].stepStatus = 'success';
          dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(_d) });
          dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
          clearInterval(timer);
        } else if (r && (r.status === 2 || r.status === 0)) {
          // means tx failed
          _d[account].stepStatus = 'failed';
          dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(_d) });
          dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
          clearInterval(timer);
        }
      });
    };
    timer = setInterval(timerFunc, 1000);
    return () => timer && clearInterval(timer);
  }, [localData, account, provider]);

  const handleCancel = () => {
    setShowCancelModal(false);
    localStorage.removeItem('sns');
    dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
    dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: undefined });
  };

  return (
    <Container>
      <ContainerWrapper>
        <CurrentSNS>{sns}.seedao</CurrentSNS>
        <CircleBox color={theme ? '#fff' : 'var(--bs-primary)'}>
          <CircleProgress progress={progress} color="var(--bs-primary)" />
          <div className="number">
            {leftTime}
            <span className="sec">S</span>
          </div>
        </CircleBox>
        <StepTitle>{t('SNS.TimerTitle')}</StepTitle>
        <StepDesc>{t('SNS.TimerDesc')}</StepDesc>
        <FinishButton onClick={handleRegister} disabled={!!leftTime}>
          {t('SNS.Finish')}
        </FinishButton>
        <CancelButton onClick={() => setShowCancelModal(true)}>{t('SNS.CancelRegister')}</CancelButton>
      </ContainerWrapper>
      {showCancelModal && <CancelModal handleClose={() => setShowCancelModal(false)} handleCancel={handleCancel} />}
    </Container>
  );
}

const Container = styled.div`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  text-align: center;
`;

const ContainerWrapper = styled.div`
  max-width: 74%;
  display: inline-block;
`;

const CurrentSNS = styled.div`
  font-family: 'Poppins-SemiBold';
  font-weight: 600;
  font-size: 34px;
  color: var(--bs-body-color_active);
  line-height: 54px;
  letter-spacing: 1px;
  margin-top: 30px;
  margin-bottom: 26px;
`;

const StepTitle = styled.div`
  margin-top: 16px;
  line-height: 24px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins-Medium';
  color: var(--sns-font-color);
`;
const StepDesc = styled.div`
  font-size: 18px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  margin-top: 11px;
  color: var(--sns-font-color);
`;

const CircleBox = styled.div<{ color: string }>`
  position: relative;
  .number {
    font-size: 36px;
    font-family: 'Poppins-Bold';
    font-weight: bold;
    color: ${(props) => props.color};
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    line-height: 118px;
  }
  .sec {
    font-family: 'Poppins-Regular';
    font-weight: 400;
    font-size: 20px;
    position: relative;
    bottom: 6px;
    left: 2px;
  }
`;

const FinishButton = styled(Button)`
  width: 394px;
  margin-top: 26px;
`;

const CancelButton = styled.span`
  text-align: center;
  display: block;
  margin: 16px auto;
  font-size: 12px;
  cursor: pointer;
  min-width: 100px;
  max-width: 200px;
`;
