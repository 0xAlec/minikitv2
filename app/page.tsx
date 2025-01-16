'use client';

import { WalletIsland } from '@coinbase/onchainkit/wallet';
import { TransactionDefault } from '@coinbase/onchainkit/transaction';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    import('eruda').then((eruda) => {
      eruda.default.init();
      window.console = eruda.default.get('console');
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-end">
          <div className="wallet-container">
            <WalletIsland />
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <TransactionDefault calls={[{
          to: '0x0000000000000000000000000000000000000000',
          value: BigInt(2900000000000000),
        }]}
        onStatus={(status) => {
          console.log(status);
        }}
          />
      </main>
    </div>
  );
}
