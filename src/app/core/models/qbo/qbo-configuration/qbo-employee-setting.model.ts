import { UntypedFormGroup } from "@angular/forms";
import { AutoMapEmployeeOptions, FyleField } from "../../enum/enum.model";

export type EmployeeSettingWorkspaceGeneralSetting = {
  employee_field_mapping: FyleField,
  auto_map_employees: AutoMapEmployeeOptions
}

export type EmployeeSettingPost = {
  workspace_general_settings: EmployeeSettingWorkspaceGeneralSetting;
}

export type EmployeeSettingGet = {
  workspace_general_settings: EmployeeSettingWorkspaceGeneralSetting,
  workspace_id: number
}

export class QBOEmployeeSettingModel {
  static constructPayload(employeeSettingsForm: UntypedFormGroup): EmployeeSettingPost {
    const employeeSettingPayload: EmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value
      }
    };
    return employeeSettingPayload;
  }
}
