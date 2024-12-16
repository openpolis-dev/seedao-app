import { defineChain } from 'viem';

export const amoy = defineChain({
  id: 80002,
  name: 'amoy',
  network: 'POL',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
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
    default: { name: 'Explorer', url: 'https://amoy.polygonscan.com/' },
  },
});
