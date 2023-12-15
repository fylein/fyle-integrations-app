import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { Observable, Subject } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { Sage300AdvancedSettingGet, Sage300AdvancedSettingPost } from 'src/app/core/models/sage300/sage300-configuration/sage300-advanced-settings.model';
import { ConditionField, EmailOption, ExpenseFilterPost, ExpenseFilterResponse, ExpenseFilter } from 'src/app/core/models/common/advanced-settings.model';

const sage300AdvancedSettingGetCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class Sage300AdvancedSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: sage300AdvancedSettingGetCache
  })
  getAdvancedSettings(): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: sage300AdvancedSettingGetCache
  })
  postAdvancedSettings(advancedSettingsPayload: Sage300AdvancedSettingPost): Observable<Sage300AdvancedSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/advanced_settings/`, advancedSettingsPayload);
  }

}
