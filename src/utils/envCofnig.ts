import EthereumIcon from 'assets/Imgs/network/ethereum.svg';
import PolygonIcon from 'assets/Imgs/network/polygon.svg';

const VERSION = '0.4.16';

const SENTRY_DSN = 'https://b36d900b0a63b0466ff4e73d55e359b2@o4505590144106496.ingest.sentry.io/4506445116604416';

const Polygon_Network = {
  name: 'Polygon',
  nativeToken: 'Matic',
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
      price: 5,
    },
  ],
  whitelistId: 0,
  SCRContract: { address: '0xdC907cd32Bc3D6bb2c63Ede4E28c3fAcdd1d5189', decimals: 18 },
  lend: {
    quotaPerUser: 5000,
    bondNFTContract: '0x496EBfDe236617821BAc1A2486993204378eE6C8',
    scoreLendContract: '0xa868415159Dc88506A9A55fe12E98B171491018d',
    lendToken: {
      address: '0xca152522f26811fF8FcAf967d4040F7C6BbF8eaA',
      decimals: 6,
      symbol: 'USDT',
    },
  },
};

const Sepolia_Network = {
  name: 'Sepolia',
  nativeToken: 'Ether',
  chainId: 11155111,
  rpcs: ['https://rpc.sepolia.ethpandaops.io', 'https://eth-sepolia.public.blastapi.io'],
  icon: PolygonIcon,
  tokens: [
    {
      address: '0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f',
      name: 'USDC',
      decimals: 6,
      price: 5,
    },
  ],
  whitelistId: 0,
};

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
  // JOY_ID_URL: 'https://app.joy.id',
  JOY_ID_URL: 'https://testnet.joyid.dev',
  NETWORK: Polygon_Network,
  INDEXER_ENDPOINT: 'https://test-spp-indexer.seedao.tech',
  SENTRY_DSN: '',
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: 'test',
  REACT_APP_ONESIGNAL_ID: 'd3bf95e4-40e3-455d-95ab-e01ef35d6732',
  REACT_APP_MOBILE_URL: 'https://dev-m.seedao.tech',
  SENTRY_DSN,
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: 'https://preview-api.seedao.tech',
  REACT_APP_THEME_ENABLE: true,
  REACT_APP_ONESIGNAL_ID: '673e6ac3-ab64-4935-8df7-25dd37baa7d1',
  REACT_APP_MOBILE_URL: 'https://preview-m.seedao.tech',
  Polygon_Network,
  SENTRY_DSN,
  JOY_ID_URL: 'https://testnet.joyid.dev',
  NETWORK: {
    ...Polygon_Network,
    lend: {
      ...Polygon_Network.lend,
      bondNFTContract: '0x5eC2dDFdEACB1a4bB4145908bB29D833Fd810712',
      scoreLendContract: '0xcF5504045f74f6A51828B9D8766E4d96822311dE',
    },
  },
  INDEXER_ENDPOINT: 'https://preview-spp-indexer.seedao.tech',
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: 'https://api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://push-api.seedao.tech',
  REACT_APP_JOYID_ENABLE: true,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: '8ecd086b-3e15-4537-9f8b-c55c72a8dcf7',
  REACT_APP_MOBILE_URL: 'https://m.seedao.xyz',
  JOY_ID_URL: 'https://app.joy.id',
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
  Polygon_Network,
  INDEXER_ENDPOINT: 'https://spp-indexer.seedao.tech',
  SENTRY_DSN,
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
