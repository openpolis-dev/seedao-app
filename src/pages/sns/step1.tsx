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
import useToast, { ToastType } from 'hooks/useToast';
import { useSNSContext, ACTIONS } from './snsProvider';

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
  const [isAvailable, setAvailable] = useState(AvailableStatus.DEFAULT);

  const {
    dispatch,
    state: { provider, account },
  } = useAuthContext();

  const { dispatch: dispatchSNS } = useSNSContext();

  const isLogin = useCheckLogin(account);

  const { showToast } = useToast();

  const handleSearchAvailable = (v: string) => {
    setSearchVal(v);
    setPending(false);
    setAvailable(AvailableStatus.OK);
  };
  const onChangeVal = useCallback(debounce(handleSearchAvailable, 1000), []);

  const handleInput = (v: string) => {
    setVal(v);
    setPending(true);
    onChangeVal(v);
  };

  const handleClearInput = () => {
    setVal('');
    setSearchVal('');
    setAvailable(AvailableStatus.DEFAULT);
  };
  const handleMint = async () => {
    // check login status
    if (!isLogin) {
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
    // if (isAvailable !== AvailableStatus.OK) {
    //   showToast('unvaliable', ToastType.Danger);
    //   return;
    // }
    // TODO mint
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
            {!isPending && isAvailable === AvailableStatus.OK && <OkTag>{t('SNS.Available')}</OkTag>}
            {!isPending && isAvailable === AvailableStatus.NOT_OK && <NotOkTag>{t('SNS.Uavailable')}</NotOkTag>}
            {isPending && <Loading src={LoadingImg} alt="" />}
            {searchVal && <img className="btn-clear" src={ClearIcon} alt="" onClick={handleClearInput} />}
          </SearchRight>
        </SearchBox>
        <OperateBox>
          <MintButton variant="primary" onClick={handleMint}>
            {/* <MintButton variant="primary" onClick={handleMint} disabled={isPending || isAvailable !== AvailableStatus.OK}> */}
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
