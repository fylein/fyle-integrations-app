import { AutoMapEmployeeOptions, EmployeeFieldMapping, FyleField } from "../../enum/enum.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { brandingConfig } from "src/app/branding/branding-config";
import { FormControl, FormGroup, Validators } from "@angular/forms";

export type QBOEmployeeSettingWorkspaceGeneralSetting = {
  employee_field_mapping: EmployeeFieldMapping,
  auto_map_employees: AutoMapEmployeeOptions
}

export type QBOEmployeeSettingPost = {
  workspace_general_settings: QBOEmployeeSettingWorkspaceGeneralSetting;
}

export type QBOEmployeeSettingGet = {
  workspace_general_settings: QBOEmployeeSettingWorkspaceGeneralSetting,
  workspace_id: number
}

export class QBOEmployeeSettingModel {
  static getAutoMapEmployeeOptions(): SelectFormOption[] {
    return [
        {
          value: AutoMapEmployeeOptions.NAME,
          label: `${brandingConfig.brandName} Name to QuickBooks Online Display name`
        },
        {
          value: AutoMapEmployeeOptions.EMAIL,
          label: `${brandingConfig.brandName} Email to QuickBooks Online Email`
        },
        {
          value: AutoMapEmployeeOptions.EMPLOYEE_CODE,
          label: `${brandingConfig.brandName} Employee Code to QuickBooks Online Display name`
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
}
