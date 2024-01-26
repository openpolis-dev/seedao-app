import styled from 'styled-components';
import { SwapWidget, Theme } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { useEthersSigner } from 'hooks/ethersNew';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';

const theme: Theme = {
  fontFamily: 'Poppins-Regular',
};

export default function SeeSwap() {
  const signer = useEthersSigner({ chainId: 137 });
  return (
    <Container>
      <BackerNav to="/home" title="SNS" />
      <SwapContainer>
        <SwapWidget
          provider={signer?.provider}
          onConnectWalletClick={() => {
            console.log('onConnectWalletClick');
          }}
          theme={theme}
        />
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
