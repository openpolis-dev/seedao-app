import styled from 'styled-components';
import { useEthersSigner } from 'hooks/ethersNew';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useEffect, useState } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { readContract } from 'wagmi/actions';
import LoadingImg from 'assets/Imgs/loading.png';
import sns from '@seedao/sns-js';
import useToast, { ToastType } from 'hooks/useToast';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import publicJs from 'utils/publicJs';
import { useAuthContext } from 'providers/authProvider';

const CHAIN_ID = 5;
const SEE_TOKEN_ADDRESS = '0xF0f214BE4Af4625F5B9EA8A3CE2cCf6d8f35F9f4';
const RPC_LIST = [
  'https://eth-goerli.g.alchemy.com/v2/MATWeLJN1bEGTjSmtyLedn0i34o1ISLD',
  'https://rpc.ankr.com/eth_goerli',
  'https://endpoints.omniatech.io/v1/eth/goerli/public',
];
const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'whiltelist',
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
];

export default function SeeSwap() {
  const { t } = useTranslation();
  const {
    state: { theme },
  } = useAuthContext();
  const signer = useEthersSigner({ chainId: CHAIN_ID });
  const { switchNetworkAsync } = useSwitchNetwork();
  const [showIframe, setShowIframe] = useState(false);
  const [chainId, setChainId] = useState<number>();
  const { address } = useAccount();
  const { showToast } = useToast();
  const [hasSNS, setHasSNS] = useState<0 | 1 | 2>(0);
  const [hasInWhitelist, setHasInWhitelist] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!signer) {
        return;
      }
      try {
        const { chainId: _chainId } = await signer?.provider.getNetwork();
        console.log('====chainId', _chainId);
        if (_chainId !== CHAIN_ID && switchNetworkAsync) {
          await switchNetworkAsync(CHAIN_ID);
        }
        setChainId(CHAIN_ID);
      } catch (error) {
        if (switchNetworkAsync) {
          await switchNetworkAsync(CHAIN_ID);
          setChainId(CHAIN_ID);
        }
      }
    };
    checkNetwork();
  }, [signer, switchNetworkAsync]);

  const handleStyle = () => {
    console.log('---- widget loaded ----');
    setTimeout(() => {
      const iframeDocument = document.getElementsByTagName('iframe')[0].contentDocument;
      [
        '.sc-jhGUec',
        '.liNYvh',
        '.sc-jlQhrW',
        // '.sc-iGkqmO'
      ].forEach((classname) => {
        const el = iframeDocument?.querySelector(classname);
        el?.setAttribute('style', 'display: none');
      });
      const box = iframeDocument?.querySelector('.fNvcGj');
      box?.setAttribute('style', 'background-color:#fafafa;background-image:unset');

      setShowIframe(true);
    }, 3000);
  };

  console.log('====hasSNS', hasSNS);
  console.log('====hasInWhitelist', hasInWhitelist);

  const handleWhitelist = async () => {
    const _network = { chainId: CHAIN_ID, name: 'Goerli' };
    const rpc = await publicJs.checkRPCavailable(RPC_LIST, _network);
    const _provider = new ethers.providers.StaticJsonRpcProvider(rpc, _network);
    const contract = new ethers.Contract(SEE_TOKEN_ADDRESS, ABI, _provider);
    contract
      .whiltelist(address)
      .then((res: any) => {
        setHasInWhitelist(res ? 1 : 2);
      })
      .catch((err: any) => {
        showToast('Network is poor, please try again later', ToastType.Danger);
        console.error(err);
      });
  };

  useEffect(() => {
    if (address) {
      sns.name(address).then((name) => {
        setHasSNS(name ? 1 : 2);
      });
      handleWhitelist();
    }
  }, [address]);

  return (
    <Container>
      <BackerNav to="/home" title="See Swap" />
      <SwapContainer>
        {chainId === CHAIN_ID && (
          <iframe
            src={`widget.html?fixtureId=%7B"path"%3A"src%2Fcosmos%2FMain.fixture.tsx"%2C"name"%3Anull%7D`}
            title="swap"
            style={{ width: '100%', height: '496px' }}
            frameBorder={0}
            id="swap-widget"
            onLoad={handleStyle}
          />
        )}
      </SwapContainer>
      {(!showIframe || chainId !== CHAIN_ID || !signer) && (
        <SwapMask>
          <img src={LoadingImg} alt="" />
        </SwapMask>
      )}
      {hasSNS === 2 && hasInWhitelist !== 1 && (
        <NoSNS>
          <p>{t('Msg.SwapTip1')}</p>
          <Link to="/sns/register">
            <Button>{t('SNS.Started')}</Button>
          </Link>
          <p className="small">{t('Msg.SwapTip2')}</p>
        </NoSNS>
      )}
    </Container>
  );
}

const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
  position: relative;
`;

const SwapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 75px);
`;

const SwapMask = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 75px);
  background-color: var(--rht-bg);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    user-select: none;
    width: 40px;
    height: 40px;
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const NoSNS = styled(SwapMask)`
  gap: 20px;
  .small {
    font-size: 12px;
  }
`;
