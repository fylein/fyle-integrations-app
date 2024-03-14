import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";

export type NetsuiteConnector = {
  ns_account_id: string;
}

export interface NetsuiteConnectorPost extends NetsuiteConnector {
    ns_token_id: string;
    ns_token_secret: string;
}


export class NetsuiteConnectorModel {
  static constructPayload(form: FormGroup): NetsuiteConnectorPost {
    return {
      ns_account_id: form.value.accountId,
      ns_token_id: form.value.tokenId,
      ns_token_secret: form.value.tokenSecret
    };
  }
}
