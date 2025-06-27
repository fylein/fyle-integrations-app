import { Injectable } from "@angular/core";
import { FyleField } from "../../models/enum/enum.model";
import { SelectFormOption } from "../../models/common/select-form-option.model";

@Injectable({
    providedIn: 'root'
})
export class EmployeeSettingsService {
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
