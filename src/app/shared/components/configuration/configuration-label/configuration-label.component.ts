import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { QBDExportSettingFormOption } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';

@Component({
  selector: 'app-configuration-label',
  templateUrl: './configuration-label.component.html',
  styleUrls: ['./configuration-label.component.scss']
})
export class ConfigurationLabelComponent implements OnInit {

  @Input() labelValue: QBDExportSettingFormOption;

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  constructor() { }

  ngOnInit(): void {
  }

}
