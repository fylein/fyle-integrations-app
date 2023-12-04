import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { EmployeeSettingGet, EmployeeSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

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
  getEmployeeSettings(): Observable<EmployeeSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: employeeSettingsCache$
  })
  postEmployeeSettings(employeeSettingsPayload: EmployeeSettingPost): Observable<EmployeeSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/map_employees/`, employeeSettingsPayload);
  }

  getDistinctQBODestinationAttributes(attributeTypes: string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/qbo/qbo_attributes/`, {
      attribute_type__in: attributeTypes
    });
  }
}
