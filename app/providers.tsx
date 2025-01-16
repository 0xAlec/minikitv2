'use client';

import type { ReactNode } from 'react';
import {baseSepolia} from 'viem/chains';
import { MiniKitProvider } from '@/lib/config/MiniKitProvider';


export function Providers(props: { children: ReactNode }) {

  return (
    <MiniKitProvider
      appId={'cm4rmv3a804pq14ccraqzl5nz'}
      config={{
        apiKey: 'ozpCtG8CfD3TIod_1Va7UBsUm5Rn1-XS',
        name: 'Mini App Template',
        logo: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
        mode: 'auto',
      }}
      chain={baseSepolia}
    >
      {props.children}
    </MiniKitProvider>
  );
}

