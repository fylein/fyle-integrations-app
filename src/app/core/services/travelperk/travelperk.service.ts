import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { Travelperk, TravelperkConfiguration } from '../../models/travelperk/travelperk.model';
import { ApiService } from '../common/api.service';
import { OrgService } from '../org/org.service';
import { TravelperkAdvancedSettingGet, TravelperkAdvancedSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { TravelperkPaymentProfileSettingGetPaginator, TravelperkPaymentProfileSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';

const travelPerkConfigurationCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class TravelperkService {

  orgId: string = this.orgService.getOrgId();

  constructor(
    private apiService: ApiService,
    private orgService: OrgService
  ) { }

  createFolder(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/folder/`, {});
  }

  uploadPackage(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/packages/`, {});
  }

  getTravelperkData(): Observable<Travelperk> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/`, {});
  }

  connectTravelperk(): Observable<{}>{
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/travelperk_connection/`, {});
  }

  connectAwsS3(): Observable<{}>{
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/s3_connection/`, {});
  }

  @Cacheable({
    cacheBusterObserver: travelPerkConfigurationCache$
  })
  getConfigurations(): Observable<TravelperkConfiguration> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/configurations/`, {
      org_id: this.orgId
    });
  }

  @CacheBuster({
    cacheBusterNotifier: travelPerkConfigurationCache$
  })
  postConfigurations(): Observable<TravelperkConfiguration> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/configurations/`, {
      org: this.orgId
    });
  }

  @CacheBuster({
    cacheBusterNotifier: travelPerkConfigurationCache$
  })
  patchConfigurations(recipe_status: boolean): Observable<TravelperkConfiguration> {
    return this.apiService.patch(`/orgs/${this.orgId}/travelperk/recipe_status/`, {
      org_id: this.orgId,
      recipe_status: recipe_status
    });
  }

  connect(code: string, orgId: string): Observable<{}> {
    return this.apiService.post(`/orgs/${orgId}/travelperk/connect/`, { code });
  }

  disconnect(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/disconnect/`, {});
  }

  syncPaymentProfile(): Observable<{}> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/sync_payment_profile/`,  {});
  }

  getTravelperkPaymentProfileMapping(limit: number): Observable<TravelperkPaymentProfileSettingGetPaginator> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/profile_mappings/`, {
      limit: limit,
      offset: 0
    });
  }

  postTravelperkPaymentProfileMapping(travelperkPaymentProfileMappingPayload: TravelperkPaymentProfileSettingPost[]): Observable<TravelperkPaymentProfileSettingGetPaginator> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/profile_mappings/`, travelperkPaymentProfileMappingPayload);
  }

  getTravelperkAdvancedSettings(): Observable<TravelperkAdvancedSettingGet> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/advance_settings/`, {});
  }

  postTravelperkAdvancedSettings(travelperkAdvancedSettingPayload: TravelperkAdvancedSettingPost): Observable<TravelperkAdvancedSettingGet> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/advance_settings/`, travelperkAdvancedSettingPayload);
  }
}
