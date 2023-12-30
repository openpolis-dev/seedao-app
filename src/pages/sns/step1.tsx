import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from 'utils';
import LoadingImg from 'assets/Imgs/loading.png';
import ClearIcon from 'assets/Imgs/sns/clear.svg';
import useCheckLogin from 'hooks/useCheckLogin';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import { useSNSContext, ACTIONS } from './snsProvider';
import { normalize } from '@seedao/sns-namehash';
import { isAvailable } from '@seedao/sns-safe';
import { builtin } from '@seedao/sns-js';
import { getRandomCode } from 'utils';
import useToast, { ToastType } from 'hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { Address, useNetwork, useSwitchNetwork } from 'wagmi';
import { useEthersProvider } from 'hooks/ethersNew';

import useTransaction, { TX_ACTION } from './useTransaction';
import getConfig from 'utils/envCofnig';
import { checkEstimateGasFeeEnough, checkTokenBalance } from './checkUserBalance';
import parseError from './parseError';

const networkConfig = getConfig().NETWORK;
const PAY_NUMBER = networkConfig.tokens[0].price;

enum AvailableStatus {
  DEFAULT = 'default',
  OK = 'ok',
  NOT_OK = 'not_ok',
}

export default function RegisterSNSStep1() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [val, setVal] = useState<string>();
  const [searchVal, setSearchVal] = useState<string>('');
  const [isPending, setPending] = useState(false);
  const [availableStatus, setAvailable] = useState(AvailableStatus.DEFAULT);
  const [randomSecret, setRandomSecret] = useState<string>('');

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const provider = useEthersProvider({});

  const {
    dispatch,
    state: { account },
  } = useAuthContext();

  const {
    dispatch: dispatchSNS,
    state: { controllerContract, localData, hasReached, user_proof, hadMintByWhitelist, whitelistIsOpen },
  } = useSNSContext();

  const { handleTransaction, handleEstimateGas } = useTransaction();
  const { showToast } = useToast();
  const isLogin = useCheckLogin(account);

  const handleSearchAvailable = async (v: string) => {
    setSearchVal(v);
    try {
      // offchain check
      const res = await isAvailable(v, builtin.SAFE_HOST);
      console.log('offline check', v, res);
      if (!res) {
        setAvailable(AvailableStatus.NOT_OK);
        setPending(false);
        return;
      }
      // onchain check
      if (!controllerContract) {
        showToast(t('SNS.ContractNotReady'), ToastType.Danger, {
          hideProgressBar: true,
        });
        setPending(false);
        setAvailable(AvailableStatus.DEFAULT);
        return;
      }
      const res1 = await controllerContract.available(v);
      console.log('online check', v, res1);

      if (!res1) {
        setAvailable(AvailableStatus.NOT_OK);
        setPending(false);
        return;
      }
      setAvailable(AvailableStatus.OK);
    } catch (error) {
      logError('check available error', error);
      setAvailable(AvailableStatus.DEFAULT);
    } finally {
      setPending(false);
    }
  };
  const onChangeVal = useCallback(debounce(handleSearchAvailable, 1000), [controllerContract]);
  const checkLogin = () => {
    // check login status
    if (!account || !isLogin) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    // TODO check unipass login
    return true;
  };
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

  // check network
  const checkNetwork = useCallback(debounce(handleCheckNetwork, 1000), [chain, switchNetworkAsync]);

  const handleInput = (v: string) => {
    if (v?.length > 15) {
      return;
    }
    if (!v) {
      setVal('');
      setSearchVal('');
      setAvailable(AvailableStatus.DEFAULT);
      return;
    }
    const v_lower = v.toLocaleLowerCase();
    const [ok, v_normalized] = normalize(v_lower);
    setVal(v_normalized);
    if (!ok) {
      setAvailable(AvailableStatus.NOT_OK);
      return;
    } else {
      setPending(true);
      onChangeVal(v_normalized);
    }
    checkNetwork();
  };

  const handleClearInput = () => {
    setVal('');
    setSearchVal('');
    setAvailable(AvailableStatus.DEFAULT);
  };
  const handleMint = async () => {
    if (!account || !checkLogin()) {
      return;
    }
    try {
      const r = await handleCheckNetwork();
      if (r) {
        return;
      }
    } catch (error) {
      return;
    }

    // check token balance if mint by paying token
    if (!(whitelistIsOpen && user_proof && !hadMintByWhitelist)) {
      const token = await checkTokenBalance(account as Address);
      if (token) {
        showToast(t('SNS.NotEnoughBalance', { token }), ToastType.Danger, { hideProgressBar: true });
        dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
        return;
      }
    }

    // make commitment
    let commitment = '';
    let random_code = '';
    try {
      random_code = getRandomCode();
      setRandomSecret(random_code);
      // get commitment
      commitment = await controllerContract.makeCommitment(
        searchVal,
        account,
        builtin.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(random_code),
      );
    } catch (error: any) {
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      logError(`[step-1] commitment failed`, error);
      showToast(`make commitment failed: ${error}`, ToastType.Danger);
      return;
    }

    // estimate commit
    try {
      const estimateResult = await handleEstimateGas(TX_ACTION.COMMIT, commitment);
      console.log('estimateResult', estimateResult);
      const notEnoughToken = await checkEstimateGasFeeEnough(estimateResult, account as Address);
      if (notEnoughToken) {
        showToast(t('SNS.NotEnoughBalance', { notEnoughToken }), ToastType.Danger, { hideProgressBar: true });
        dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
        return;
      }
    } catch (error: any) {
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      logError('[step-1] estimate commit failed', error);
      showToast(parseError(error), ToastType.Danger);
      return;
    }

    // commit
    try {
      const txHash = (await handleTransaction(TX_ACTION.COMMIT, commitment)) as string;
      // record to localstorage
      const data = { ...localData };
      data[account] = {
        sns: searchVal,
        step: 'commit',
        commitHash: txHash,
        stepStatus: 'pending',
        timestamp: 0,
        secret: random_code,
        registerHash: '',
      };
      dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(data) });
    } catch (error: any) {
      logError('[step-1] commit failed', error);
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      showToast(parseError(error), ToastType.Danger);
    }
  };

  useEffect(() => {
    if (!account || !localData || !provider) {
      return;
    }
    const hash = localData[account]?.commitHash;
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

      if (!hash) {
        return;
      }
      provider.getTransactionReceipt(hash).then((r: any) => {
        console.log('r:', r);
        const _d = { ...localData };
        if (r && r.status === 1) {
          // means tx success
          _d[account].stepStatus = 'success';
          provider.getBlock(r.blockNumber).then((block: any) => {
            _d[account].timestamp = block.timestamp;
            dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(_d) });
            dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
            clearInterval(timer);
          });
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

  const showButton = () => {
    if (hasReached) {
      // reach max mint
      return (
        <MintButton variant="primary" disabled={true}>
          {t('SNS.HadSNS')}
        </MintButton>
      );
    } else if (whitelistIsOpen && user_proof && !hadMintByWhitelist) {
      // whitelist mint
      return (
        <MintButton
          variant="primary"
          disabled={isPending || availableStatus !== AvailableStatus.OK}
          onClick={handleMint}
        >
          {t('SNS.FreeMint')}
        </MintButton>
      );
    } else {
      // pay mint
      return (
        <MintButton
          variant="primary"
          disabled={isPending || availableStatus !== AvailableStatus.OK}
          onClick={handleMint}
        >
          {t('SNS.SpentMint', { money: `${PAY_NUMBER} USDT(${networkConfig.name})` })}
        </MintButton>
      );
    }
  };

  const handleGoUserSNS = () => {
    if (!account || !checkLogin()) {
      return;
    }
    navigate('/sns/user');
  };
  return (
    <Container>
      <ContainerWrapper>
        <StepTitle>{t('SNS.Step1Title')}</StepTitle>
        <StepDesc>{t('SNS.Step1Desc')}</StepDesc>
        <SearchBox>
          <InputBox>
            <InputStyled onFocus={checkLogin} value={val} onChange={(e) => handleInput(e.target.value)} />
            <span className="endfill">.seedao</span>
          </InputBox>
          <SearchRight>
            {!isPending && availableStatus === AvailableStatus.OK && <OkTag>{t('SNS.Available')}</OkTag>}
            {!isPending && availableStatus === AvailableStatus.NOT_OK && <NotOkTag>{t('SNS.Uavailable')}</NotOkTag>}
            {isPending && <Loading src={LoadingImg} alt="" />}
            {searchVal && <img className="btn-clear" src={ClearIcon} alt="" onClick={handleClearInput} />}
          </SearchRight>
        </SearchBox>
        <Tip>{t('SNS.InputTip')}</Tip>
        <OperateBox>{showButton()}</OperateBox>
      </ContainerWrapper>
      {/* <UserEntrance onClick={handleGoUserSNS}>
        <UserSVGIcon />
        <span>{t('SNS.MySNS')}</span>
      </UserEntrance> */}
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
  position: relative;
`;

const ContainerWrapper = styled.div`
  max-width: 74%;
  display: inline-block;
`;

const StepTitle = styled.div`
  font-family: 'Poppins-Medium';
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  color: var(--bs-body-color_active);
  margin-top: 64px;
`;

const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 43px;
  color: var(--sns-font-color);
`;

const SearchBox = styled.div`
  width: 394px;
  height: 54px;
  box-sizing: border-box;
  border: 1px solid var(--table-border);
  margin: 0 auto;
  border-radius: 8px;
  padding-left: 13px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  color: var(--bs-body-color_active);
`;

const InputBox = styled.div`
  line-height: 53px;
  display: flex;
  align-items: center;
  font-size: 14px;
  flex: 1;
  .endfill {
    width: 56px;
  }
`;

const InputStyled = styled.input`
  width: 142px;
  height: 100%;
  border: none;
  padding: 0;
  max-width: calc(100% - 56px);
  background-color: transparent;
  &:focus-visible {
    outline: none;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  border-radius: 3px;
  line-height: 20px;
  padding-inline: 8px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`;

const OkTag = styled(StatusTag)`
  color: #1f9e14;
  background: #eefbeb;
`;

const NotOkTag = styled(StatusTag)`
  color: var(--bs-primary);
  background: rgba(236, 233, 255, 0.9); ;
`;

const SearchRight = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  .btn-clear {
    cursor: pointer;
  }
`;

const OperateBox = styled.div`
  margin-top: 43px;
`;

const MintButton = styled(Button)`
  width: 394px;
`;

const Loading = styled.img`
  user-select: none;
  width: 18px;
  height: 18px;
  animation: rotate 1s infinite linear;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Tip = styled.div`
  width: 394px;
  font-size: 10px;
  font-weight: 400;
  color: var(--bs-body-color_active);
  line-height: 17px;
  margin: 0 auto;
  margin-top: 8px;
  text-align: left;
`;

const UserEntrance = styled.span`
  position: absolute;
  background: var(--home-right);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--table-border);
  font-size: 14px;
  height: 36px;
  padding-inline: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  top: 24px;
  right: 24px;
  user-select: none;
  color: var(--bs-body-color_active);
  cursor: pointer;
`;
