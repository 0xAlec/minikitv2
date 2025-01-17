

import { usePrivy } from "@privy-io/react-auth";
import sdk from '@farcaster/frame-sdk';
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import type { SignInOptions } from "@farcaster/frame-sdk";
import { useMiniKitProviderContext } from "../config/MiniKitProvider";
export const useAuthenticate = ({
  signInOptions,
}: {
  signInOptions?: SignInOptions;
} = {}) => {
  const { ready, authenticated, user, createWallet } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();
  const { platform } = useMiniKitProviderContext();
  
  const login = async () => {
    if (!ready) {
      return;
    }

    if (platform === 'farcaster') {
      const { nonce } = await initLoginToFrame();
      const result = await sdk.actions.signIn(signInOptions || { nonce: nonce });
      await loginToFrame({
        message: result.message,
        signature: result.signature,
      });
    }

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

  return { login, authenticated, user };
};

