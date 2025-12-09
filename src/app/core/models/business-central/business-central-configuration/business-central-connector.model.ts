import { environment } from 'src/environments/environment';
import { BusinessCentralCompanyPost } from '../db/business-central-workspace.model';

export type BusinessCentralConnector = {
  code: string;
  callback_url: string;
  workspace: number;
};

export interface BusinessCentralConnectorPost extends BusinessCentralConnector {}

export class BusinessCentralConnectorModel {
  static constructPayload(code: string, workspaceId: number): BusinessCentralConnectorPost {
    return {
      code,
      callback_url: `${environment.business_central_oauth_redirect_uri}`,
      workspace: workspaceId,
    };
  }

  static constructCompanyPost(
    businessCentralselectedCompanyId: string,
    businessCentralselectedCompanyName: string,
  ): BusinessCentralCompanyPost {
    return {
      company_id: businessCentralselectedCompanyId,
      company_name: businessCentralselectedCompanyName,
    };
  }
}
