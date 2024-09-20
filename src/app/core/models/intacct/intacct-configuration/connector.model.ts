import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SageIntacctCredential } from "../db/sage-credentials.model";

export type LocationEntityPost = {
  location_entity_name: string,
  destination_id: string,
  country_name: null | string,
  workspace: number
}

export class IntacctConnectorModel {

  static mapAPIResponseToFormGroup(sageIntacctConnection: SageIntacctCredential | null): FormGroup {
    const isDisabled = sageIntacctConnection?.si_company_id ? true : false;
    return new FormGroup({
      companyID: new FormControl({value: sageIntacctConnection?.si_company_id ? sageIntacctConnection?.si_company_id : null, disabled: isDisabled}, Validators.required),
      userID: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    });
  }

  static constructPayload(form: FormGroup): SageIntacctCredential {
    return {
      si_user_id: form.get('userID')?.value,
      si_company_id: form.get('companyID')?.value,
      si_user_password: form.get('userPassword')?.value
    };
  }
}