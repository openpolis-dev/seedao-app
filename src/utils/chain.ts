import { defineChain } from 'viem';

export const amoy = defineChain({
  id: 80002,
  name: 'amoy',
  network: 'matic',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    public: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
    default: {
      http: ['https://rpc-amoy.polygon.technology'],
      webSocket: ['wss://polygon-amoy-bor-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://www.oklink.com/amoy' },
  },
});
