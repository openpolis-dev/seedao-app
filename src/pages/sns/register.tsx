import styled from 'styled-components';
import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';
import FinishedComponent from './finished';
import { ContainerPadding } from 'assets/styles/global';
import SNSProvider, { ACTIONS, LocalSNS, useSNSContext } from './snsProvider';
import { useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import StepLoading from './stepLoading';
import BackerNav from 'components/common/backNav';
import CONTROLLER_ABI from 'assets/abi/SeeDAORegistrarController.json';
import MINTER_ABI from 'assets/abi/SeeDAOMinter.json';
import getConfig from 'utils/envCofnig';
import { builtin } from '@seedao/sns-js';
import WhiteListData from 'utils/whitelist.json';
import { useTranslation } from 'react-i18next';
import HelperIcon from 'assets/Imgs/sns/helper.svg';
import useToast, { ToastType } from 'hooks/useToast';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useEthersProvider } from 'hooks/ethersNew';

const whiteList = WhiteListData as {
  rootHash: string;
  proofs: { address: string; proof: string[] }[];
};

const networkConfig = getConfig().NETWORK;

const RegisterSNSWrapper = () => {
  const { t } = useTranslation();
  const {
    state: { account },
  } = useAuthContext();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const provider = useEthersProvider({});

  const {
    state: { step, localData, loading, controllerContract, minterContract },
    dispatch: dispatchSNS,
  } = useSNSContext();

  const { showToast } = useToast();

  const checkUserStatus = async () => {
    try {
      const hasReached = await controllerContract.maxOwnedNumberReached(account);
      dispatchSNS({ type: ACTIONS.SET_HAS_REACHED, payload: hasReached });
    } catch (error:any) {
      logError('query maxOwnedNumberReached failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }
  };

  useEffect(() => {
    const checkUserInwhitelist = async () => {
      try {
        const isInWhitelist = whiteList.proofs.find(
          (item) => item.address.toLocaleLowerCase() === account?.toLocaleLowerCase(),
        );
        if (isInWhitelist) {
          dispatchSNS({ type: ACTIONS.SET_USER_PROOF, payload: isInWhitelist.proof });
        }
      } catch (error:any) {
        logError('checkUserInwhitelist failed', error);
        showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      }
    };
    const checkMaxOwnedNumber = () => {
      controllerContract
        .maxOwnedNumber()
        .then((n: ethers.BigNumber) => {
          dispatchSNS({ type: ACTIONS.SET_MAX_OWNED_NUMBER, payload: n.toNumber() });
        })
        .catch((error: any) => {
          logError('checkMaxOwnedNumber failed', error);
          showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        });
    };
    if (account && controllerContract) {
      checkUserStatus();
      checkUserInwhitelist();
      checkMaxOwnedNumber();
    }
  }, [account, controllerContract]);

  useEffect(() => {
    const checkWhitelistOpen = async () => {
      minterContract
        .registrableWithWhitelist()
        .then((r: boolean) => {
          dispatchSNS({ type: ACTIONS.SET_WHITELIST_IS_OPEN, payload: r });
        })
        .catch((error: any) => {
          dispatchSNS({ type: ACTIONS.SET_WHITELIST_IS_OPEN, payload: true });
          logError('checkWhitelistOpen failed', error);
          showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        });
    };
    const checkHadMintByWhitelist = async () => {
      minterContract
        .registeredWithWhitelist(account)
        .then((r: boolean) => {
          dispatchSNS({ type: ACTIONS.SET_HAD_MINT_BY_WHITELIST, payload: r });
        })
        .catch((error: any) => {
          logError('checkWhitelistOpen failed', error);
          showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        });
    };
    if (account && minterContract) {
      checkWhitelistOpen();
      checkHadMintByWhitelist();
    }
  }, [account, minterContract]);

  useEffect(() => {
    if (account && controllerContract && step === 3) {
      checkUserStatus();
    }
  }, [account, controllerContract, step]);

  useEffect(() => {
    // check network
    console.log('====', chain, switchNetwork);
    if (chain && switchNetwork && chain?.id !== networkConfig.chainId) {
      switchNetwork(networkConfig.chainId);
      return;
    } else if (chain?.id === networkConfig.chainId) {
      const _controller_contract = new ethers.Contract(
        builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
        CONTROLLER_ABI,
        provider,
      );
      dispatchSNS({ type: ACTIONS.SET_CONTROLLER_CONTRACT, payload: _controller_contract });
      const _minter_contract = new ethers.Contract(builtin.SEEDAO_MINTER_ADDR, MINTER_ABI, provider);
      dispatchSNS({ type: ACTIONS.SET_MINTER_CONTRACT, payload: _minter_contract });
    }
  }, [chain, provider?.network.chainId]);

  useEffect(() => {
    if (!localData) {
      const localsns = localStorage.getItem('sns') || '';
      let data: LocalSNS;
      try {
        data = JSON.parse(localsns);
      } catch (error) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });

        return;
      }
      dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: data });
      if (!account || !data || !data[account]) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
      }
    }
  }, [account, localData]);

  useEffect(() => {
    const parseLocalData = () => {
      if (!account || !localData) {
        return;
      }
      const v = localData[account];
      if (!v) {
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_SNS, payload: v.sns });
      // check step

      console.log('v:', v);
      if (v.step === 'commit') {
        console.log('timestamp', v.timestamp);
        if (v.timestamp > 0) {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SHOW_LOADING });
        }
      } else if (v.step === 'register') {
        if (v.stepStatus === 'success') {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 3 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          if (v.stepStatus === 'pending') {
            dispatchSNS({ type: ACTIONS.SHOW_LOADING });
          }
          return;
        }
      }
      dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
    };
    parseLocalData();
  }, [account, localData]);

  const goStep1 = () => {
    if (step === 3) {
      dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
      dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: undefined });
    }
  };

  return (
    <Container>
      <BackerNav to={step === 3 ? '/sns/register' : '/home'} title="SNS" mb="0" onClick={goStep1} />
      <StepContainer>
        {step === 1 && <RegisterSNSStep1 />}
        {step === 2 && <RegisterSNSStep2 />}
        {step === 3 && <FinishedComponent />}
      </StepContainer>
      <SNSHelper href="https://seedao.notion.site/SNS-1a2e97530715430abc115967f219d05b?pvs=4" target="_blank">
        <img src={HelperIcon} alt="" />
        {t('SNS.Helper')}
      </SNSHelper>
      {loading && <StepLoading />}
    </Container>
  );
};

export default function RegisterSNS() {
  return (
    <SNSProvider>
      <RegisterSNSWrapper />
    </SNSProvider>
  );
}

const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;

const StepContainer = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SNSHelper = styled.a`
  display: inline-flex;
  padding-inline: 16px;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  background-color: var(--bs-primary);
  color: #fff;
  position: fixed;
  right: 30px;
  bottom: 30px;
  cursor: pointer;
  font-size: 14px;
  gap: 6px;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #fff;
  }
  img {
    width: 20px;
  }
`;
