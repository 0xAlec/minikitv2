'use client';

import { WalletIsland } from '@coinbase/onchainkit/wallet';
import { TransactionDefault } from '@coinbase/onchainkit/transaction';
import { useEffect, useState } from 'react';
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import sdk from '@farcaster/frame-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { Loader } from './components/Loader';

export default function App() {
  const { ready, authenticated } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (ready && !authenticated) {
      const login = async () => {
        const { nonce } = await initLoginToFrame();
        const result = await sdk.actions.signIn({ nonce: nonce });
        await loginToFrame({
          message: result.message,
          signature: result.signature,
        });
      };
      login();
    }
  }, [ready, authenticated, initLoginToFrame, loginToFrame]);

  useEffect(() => {
    import('eruda').then((eruda) => {
      eruda.default.init();
      window.console = eruda.default.get('console');
    });
  }, []);

  if (!ready || !isSDKLoaded || !authenticated) {
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
