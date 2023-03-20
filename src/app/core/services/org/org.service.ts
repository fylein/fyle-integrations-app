import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { EmailOption } from '../../models/bamboo-hr/bamboo-hr.model';
import { AppName } from '../../models/enum/enum.model';
import { GeneratedToken, Org } from '../../models/org/org.model';
import { ApiService } from '../core/api.service';
import { StorageService } from '../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  getOrgId(): string {
    return this.storageService.get('orgId');
  }

  createOrg(): Observable<Org> {
    return this.apiService.patch('/orgs/', {});
  }

  getOrgs(orgId: string | undefined): Observable<Org> {
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
    return this.apiService.get(`/orgs/${this.getOrgId()}/admins/`, {});
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
