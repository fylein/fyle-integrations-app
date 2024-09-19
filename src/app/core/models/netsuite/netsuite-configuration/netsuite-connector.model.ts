import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";

export interface NetsuiteConnector {
  ns_account_id: string;
  ns_token_id: string;
  ns_token_secret: string;
}

export interface NetsuiteConnectorGet extends NetsuiteConnector {
  workspace_id: number;
  created_at: Date;
  updated_at: Date;
  id: number;
}

export interface NetsuiteConnectorPost extends NetsuiteConnector {}


export class NetsuiteConnectorModel {

  static mapAPIResponseToFormGroup(netsuiiteConnection: NetsuiteConnectorGet | null): FormGroup {
    const isDisabled = netsuiiteConnection?.ns_account_id ? true : false;
    return new FormGroup({
      accountId: new FormControl({ value: netsuiiteConnection?.ns_account_id ? netsuiiteConnection?.ns_account_id : null, disabled: isDisabled }, Validators.required),
      tokenId: new FormControl(null, Validators.required),
      tokenSecret: new FormControl(null, Validators.required)
    });
  }

  static constructPayload(form: FormGroup): NetsuiteConnectorPost {
    return {
      ns_account_id: form.controls.accountId.value,
      ns_token_id: form.controls.tokenId.value,
      ns_token_secret: form.controls.tokenSecret.value
    };
  }
}


export interface NetsuiteSubsidiaryMappingPost {
  country_name: string | null,
  internal_id: string,
  subsidiary_name: string,
  workspace: number
}
