import { QbdDirectOnboardingState } from '../../enum/enum.model';

export type QbdOnboardingStepperMap = {
  [QbdDirectOnboardingState.YET_TO_START]: number;
  [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: number;
  [QbdDirectOnboardingState.CONNECTION]: number;
  [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: number;
  [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: number;
  [QbdDirectOnboardingState.INCORRECT_PASSWORD]: number;
  [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: number;
  [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: number;
  [QbdDirectOnboardingState.EXPORT_SETTINGS]: number;
  [QbdDirectOnboardingState.IMPORT_SETTINGS]: number;
  [QbdDirectOnboardingState.ADVANCED_SETTINGS]: number;
  [QbdDirectOnboardingState.COMPLETE]: number;
};
