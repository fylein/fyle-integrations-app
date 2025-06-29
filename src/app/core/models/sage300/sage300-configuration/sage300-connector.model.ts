import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Sage300Credential } from "../db/sage300-credentials.model";

export type Sage300ConnectorModel = {
  sage300SetupForm: FormGroup;
  isSage300Connected: boolean;
}

export class Sage300ConnectorFormModel {

  static mapAPIResponseToFormGroup(sage300Connection: Sage300Credential | null): FormGroup {
    const isDisabled = sage300Connection?.identifier ? true : false;
    return new FormGroup({
      companyID: new FormControl({value: sage300Connection?.identifier ? sage300Connection?.identifier : null, disabled: isDisabled}, Validators.required),
      userID: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    });
  }
}