import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() options: QBDExportSettingFormOption[] | string[];

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;


  meridiemOption: string[] = ['AM', 'PM'];

  timeOption: string[] = ['1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];


  constructor() { }

  ngOnInit(): void {}
}