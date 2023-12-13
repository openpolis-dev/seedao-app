import EthereumIcon from 'assets/Imgs/network/ethereum.png';
import PolygonIcon from 'assets/Imgs/vault/polygon.svg';

const VERSION = '0.2.4';

const LOCAL = {
  REACT_APP_BASE_ENDPOINT: 'https://test-api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://test-push-api.seedao.tech',
  REACT_APP_MOBILE_URL: 'preview-m.seedao.tech',
  REACT_APP_MOBILE_OPEN: true,
  REACT_APP_ENV: 'test',
  REACT_APP_JOYID_ENABLE: true,
  REACT_APP_ONESIGNAL_ID: '9c6122e1-3de4-4c03-8e68-9f357e9ca1ae',
  REACT_APP_APP_VERSION: `A ${VERSION}`,
  REACT_APP_THEME_ENABLE: true,
  DESCHOOL_BASE_API: 'https://deschool.app/goapiDevelopment',
  JOY_ID_URL: 'https://app.joy.id',
  NETWORK: {
    name: 'Polygon',
    chainId: 137,
    // rpcs: [
    //   "https://eth-goerli.g.alchemy.com/v2/MATWeLJN1bEGTjSmtyLedn0i34o1ISLD",
    //   "https://rpc.ankr.com/eth_goerli",
    //   "https://endpoints.omniatech.io/v1/eth/goerli/public",
    // ],
    rpcs: [
      'https://polygon-mainnet.g.alchemy.com/v2/-MLinGy2l91vLVZWXmRfNYf9DavMxaEA',
      'https://polygon-pokt.nodies.app',
      'https://polygon.llamarpc.com',
    ],
    icon: PolygonIcon,
    tokens: [
      {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        name: 'USDT',
        decimals: 6,
        price: 1,
      },
    ],
    whitelistId: 1,
  },
  INDEXER_ENDPOINT: 'https://test-spp-indexer.seedao.tech',
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: 'test',
  REACT_APP_ONESIGNAL_ID: 'd3bf95e4-40e3-455d-95ab-e01ef35d6732',
  REACT_APP_MOBILE_URL: 'https://dev-m.seedao.tech',
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: 'https://preview-api.seedao.tech',
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: '673e6ac3-ab64-4935-8df7-25dd37baa7d1',
  REACT_APP_MOBILE_URL: 'https://preview-m.seedao.tech',
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: 'https://api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://push-api.seedao.tech',
  REACT_APP_JOYID_ENABLE: false,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: '8ecd086b-3e15-4537-9f8b-c55c72a8dcf7',
  REACT_APP_MOBILE_URL: 'https://m.seedao.xyz',
  // JOY_ID_URL: 'https://app.joy.id',
  // NETWORK: {
  //   // [TODO] when publish sns contract, change to mainnet
  //   name: 'Sepolia',
  //   chainId: 11155111,
  //   rpc: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
  //   icon: EthereumIcon,
  //   // name: 'Ethereum Mainnet',
  //   // chainId: 1,
  //   // rpc: 'https://mainnet.infura.io/v3/',
  // },
  INDEXER_ENDPOINT: 'https://spp-indexer.seedao.tech',
};

export default function getConfig() {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case 'prod':
      return PRODUCTION;
    case 'preview':
      return PREVIEW;
    case 'dev':
      return DEVELOPMENT;
    default:
      return LOCAL;
  }
}
