import { XeroOnboardingState } from '../../enum/enum.model';

export type XeroOnboardingStepperMap = {
  [XeroOnboardingState.CONNECTION]: number;
  [XeroOnboardingState.TENANT_MAPPING]: number;
  [XeroOnboardingState.EXPORT_SETTINGS]: number;
  [XeroOnboardingState.IMPORT_SETTINGS]: number;
  [XeroOnboardingState.ADVANCED_CONFIGURATION]: number;
  [XeroOnboardingState.COMPLETE]: number;
  [XeroOnboardingState.CLONE_SETTINGS]: number;
};
