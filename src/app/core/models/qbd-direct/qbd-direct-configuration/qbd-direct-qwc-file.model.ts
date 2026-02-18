import { FormControl } from "@angular/forms";

export enum QwcRegenerationFlowType {
    EXISTING = 'existing',
    NEW = 'new'
  }

export interface RegenerateQwcForm {
    nextStep: FormControl<QwcRegenerationFlowType | null>;
}
