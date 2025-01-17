import sdk from '@farcaster/frame-sdk';
import {
  init,
  retrieveLaunchParams,
  miniApp,
  openLink,
} from '@telegram-apps/sdk';
import { User } from './types';

export class MiniSDK {
  private platform: 'telegram' | 'farcaster' | 'unknown' = 'unknown';
  public initDataRaw: string | undefined;

  private constructor() {}

  public static async init(): Promise<MiniSDK> {
    const instance = new MiniSDK();

    // Try to initialize Telegram
    try {
      init();
      instance.platform = 'telegram';
      const { initDataRaw } = retrieveLaunchParams();
      instance.initDataRaw = initDataRaw;
      return instance;
    } catch (err) {
      console.error(err);
    }

    // Try to initialize Warpcast
    try {
      if (sdk) {
        const context = await sdk.context;

        if (!context) {
          throw new Error('No context found');
        }
        instance.platform = 'farcaster';
      }
    } catch (err) {
      console.error(err);
    }

    return instance;
  }

  public async Ready() {
    if (this.platform === 'telegram') {
      if (miniApp.mount.isAvailable()) {
        miniApp.mount();
        miniApp.isMounted();
        if (miniApp.ready.isAvailable()) {
          miniApp.ready();
        }
      }
      return;
    }

    if (this.platform === 'farcaster') {
      sdk.actions.ready();
    }
  }

  // Returns the platform name
  public GetPlatform() {
    return this.platform;
  }

  // Returns the user from the context
  public async GetUser(): Promise<User | undefined> {
    if (this.platform === 'telegram') {
      const { initData } = retrieveLaunchParams();
      return initData?.user;
    } else if (this.platform === 'farcaster') {
      return await sdk.context;
    }
    return undefined;
  }

  // Open a link in the browser
  public OpenLink(url: string) {
    if (this.platform === 'telegram' && openLink.isAvailable()) {
      openLink(url, {
        tryBrowser: 'chrome',
      });
    }
  }
}
