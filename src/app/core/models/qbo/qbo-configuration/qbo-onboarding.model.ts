import { QBOOnboardingState } from '../../enum/enum.model';

export type QBOOnboardingStepperMap = {
  [QBOOnboardingState.CONNECTION]: number;
  [QBOOnboardingState.EXPORT_SETTINGS]: number;
  [QBOOnboardingState.IMPORT_SETTINGS]: number;
  [QBOOnboardingState.ADVANCED_CONFIGURATION]: number;
  [QBOOnboardingState.COMPLETE]: number;
  [QBOOnboardingState.CLONE_SETTINGS]: number;
};
