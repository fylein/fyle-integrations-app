import { FormControl } from "@angular/forms";

export enum NextStepOption {
    EXISTING = 'existing',
    NEW = 'new'
  }

export interface RegenerateQwcForm {
    nextStep: FormControl<NextStepOption | null>;
}
