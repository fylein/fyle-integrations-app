import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';

@Component({
  selector: 'app-configuration-label',
  templateUrl: './configuration-label.component.html',
  styleUrls: ['./configuration-label.component.scss']
})
export class ConfigurationLabelComponent implements OnInit {

  @Input() expensesGroup: QBDExportSettingFormOption;

  @Input() form: FormGroup;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
