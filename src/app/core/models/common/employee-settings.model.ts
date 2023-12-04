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
}
