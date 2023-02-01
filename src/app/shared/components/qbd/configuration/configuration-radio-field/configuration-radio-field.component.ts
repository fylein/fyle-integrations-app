import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';

@Component({
  selector: 'app-configuration-radio-field',
  templateUrl: './configuration-radio-field.component.html',
  styleUrls: ['./configuration-radio-field.component.scss']
})
export class ConfigurationRadioFieldComponent implements OnInit {

  constructor() { }

  @Input() options: any;

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  ngOnInit(): void {

  }

}
