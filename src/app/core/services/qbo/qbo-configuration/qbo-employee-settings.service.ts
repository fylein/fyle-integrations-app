import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import type { ApiService } from '../../common/api.service';
import type { WorkspaceService } from '../../common/workspace.service';
import type { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import type { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

const employeeSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboEmployeeSettingsService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: employeeSettingsCache$
  })
  getEmployeeSettings(): Observable<QBOEmployeeSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: employeeSettingsCache$
  })
  postEmployeeSettings(employeeSettingsPayload: QBOEmployeeSettingPost): Observable<QBOEmployeeSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, employeeSettingsPayload);
  }

  getDistinctQBODestinationAttributes(attributeTypes: string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/qbo_attributes/`, {
      attribute_type__in: attributeTypes
    });
  }
}
