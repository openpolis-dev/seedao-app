import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CircleProgress from 'components/circleProgress';
import { Button } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import { ACTIONS, useSNSContext } from './snsProvider';
import { useAuthContext } from 'providers/authProvider';
import { builtin } from '@seedao/sns-js';
import useToast, { ToastType } from 'hooks/useToast';
import { ethers } from 'ethers';

export default function RegisterSNSStep2() {
  const { t } = useTranslation();
  const {
    state: { account, provider },
  } = useAuthContext();
  const {
    state: { localData, contract, sns },
    dispatch: dispatchSNS,
  } = useSNSContext();
  const { showToast } = useToast();

  const startTimeRef = useRef<number>(0);
  const [leftTime, setLeftTime] = useState<number>(0);
  const [secret, setSecret] = useState('');

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
    timer = setInterval(timerFunc, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = (leftTime / 60) * 100;

  const handleRegister = async () => {
    if (!account) {
      return;
    }
    dispatchSNS({ type: ACTIONS.SHOW_LOADING });
    try {
      console.log(sns, account, builtin.PUBLIC_RESOLVER_ADDR, secret);
      const res = await contract.register(
        sns,
        account,
        builtin.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(secret),
      );
      const d = { ...localData };
      d[account].step = 'register';
      d[account].stepStatus = 'pending';
      d[account].registerHash = res.hash;
      dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(d) });
      // go to step3
      // dispatchSNS({ type: ACTIONS.ADD_STEP });
    } catch (error) {
      console.error('register failed', error);
      // TODO message
      showToast('failed', ToastType.Danger);
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
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
        } else if (r && r.status === 2) {
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

  return (
    <Container>
      <ContainerWrapper>
        <CurrentSNS>{sns}.seedao</CurrentSNS>
        <CircleBox>
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
      </ContainerWrapper>
    </Container>
  );
}

const Container = styled.div`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  border: 1px solid var(--table-border);
  text-align: center;
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
  margin-top: 47px;
  margin-bottom: 26px;
`;

const StepTitle = styled.div`
  margin-top: 16px;
  color: #534e59;
  line-height: 24px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins-Medium';
`;
const StepDesc = styled.div`
  font-size: 18px;
  color: #534e59;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  margin-top: 11px;
`;

const CircleBox = styled.div`
  position: relative;
  .number {
    font-size: 36px;
    font-family: 'Poppins-Bold';
    font-weight: bold;
    color: var(--bs-primary);
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
