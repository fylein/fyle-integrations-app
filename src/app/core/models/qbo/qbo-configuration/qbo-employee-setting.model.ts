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
