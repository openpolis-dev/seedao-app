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
import UserSVGIcon from 'components/svgs/user';
import { Link } from 'react-router-dom';
import { sendTransaction } from '@joyid/evm';
import { SELECT_WALLET } from 'utils/constant';
import { Wallet } from '../../wallet/wallet';
import ABI from 'assets/abi/snsRegister.json';
import getConfig from 'utils/envCofnig';

enum AvailableStatus {
  DEFAULT = 'default',
  OK = 'ok',
  NOT_OK = 'not_ok',
}

const buildCommitData = (commitment: string) => {
  const iface = new ethers.utils.Interface(ABI);
  return iface.encodeFunctionData('commit', [commitment]);
};

export default function RegisterSNSStep1() {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>();
  const [searchVal, setSearchVal] = useState<string>('');
  const [isPending, setPending] = useState(false);
  const [availableStatus, setAvailable] = useState(AvailableStatus.DEFAULT);
  const [randomSecret, setRandomSecret] = useState<string>('');

  const {
    dispatch,
    state: { provider, account },
  } = useAuthContext();

  const {
    dispatch: dispatchSNS,
    state: { contract, localData },
  } = useSNSContext();

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
      const res1 = await contract.available(v);
      console.log('online check', v, res1);

      if (!res1) {
        setAvailable(AvailableStatus.NOT_OK);
        setPending(false);
        return;
      }
      setAvailable(AvailableStatus.OK);
    } catch (error) {
      console.error('check available error', error);
      setAvailable(AvailableStatus.DEFAULT);
    } finally {
      setPending(false);
    }
  };
  const onChangeVal = useCallback(debounce(handleSearchAvailable, 1000), [contract]);

  const handleInput = (v: string) => {
    // check login status
    if (!account || !isLogin) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    if (v?.length > 15) {
      return;
    }
    if (!contract) {
      // TODO check login status?
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
  };

  const handleClearInput = () => {
    setVal('');
    setSearchVal('');
    setAvailable(AvailableStatus.DEFAULT);
  };
  const handleMint = async () => {
    if (!account) {
      return;
    }
    const wallet = localStorage.getItem(SELECT_WALLET);
    const networConfig = wallet === Wallet.UNIPASS ? getConfig().UNIPASS_NETWORK : getConfig().NETWORK;
    // mint
    try {
      const _s = getRandomCode();
      setRandomSecret(_s);
      // get commitment
      const commitment = await contract.makeCommitment(
        searchVal,
        account,
        networConfig.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(_s),
      );
      // commit
      dispatchSNS({ type: ACTIONS.SHOW_LOADING });
      let txHash: string;
      if (wallet && wallet === Wallet.JOYID_WEB) {
        txHash = await sendTransaction({
          to: networConfig.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
          from: account,
          value: '0',
          data: buildCommitData(commitment),
        });
        console.log('joyid txHash:', txHash);
      } else {
        const tx = await contract.commit(commitment);
        console.log('tx:', tx);
        txHash = tx.hash;
      }
      // record to localstorage
      const data = { ...localData };
      data[account] = {
        sns: searchVal,
        step: 'commit',
        commitHash: txHash,
        stepStatus: 'pending',
        timestamp: 0,
        secret: _s,
        registerHash: '',
      };
      dispatchSNS({ type: ACTIONS.SET_STORAGE, payload: JSON.stringify(data) });
    } catch (error: any) {
      console.error('mint failed', error);
      dispatchSNS({ type: ACTIONS.CLOSE_LOADING });
      showToast(error?.reason || error?.data?.message || 'error', ToastType.Danger);
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
        <StepTitle>{t('SNS.Step1Title')}</StepTitle>
        <StepDesc>{t('SNS.Step1Desc')}</StepDesc>
        <SearchBox>
          <InputBox>
            <InputStyled autoFocus value={val} onChange={(e) => handleInput(e.target.value)} />
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
        <OperateBox>
          {/* <MintButton variant="primary" onClick={handleMint}> */}
          <MintButton
            variant="primary"
            onClick={handleMint}
            disabled={isPending || availableStatus !== AvailableStatus.OK}
          >
            {t('SNS.FreeMint')}
          </MintButton>
        </OperateBox>
      </ContainerWrapper>
      <UserEntrance to="/sns/user">
        <UserSVGIcon />
        <span>{t('SNS.MySNS')}</span>
      </UserEntrance>
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
  width: unset;
  min-width: 117px;
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

const UserEntrance = styled(Link)`
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
  color: var(--bs-body-color_active) !important;
  &:hover {
    color: var(--bs-body-color_active);
  }
`;
