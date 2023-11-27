import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { EmailOptions } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';

@Component({
  selector: 'app-configuration-schedule-export',
  templateUrl: './configuration-schedule-export.component.html',
  styleUrls: ['./configuration-schedule-export.component.scss']
})
export class ConfigurationScheduleExportComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() formControllerName: string;

  @Input() label: string;

  @Input() isFieldMandatory: boolean;

  @Input() subLabel: string;

  @Input() options: any;

  @Input() placeholder: string;

  @Input() adminEmails: EmailOptions[];

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() showClearIcon: boolean;

  @Input() isEmailPresent: boolean = false;

  meridiemOption: string[] = ['AM', 'PM'];

  timeOption: string[] = ['01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];

  constructor() { }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  ngOnInit(): void {
  }

}
