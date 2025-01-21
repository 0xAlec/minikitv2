'use client';

import { WalletIsland } from '@coinbase/onchainkit/wallet';
import { TransactionDefault } from '@coinbase/onchainkit/transaction';
import { useEffect } from 'react';
import { useAuthenticate } from '../lib/auth/useAuthenticate';
import { Loader } from './components/Loader';
import { useMiniKit } from '@/lib/config/MiniKitProvider';
import { useHapticFeedback } from '@/lib/core/useHapticFeedback';

export default function App() {
  const { login, authenticated, user } = useAuthenticate();
  const { impactOccured, notificationOccured, selectionChanged } = useHapticFeedback();
  const { ready, isReady, user: miniappUser } = useMiniKit();

  useEffect(() => {
    const readyApp = async () => {
      await ready();
    };
    if (!isReady) {
      readyApp();
    }
  }, [ready, isReady]);

  useEffect(() => {
    if (isReady && !authenticated) {
      login();
    }
  }, [login, authenticated, isReady]);

  useEffect(() => {
    import('eruda').then((eruda) => {
      eruda.default.init();
      window.console = eruda.default.get('console');
    });
  }, []);

  if (!authenticated) {
    return <Loader title="Welcome to MiniKit Template!" text={
      <>
        <div className="flex flex-row items-center gap-2">
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging you in...
        </div>
      </>
    } />;
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
              {JSON.stringify(miniappUser, null, 2)}
            </pre>
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
              if (status.statusName === 'success') {
                notificationOccured('success');
              }
            }}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
            impactOccured('medium');
          }}>
            Impact
          </button>
        </div>
      </main>
    </div>
  );
}
