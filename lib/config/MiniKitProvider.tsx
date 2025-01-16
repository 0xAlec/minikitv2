import { OnchainKitProvider } from "@coinbase/onchainkit"
import { PrivyProvider } from "@privy-io/react-auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { http, WagmiProvider } from "wagmi"
import { createConfig } from "@privy-io/wagmi"
import { baseSepolia, Chain } from "wagmi/chains"

export type MiniKitProviderConfig = {
    apiKey?: string,
    name?: string,
    logo?: string,
    mode?: 'auto' | 'light' | 'dark',
    theme?: string,
}

export function MiniKitProvider({
    appId,
    config,
    chain = baseSepolia,
    children,
}: {
    appId: string,
    config?: MiniKitProviderConfig,
    chain?: Chain,
    children: ReactNode,
}) {
    const wagmiConfig = createConfig({
        chains: [chain],
        transports: {
          [chain.id]: http(),
        },
      });      
    const queryClient = new QueryClient();

    return (
        <PrivyProvider
        appId={appId}
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
          },
          loginMethods: ['telegram'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
        >
          <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <OnchainKitProvider
              apiKey={config?.apiKey}
              chain={chain}
                config={{ appearance: { 
                  name: config?.name,
                  logo: config?.logo,
                  mode: config?.mode,
                  theme: config?.theme,
              }
            }}
            >
              {children}
            </OnchainKitProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>    
    )
}