import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import type { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';

@Component({
  selector: 'app-configuration-radio-field',
  templateUrl: './configuration-radio-field.component.html',
  styleUrls: ['./configuration-radio-field.component.scss']
})
export class ConfigurationRadioFieldComponent implements OnInit {

  constructor() { }

  @Input() options: QBDExportSettingFormOption[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  ngOnInit(): void {
  }

}
