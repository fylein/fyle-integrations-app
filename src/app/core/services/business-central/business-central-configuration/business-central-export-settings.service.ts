import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable, Subject } from 'rxjs';
import { BusinessCentralExportSettingFormOption, BusinessCentralExportSettingGet, BusinessCentralExportSettingPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-export-setting.model';
import { HelperService } from '../../common/helper.service';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { BusinessCentralDestinationAttributes } from 'src/app/core/models/business-central/db/business-central-destination-attribute.model';
import { BusinessCentralExportType, CCCExpenseState, ExpenseGroupedBy, ExpenseState, ExportDateType } from 'src/app/core/models/enum/enum.model';

const businessCentralExportSettingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralExportSettingsService {

  private readonly workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  @Cacheable({
    cacheBusterObserver: businessCentralExportSettingCache$
  })
  getExportSettings(): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.get(`workspaces/${this.workspaceId}/export_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: businessCentralExportSettingCache$
  })
  postExportSettings(exportSettingsPayload: BusinessCentralExportSettingPost): Observable<BusinessCentralExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }
}
