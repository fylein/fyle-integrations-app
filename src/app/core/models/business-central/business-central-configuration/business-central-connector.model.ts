import { environment } from "src/environments/environment";

export type BusinessCentralConnector = {
  code: string;
  callback_url: string;
  workspace: number
}

export interface BusinessCentralConnectorPost extends BusinessCentralConnector {}

export class BusinessCentralConnectorModel {
  static constructPayload(code: string, workspaceId: number): BusinessCentralConnectorPost {
    return {
      code,
      callback_url: `${environment.business_central_oauth_redirect_uri}`,
      workspace: workspaceId
    };
  }
}