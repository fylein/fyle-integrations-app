import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrgSettingsService } from 'src/app/core/services/common/org-settings.service';

@Pipe({
  name: 'orgTime',
  standalone: false
})
export class OrgTimePipe implements PipeTransform {
  constructor(
    private orgSettingsService: OrgSettingsService,
    private datePipe: DatePipe
  ) {}

  transform(value: Date | string | number | null | undefined): string | null {
    const timeFormat = this.orgSettingsService.timeFormat();
    return this.datePipe.transform(value, timeFormat);
  }
}

