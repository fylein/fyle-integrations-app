import { environment } from "src/environments/environment";

export type BusinessCentralConnector = {
  code: string;
  callback_url: string;
}

export interface BusinessCentralConnectorPost extends BusinessCentralConnector {}

export class BusinessCentralConnectorModel {
  static constructPayload(code: string): BusinessCentralConnectorPost {
    return {
      code,
      callback_url: `${environment.business_central_oauth_redirect_uri}`
    };
  }
}