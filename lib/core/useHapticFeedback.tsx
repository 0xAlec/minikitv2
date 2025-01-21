import { useMiniKit } from "../config/MiniKitProvider";
import { hapticFeedback, hapticFeedbackImpactOccurred, hapticFeedbackNotificationOccurred, hapticFeedbackSelectionChanged } from '@telegram-apps/sdk';

export const useHapticFeedback = () => {
    const { platform } = useMiniKit();

    if (platform === 'telegram'){
        return {
            isSupported: hapticFeedback.isSupported(),
            impactOccured: (style: 'light' | 'medium' | 'heavy') => {
                hapticFeedbackImpactOccurred(style);
            },
            notificationOccured: (type: 'success' | 'warning' | 'error') => {
                hapticFeedbackNotificationOccurred(type);
            },
            selectionChanged: () => {
                hapticFeedbackSelectionChanged();
            }
        }
    }

    return {
        isSupported: false,
        impactOccured: () => {
            // do nothing
        },
        notificationOccured: () => {
            // do nothing
        },
        selectionChanged: () => {
            // do nothing
        }
    }

}