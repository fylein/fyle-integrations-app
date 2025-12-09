import { BusinessCentralOnboardingState } from '../../enum/enum.model';

export type BusinessCentralOnboardingStepperMap = {
  [BusinessCentralOnboardingState.CONNECTION]: number;
  [BusinessCentralOnboardingState.COMPANY_SELECTION]: number;
  [BusinessCentralOnboardingState.EXPORT_SETTINGS]: number;
  [BusinessCentralOnboardingState.IMPORT_SETTINGS]: number;
  [BusinessCentralOnboardingState.ADVANCED_SETTINGS]: number;
  [BusinessCentralOnboardingState.COMPLETE]: number;
};
