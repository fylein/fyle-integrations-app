import { FyleField } from "../enum/enum.model";
import { SelectFormOption } from "./select-form-option.model";

// TODO: Move to Service
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
