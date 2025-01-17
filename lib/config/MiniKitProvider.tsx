import { OnchainKitProvider } from "@coinbase/onchainkit"
import { PrivyProvider } from "@privy-io/react-auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { http } from "wagmi"
import { WagmiProvider } from '@privy-io/wagmi';
import { createConfig } from "@privy-io/wagmi"
import { baseSepolia, Chain } from "wagmi/chains"
import { User } from "./types"
import { MiniSDK } from "./sdk"

export type MiniKitProviderConfig = {
    name?: string,
    logo?: string,
    mode?: 'auto' | 'light' | 'dark',
    theme?: string,
}

export type MiniKitProviderContextType = {
    platform: 'telegram' | 'farcaster' | 'unknown' | null,
    user: User | null,
    ready: () => Promise<void>,
    isReady: boolean,
}

export const MiniKitProviderContext = createContext<MiniKitProviderContextType | null>(null)

export function useMiniKit() {
    const context = useContext(MiniKitProviderContext)
    if (!context) {
        throw new Error('useMiniKitProviderContext must be used within a MiniKitProvider')
    }
    return context
}

export function MiniKitProvider({
    appId,
    apiKey,
    chain = baseSepolia,
    config = {
        mode: 'auto',
    },
    children,
}: {
    appId: string,
    apiKey?: string,
    chain?: Chain,
    config: MiniKitProviderConfig,
    children: ReactNode,
}) {
    const { name, logo, mode, theme } = config;
    const wagmiConfig = createConfig({
        chains: [chain],
        transports: {
          [chain.id]: http(),
        },
    });      
    const queryClient = new QueryClient();
    const [sdk, setSdk] = useState<MiniSDK | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            const sdk = await MiniSDK.init();
            setSdk(sdk);
            const userData = await sdk.GetUser();
            setUser(userData || null);
        }
        init();
    }, []);

    const contextValue = useMemo<MiniKitProviderContextType>(() => {
        const ready = async () => {
            if (sdk && !isReady) {
                console.log('called ready');
                await sdk.Ready();
                setIsReady(true);
            }
        };

        return {
            platform: sdk?.GetPlatform() ?? null,
            user,
            ready,
            isReady,
        };
    }, [sdk, user, isReady]);

    return (
        <MiniKitProviderContext.Provider value={contextValue}>
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
              apiKey={apiKey}
              chain={chain}
              config={{ 
                appearance: { 
                    name,
                    logo,
                    mode,
                    theme,
                }
              }}
            >
              {children}
            </OnchainKitProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
        </MiniKitProviderContext.Provider>
    )
}