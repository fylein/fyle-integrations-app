import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { HelperService } from '../../common/helper.service';
import type { BusinessCentralAdvancedSettingsGet, BusinessCentralAdvancedSettingsPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-advanced-settings.model';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { ConditionField, EmailOption, ExpenseFilter, ExpenseFilterPost, ExpenseFilterResponse } from 'src/app/core/models/common/advanced-settings.model';

const businessCentralAdvancedSettingGetCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralAdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: businessCentralAdvancedSettingGetCache$
  })
  getAdvancedSettings(): Observable<BusinessCentralAdvancedSettingsGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralAdvancedSettingGetCache$
  })
  postAdvancedSettings(advancedSettingsPayload: BusinessCentralAdvancedSettingsPost): Observable<BusinessCentralAdvancedSettingsGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingsPayload);
  }

}
