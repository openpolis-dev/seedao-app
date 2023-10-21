import * as React from 'react'
import {usePublicClient, useWalletClient} from 'wagmi'
import { ethers } from 'ethers'

export function publicClientToProvider(publicClient) {
    const { chain, transport } = publicClient;

    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback')
        return new ethers.providers.FallbackProvider(
            (transport.transports).map(
        ({ value }) => new ethers.providers.JsonRpcProvider(value?.url, network),
    ),
)
    return new ethers.providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }) {
    const publicClient = usePublicClient({ chainId })
    return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}


export function walletClientToSigner(walletClient) {
    const { account, chain, transport } = walletClient
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new ethers.providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }) {
    const { data: walletClient } = useWalletClient({ chainId })
    return React.useMemo(
        () => (walletClient ? walletClientToSigner(walletClient) : undefined),
        [walletClient],
    )
}
