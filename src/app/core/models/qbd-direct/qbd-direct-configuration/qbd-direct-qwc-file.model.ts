import { FormControl } from "@angular/forms";

export enum QwcRegenerationFlowType {
  EXISTING = 'existing',
  NEW = 'new'
}

export interface RegenerateQwcForm {
  nextStep: FormControl<QwcRegenerationFlowType | null>;
}

export enum QwcFlowState {
  PREREQUISITES,
  DOWNLOAD,
  DOWNLOAD_IN_PROGRESS,
  DOWNLOAD_DONE,
  SETUP_CONNECTION,
  CONNECTION_IN_PROGRESS,
  CONNECTION_DONE
}

export type QwcRouteState = {
  goToPrerequisites: boolean;
}
