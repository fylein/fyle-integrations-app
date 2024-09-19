import { FyleField } from "../enum/enum.model";
import type { SelectFormOption } from "./select-form-option.model";

export class EmployeeSettingModel {
    static getEmployeeFieldMappingOptions(): SelectFormOption[] {
        return [
            {
              label: 'Employee',
              value: FyleField.EMPLOYEE
            },
            {
              label: 'Vendor',
              value: FyleField.VENDOR
            }
          ];
    }
}
