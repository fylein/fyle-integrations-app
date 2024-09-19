import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import type { AppName } from 'src/app/core/models/enum/enum.model';
import type { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';

@Component({
  selector: 'app-configuration-schedule-export',
  templateUrl: './configuration-schedule-export.component.html',
  styleUrls: ['./configuration-schedule-export.component.scss']
})
export class ConfigurationScheduleExportComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() appName: AppName;

  @Input() iconPath: string;

  @Input() formControllerName: string;

  @Input() label: string;

  @Input() isFieldMandatory: boolean;

  @Input() subLabel: string;

  @Input() options: any;

  @Input() placeholder: string;

  @Input() adminEmails: QBDEmailOptions[];

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() isEmailPresent: boolean = false;

  readonly brandingConfig = brandingConfig;

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
