import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CacheBuster, Cacheable } from 'ts-cacheable';
import { ApiService } from '../../common/api.service';
import { WorkspaceService } from '../../common/workspace.service';
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AutoMapEmployeeOptions, EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { brandingConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

const employeeSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class QboEmployeeSettingsService {

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  private translocoService: TranslocoService = inject(TranslocoService);

  getAutoMapEmployeeOptions(): SelectFormOption[] {
    return [
        {
          value: AutoMapEmployeeOptions.NAME,
          label: this.translocoService.translate('services.qboEmployeeSettings.nameToQboDisplayName', { brandName: brandingConfig.brandName })
        },
        {
          value: AutoMapEmployeeOptions.EMAIL,
          label: this.translocoService.translate('services.qboEmployeeSettings.emailToQboEmail', { brandName: brandingConfig.brandName })
        },
        {
          value: AutoMapEmployeeOptions.EMPLOYEE_CODE,
          label: this.translocoService.translate('services.qboEmployeeSettings.employeeCodeToQboDisplayName', { brandName: brandingConfig.brandName })
        }
      ];
  }

  static parseAPIResponseToFormGroup(employee_settings: QBOEmployeeSettingGet): FormGroup {
    return new FormGroup({
        employeeMapping: new FormControl(employee_settings.workspace_general_settings?.employee_field_mapping),
        autoMapEmployee: new FormControl(employee_settings.workspace_general_settings?.auto_map_employees)
    });
  }

  static constructPayload(employeeSettingsForm: FormGroup): QBOEmployeeSettingPost {
    const employeeSettingPayload: QBOEmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value || EmployeeFieldMapping.VENDOR,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value || null
      }
    };
    return employeeSettingPayload;
  }

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
