import { environment } from 'src/environments/environment';

export type XeroConnector = {
  code: string;
};

export interface XeroConnectorPost extends XeroConnector {
  redirect_uri: string;
}

export class XeroConnectorModel {
  static constructPayload(code: string): XeroConnectorPost {
    return {
      code,
      redirect_uri: `${environment.xero_oauth_redirect_uri}`,
    };
  }
}
