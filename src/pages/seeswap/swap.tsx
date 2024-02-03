import styled from 'styled-components';
import { SwapWidget, Theme } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { useEthersSigner } from 'hooks/ethersNew';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useEffect, useState } from 'react';
import { useSwitchNetwork } from 'wagmi';

const theme: Theme = {
  fontFamily: 'Poppins-Regular',
};

const CHAIN_ID = 5;

const TOKEN_LIST = [
  {
    address: '0x9D56b227Bdd65232CC6400741e303c46067CC9F6',
    name: 'MockUSDT',
    symbol: 'MockUSDT',
    decimals: 6,
    chainId: 5,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    address: '0xF0f214BE4Af4625F5B9EA8A3CE2cCf6d8f35F9f4',
    name: 'TESTSEE',
    symbol: 'TESTSEE',
    decimals: 18,
    chainId: 5,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
];

export default function SeeSwap() {
  const signer = useEthersSigner({ chainId: CHAIN_ID });
  const { switchNetworkAsync } = useSwitchNetwork();

  console.log('====signer', signer, signer?.provider);
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

  return (
    <Container>
      <BackerNav to="/home" title="SNS" />
      <SwapContainer>
        {chainId === CHAIN_ID && (
          <SwapWidget
            tokenList={TOKEN_LIST}
            // defaultInputAmount={10}
            defaultInputTokenAddress={{ [CHAIN_ID]: '0x9D56b227Bdd65232CC6400741e303c46067CC9F6' }}
            defaultOutputTokenAddress={{ [CHAIN_ID]: '0xF0f214BE4Af4625F5B9EA8A3CE2cCf6d8f35F9f4' }}
            provider={signer?.provider}
            theme={theme}
          />
        )}
      </SwapContainer>
    </Container>
  );
}

const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;

const SwapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
