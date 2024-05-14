import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";

export type NetsuiteConnector = {
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
    return new FormGroup({
      accountId: new FormControl(netsuiiteConnection?.ns_account_id ? netsuiiteConnection?.ns_account_id : '', Validators.required),
      tokenId: new FormControl('', Validators.required),
      tokenSecret: new FormControl('', Validators.required)
    });
  }

  static constructPayload(form: FormGroup): NetsuiteConnectorPost {
    return {
      ns_account_id: form.value.accountId,
      ns_token_id: form.value.tokenId,
      ns_token_secret: form.value.tokenSecret
    };
  }
}


export type NetsuiteSubsidiaryMappingPost = {
  country_name: string | null,
  internal_id: string,
  subsidiary_name: string,
  workspace: number
}
