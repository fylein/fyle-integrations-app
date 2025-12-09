import { IntacctOnboardingState } from '../../enum/enum.model';

export type IntacctOnboardingStepperMap = {
  [IntacctOnboardingState.CONNECTION]: number;
  [IntacctOnboardingState.LOCATION_ENTITY]: number;
  [IntacctOnboardingState.EXPORT_SETTINGS]: number;
  [IntacctOnboardingState.IMPORT_SETTINGS]: number;
  [IntacctOnboardingState.ADVANCED_CONFIGURATION]: number;
  [IntacctOnboardingState.COMPLETE]: number;
};
