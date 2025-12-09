import { Injectable } from '@angular/core';
import { FyleField } from '../../models/enum/enum.model';
import { SelectFormOption } from '../../models/common/select-form-option.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSettingsService {
  constructor(private translocoService: TranslocoService) {}

  getEmployeeFieldMappingOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.employeeSettings.employee'),
        value: FyleField.EMPLOYEE,
      },
      {
        label: this.translocoService.translate('services.employeeSettings.vendor'),
        value: FyleField.VENDOR,
      },
    ];
  }
}
