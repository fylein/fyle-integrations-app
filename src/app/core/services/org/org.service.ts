import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { EmailOption } from '../../models/bamboo-hr/bamboo-hr.model';
import { AppName, AppUrl } from '../../models/enum/enum.model';
import { GeneratedToken, Org } from '../../models/org/org.model';
import { ApiService } from '../common/api.service';
import { StorageService } from '../common/storage.service';
import { HelperService } from '../common/helper.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private storageService: StorageService,
    private helper: HelperService
  ) {
    helper.setBaseApiURL(AppUrl.INTEGRATION);
   }

  getOrgId(): string {
    return this.storageService.get('orgId');
  }

  createOrg(): Observable<Org> {
    this.helper.setBaseApiURL(AppUrl.INTEGRATION);
    return this.apiService.patch('/orgs/', {});
  }

  getOrgs(orgId: string | undefined): Observable<Org> {
    this.helper.setBaseApiURL(AppUrl.INTEGRATION);
    return this.apiService.get(`/orgs/`, {
      org_id: orgId
    });
  }

  getCachedOrg(): Org {
    return this.storageService.get('org');
  }

  createWorkatoWorkspace(): Observable<{}> {
    return this.apiService.patch(`/orgs/${this.getOrgId()}/workato_workspace/`, {});
  }

  connectFyle(appName?: AppName): Observable<{}> {
    const payload: {app_name?: AppName} = {};

    if (appName) {
      payload.app_name = appName;
    }

    return this.apiService.post(`/orgs/${this.getOrgId()}/connect_fyle/`, payload);
  }

  getAdditionalEmails(): Observable<EmailOption[]> {
    const baseApiUrl = `${this.helper.apiBaseUrl}/${environment.production ? 'integrations-api/': ''}api`;
    return this.apiService.get(`/orgs/${this.getOrgId()}/admins/`, {}, baseApiUrl);
  }

  connectSendgrid(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.getOrgId()}/sendgrid_connection/`, {});
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  generateToken(managedUserId: string): Observable<GeneratedToken> {
    return this.apiService.get(`/orgs/${this.getOrgId()}/generate_token/`, {
      managed_user_id: managedUserId
    });
  }
}
