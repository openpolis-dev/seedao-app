import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
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

enum AvailableStatus {
  DEFAULT = 'default',
  OK = 'ok',
  NOT_OK = 'not_ok',
}

export default function RegisterSNSStep1() {
  const { t } = useTranslation();
  const [val, setVal] = useState<string>();
  const [searchVal, setSearchVal] = useState<string>();
  const [isPending, setPending] = useState(false);
  const [availableStatus, setAvailable] = useState(AvailableStatus.DEFAULT);
  const [randomSecret, setRandomSecret] = useState<string>('');

  const {
    dispatch,
    state: { provider, account },
  } = useAuthContext();

  const {
    dispatch: dispatchSNS,
    state: { contract },
  } = useSNSContext();

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
    if (v?.length > 15) {
      return;
    }
    if (!contract) {
      // TODO check login status?
      return;
    }
    const v_lower = v.toLocaleLowerCase();
    setVal(v_lower);
    const [ok, v_normalized] = normalize(v_lower);
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
    // check login status
    if (!account || !isLogin) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    // check network
    const network = await provider.getNetwork();
    if (network?.chainId !== 11155111) {
      // switch network;
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(11155111) }]);
      } catch (error) {
        console.error('switch network error', error);
        return;
      }
    }
    // if (availableStatus !== AvailableStatus.OK) {
    //   showToast('unvaliable', ToastType.Danger);
    //   return;
    // }
    // mint
    // try {
    //   const _s = getRandomCode();
    //   setRandomSecret(_s);
    //   const tx = await contract.makeCommitment(
    //     searchVal,
    //     account,
    //     builtin.PUBLIC_RESOLVER_ADDR,
    //     ethers.utils.formatBytes32String(_s),
    //   );
    //   const txHash = tx.hash;
    //   // record to localstorage
    //   const localsns = localStorage.getItem('sns') || '';
    //   let data = undefined;
    //   try {
    //     data = JSON.parse(localsns);
    //   } catch (error) {
    //     data = {};
    //   }
    //   data[account] = {
    //     sns: searchVal,
    //     step: 'commit',
    //     commitHash: txHash,
    //     stepStatus: 'pending',
    //     commitTimeStart: new Date().getTime(),
    //   };
    //   localStorage.setItem('sns', JSON.stringify(data));
    //   try {
    //     await tx.wait();
    //     data[account] = {
    //       ...data[account],
    //       stepStatus: 'success',
    //       commitTimeEnd: new Date().getTime(),
    //     };
    //     dispatchSNS({ type: ACTIONS.ADD_STEP, payload: null });
    //   } catch (error) {
    //     data[account] = {
    //       ...data[account],
    //       stepStatus: 'failed',
    //       commitTimeEnd: new Date().getTime(),
    //     };
    //     throw new Error('tx failed');
    //   } finally {
    //     localStorage.setItem('sns', JSON.stringify(data));
    //   }
    // } catch (error) {
    //   console.error('mint failed', error);
    // }
    const txId = '0xa97e6bdf6329e69e16529bc16bdb2a4afbe77a1a2bd3d31cd7b43f63619baefb';

    localStorage.setItem(
      'sns',
      JSON.stringify({
        [account]: {
          sns: searchVal,
          step: 'commit',
          secret: randomSecret,
          commitHash: txId,
          stepStatus: 'success',
          commitTimeStart: new Date().getTime(),
          commitTimeEnd: new Date().getTime(),
          timestamp: Math.floor(Date.now() / 1000),
        },
      }),
    );
    // record to localstorage
    // const block = await provider.getBlock('0xf5b7874afd9670a20bd5259b11c3998b631e15a84202e0e653432e7cb286760b');
    // console.log('block', block);

    // provider.getTransactionReceipt(txId).then((r: any) => {
    //   console.log('r:', r);

    // });
    dispatchSNS({ type: ACTIONS.ADD_STEP, payload: null });
  };
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
        <OperateBox>
          <MintButton variant="primary" onClick={handleMint}>
            {/* <MintButton variant="primary" onClick={handleMint} disabled={isPending || availableStatus !== AvailableStatus.OK}> */}
            {t('SNS.FreeMint')}
          </MintButton>
        </OperateBox>
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
  color: #534e59;
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
  &:focus-visible {
    outline: none;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  border-radius: 3px;
  line-height: 20px;
  padding-inline: 8px;
  font-size: 9px;
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
  margin-top: 68px;
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
