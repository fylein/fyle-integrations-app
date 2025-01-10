import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { Travelperk, TravelperkConfiguration, TravelperkDestinationAttribuite } from '../../models/travelperk/travelperk.model';
import { ApiService } from '../common/api.service';
import { OrgService } from '../org/org.service';
import { TravelperkAdvancedSettingGet, TravelperkAdvancedSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { TravelperkPaymentProfileSettingResponse, TravelperkPaymentProfileSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';

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
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/`, {}).pipe(
      catchError(error => {
        if (error.status === 400 && error.error?.message?.includes('token expired')) {
          error.error.is_expired = true;
        }
        return throwError(() => error);
      })
    );
  }

  @Cacheable()
  getTravelperkTokenHealth(): Observable<{}> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/token_health/`, {}).pipe(
      catchError(error => {
        if (error.status === 400) {
          error.error.is_expired = true;
        }
        return throwError(() => error);
      })
    );
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

  @Cacheable({
    cacheBusterObserver: travelPerkConfigurationCache$
  })
  syncPaymentProfile(): Observable<{}> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/sync_payment_profile/`,  {});
  }

  @Cacheable({
    cacheBusterObserver: travelPerkConfigurationCache$
  })
  syncCategories(): Observable<{}> {
    return this.apiService.post(`/orgs/${this.orgId}/sync_categories/`,  {});
  }

  getTravelperkPaymentProfileMapping(limit: number): Observable<TravelperkPaymentProfileSettingResponse> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/profile_mappings/`, {
      limit: limit,
      offset: 0
    });
  }

  postTravelperkPaymentProfileMapping(travelperkPaymentProfileMappingPayload: TravelperkPaymentProfileSettingPost[]): Observable<TravelperkPaymentProfileSettingResponse> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/profile_mappings/`, travelperkPaymentProfileMappingPayload);
  }

  getTravelperkAdvancedSettings(): Observable<TravelperkAdvancedSettingGet> {
    return this.apiService.get(`/orgs/${this.orgId}/travelperk/advanced_settings/`, {});
  }

  postTravelperkAdvancedSettings(travelperkAdvancedSettingPayload: TravelperkAdvancedSettingPost): Observable<TravelperkAdvancedSettingGet> {
    return this.apiService.post(`/orgs/${this.orgId}/travelperk/advanced_settings/`, travelperkAdvancedSettingPayload);
  }

  getCategories(): Observable<TravelperkDestinationAttribuite[]> {
    return this.apiService.get(`/orgs/${this.orgId}/categories/`,  {
      attribute_type: 'CATEGORY'
    });
  }
}
