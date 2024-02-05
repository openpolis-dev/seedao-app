import styled from 'styled-components';
import { useEthersSigner } from 'hooks/ethersNew';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useEffect, useState } from 'react';
import { useSwitchNetwork } from 'wagmi';
import LoadingImg from 'assets/Imgs/loading.png';

const CHAIN_ID = 5;

export default function SeeSwap() {
  const signer = useEthersSigner({ chainId: CHAIN_ID });
  const { switchNetworkAsync } = useSwitchNetwork();
  const [showIframe, setShowIframe] = useState(false);
  const [chainId, setChainId] = useState<number>();

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
      setShowIframe(true);
    }, 3000);
  };

  return (
    <Container>
      <BackerNav to="/home" title="SNS" />
      <SwapContainer>
        {chainId === CHAIN_ID && (
          <iframe
            src={`widget.html?fixtureId=%7B"path"%3A"src%2Fcosmos%2FMain.fixture.tsx"%2C"name"%3Anull%7D`}
            title="swap"
            style={{ width: '100%', height: '500px' }}
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
