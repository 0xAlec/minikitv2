

import { usePrivy } from "@privy-io/react-auth";
import sdk from '@farcaster/frame-sdk';
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import { useEffect, useState } from "react";

export const useAuthenticate = () => {
  const { ready, authenticated, user, createWallet } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    if (!isSDKLoaded) {
      sdk.actions.ready();
      setIsSDKLoaded(true);
    }
  }, [isSDKLoaded]);

  const login = async () => {
    const { nonce } = await initLoginToFrame();
    const result = await sdk.actions.signIn({ nonce: nonce });
    await loginToFrame({
        message: result.message,
      signature: result.signature,
    });

    if (
        authenticated &&
        ready &&
        user &&
        user.linkedAccounts.filter(
          (account) =>
            account.type === "wallet" && account.walletClientType === "privy",
        ).length === 0
      ) {
        createWallet();
      }
  };

  return { login, ready, authenticated, user };
};

