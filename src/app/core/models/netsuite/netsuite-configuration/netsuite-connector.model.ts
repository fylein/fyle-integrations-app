import { environment } from "src/environments/environment";

export type NetsuiteConnector = {
  ns_account_id: string;
}

export interface NetsuiteConnectorPost extends NetsuiteConnector {
    ns_token_id: string;
    ns_token_secret: string;
}


export class NetsuiteConnectorModel {
  static constructPayload(accountId: string, tokenId: string, tokenSecret: string): NetsuiteConnectorPost {
    return {
      ns_account_id: accountId,
      ns_token_id: tokenId,
      ns_token_secret: tokenSecret
    };
  }
}


export type NetsuiteSubsidiaryMappingPost = {
  country_name: string | null,
  internal_id: string,
  subsidiary_name: string,
  workspace: number
}
