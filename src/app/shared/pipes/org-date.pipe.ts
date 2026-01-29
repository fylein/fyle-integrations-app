import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrgSettingsService } from 'src/app/core/services/common/org-settings.service';

@Pipe({
  name: 'orgDate',
  standalone: false
})
export class OrgDatePipe implements PipeTransform {
  constructor(
    private orgSettingsService: OrgSettingsService,
    private datePipe: DatePipe
  ) {}

  transform(value: Date | string | number | null | undefined): string | null {
    const dateFormat = this.orgSettingsService.dateFormat();
    return this.datePipe.transform(value, dateFormat);
  }
}

