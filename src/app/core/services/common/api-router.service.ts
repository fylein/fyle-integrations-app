import { Injectable } from '@angular/core';
import { WorkspaceService } from './workspace.service';
import { HelperService } from './helper.service';
import { OrgService } from '../../services/org/org.service';
import { API_ROUTES, ApiAction } from '../../config/api-routes.config';
import { AppName } from '../../models/enum/enum.model';

@Injectable({ providedIn: 'root' })
export class ApiRouterService {
  constructor(
    private workspace: WorkspaceService,
    private orgService: OrgService,
    private helper: HelperService
  ) {}

  resolveEndpoint(action: ApiAction, appName?: AppName, pathParams?: { [key: string]: any }): string {
    const routes = API_ROUTES[action];
    const config = (appName && routes[appName]) || routes.default;

    // Get workspaceId and orgId from services
    const workspaceId = this.workspace.getWorkspaceId();
    const orgId = this.orgService.getOrgId();

    // Replace workspaceId and orgId placeholders
    let path = config.path
      .replace(/{workspaceId}/g, workspaceId)
      .replace(/{orgId}/g, orgId);

    // Replace any other placeholders from pathParams (e.g., {id}, {rank}, etc.)
    if (pathParams) {
      Object.keys(pathParams).forEach(key => {
        if (pathParams[key]) {
          path = path.replace(new RegExp(`{${key}}`, 'g'), pathParams[key]);
        }
      });
    }

    return path;
  }

  transformParams(action: ApiAction, params: any, appName?: AppName): any {
    const routes = API_ROUTES[action];
    const config = (appName && routes[appName]) || routes.default;

    if (config.transformParams) {
      return config.transformParams({ ...params });
    }

    return params;
  }

  getRoute(
    action: ApiAction,
    options?: { appName?: AppName; pathParams?: { [key: string]: any } },
    params: any = {}
  ): { endpoint: string; params: any } {
    return {
      endpoint: this.resolveEndpoint(action, options?.appName, options?.pathParams),
      params: this.transformParams(action, params, options?.appName)
    };
  }
}

