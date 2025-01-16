'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import {createConfig} from '@privy-io/wagmi';
import {WagmiProvider} from '@privy-io/wagmi';
import {baseSepolia} from 'viem/chains';
import {http} from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { coinbaseWallet } from 'wagmi/connectors';

const config = createConfig({
  chains: [baseSepolia], // Pass your required chains as an array
  connectors: [
    coinbaseWallet({
      appName: 'Onchainkit',
      appLogoUrl: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
    })
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers(props: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <PrivyProvider
    appId="cm4rmv3a804pq14ccraqzl5nz"
    config={{
      // Customize Privy's appearance in your app
      appearance: {
        theme: 'light',
        accentColor: '#676FFF',
        logo: 'https://your-logo-url',
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
    }}
    >
      <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <OnchainKitProvider
          apiKey={'ozpCtG8CfD3TIod_1Va7UBsUm5Rn1-XS'}
          chain={base}
            config={{ appearance: { 
              mode: 'auto',
          }
        }}
        >
          {props.children}
        </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

