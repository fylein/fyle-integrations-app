import { TravelPerkOnboardingState } from '../../enum/enum.model';

export type TravelPerkOnboardingStepperMap = {
  [TravelPerkOnboardingState.CONNECTION]: number;
  [TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS]: number;
  [TravelPerkOnboardingState.ADVANCED_SETTINGS]: number;
  [TravelPerkOnboardingState.COMPLETE]: number;
};
