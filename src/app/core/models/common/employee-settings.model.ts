import { brandingConfig } from "src/app/branding/branding-config";
import { AutoMapEmployeeOptions, FyleField } from "../enum/enum.model";
import { SelectFormOption } from "./select-form-option.model";

export class EmployeeSettingModel {
    static getEmployeeFieldMappingOptions(): SelectFormOption[] {
        return [
            {
              label: 'Employees',
              value: FyleField.EMPLOYEE
            },
            {
              label: 'Vendor',
              value: FyleField.VENDOR
            }
          ];
    }
}
