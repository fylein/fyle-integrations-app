import { environment } from "src/environments/environment";

export interface QBOConnector {
  code: string;
  realm_id: string;
}

export interface QBOConnectorPost extends QBOConnector {
  redirect_uri: string;
}

export class QBOConnectorModel {
  static constructPayload(code: string, realmId: string): QBOConnectorPost {
    return {
      code,
      realm_id: realmId,
      redirect_uri: `${environment.qbo_oauth_redirect_uri}`
    };
  }
}
