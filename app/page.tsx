'use client';

import { WalletIsland } from '@coinbase/onchainkit/wallet';
import { TransactionDefault } from '@coinbase/onchainkit/transaction';
import { useEffect } from 'react';
import { useAuthenticate } from '../lib/auth/useAuthenticate';
import { Loader } from './components/Loader';

export default function App() {
  const { login, ready, authenticated, user } = useAuthenticate();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [login, ready, authenticated]);

  useEffect(() => {
    import('eruda').then((eruda) => {
      eruda.default.init();
      window.console = eruda.default.get('console');
    });
  }, []);

  if (!ready || !authenticated) {
    return <Loader />;
  }

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
        <div className="flex flex-col gap-4">
          <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <TransactionDefault 
            calls={[{
              to: '0x0000000000000000000000000000000000000000',
              value: BigInt(2900000000000000),
            }]}
            onStatus={(status) => {
              console.log(status);
            }}
          />
        </div>
      </main>
    </div>
  );
}
