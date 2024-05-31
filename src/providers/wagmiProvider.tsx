import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, Chain, goerli, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { UniPassConnector } from '@unipasswallet/wagmi-connector';
import { JoyIdConnector } from '@joyid/wagmi';
import { amoy } from 'utils/chain';

import getConfig from 'utils/envCofnig';
const networkConfig = getConfig().NETWORK;

const APP_NAME = 'SeeDAO';
const APP_ICON = `${window.location.origin}/icon192.png`;

export default function WagmiProvider(props: React.PropsWithChildren) {
  let supportChains: Chain[] = [mainnet, polygon, goerli, sepolia, amoy];
  // switch (networkConfig.chainId) {
  //   case 1:
  //     supportChains = [mainnet, goerli];
  //     break;
  //   case 137:
  //     supportChains = [mainnet, polygon, goerli, sepolia];
  //     break;
  //   default:
  //     throw new Error(`[config] Unsupported chainId:${networkConfig.chainId}`);
  // }

  const { chains, publicClient } = configureChains(supportChains, [publicProvider()]);

  const unipass = new UniPassConnector({
    options: {
      chainId: supportChains[0].id,
      returnEmail: false,
      appSettings: {
        appName: APP_NAME,
        appIcon: APP_ICON,
      },
    },
  });

  const joyidConnector = new JoyIdConnector({
    chains,
    options: {
      name: APP_NAME,
      logo: APP_ICON,
      joyidAppURL: getConfig().JOY_ID_URL,
    },
  });

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: false,
        },
      }),
      joyidConnector,
      unipass,
    ],
    publicClient,
  });

  return <WagmiConfig config={config}>{props.children}</WagmiConfig>;
}
