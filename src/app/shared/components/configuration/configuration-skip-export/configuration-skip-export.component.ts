import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomOperatorOption } from 'src/app/core/models/si/si-configuration/advanced-settings.model';

@Component({
  selector: 'app-configuration-skip-export',
  templateUrl: './configuration-skip-export.component.html',
  styleUrls: ['./configuration-skip-export.component.scss']
})
export class ConfigurationSkipExportComponent implements OnInit {

  @Input() skipExportForm: FormGroup;

  @Input() fyleFields: string[];

  customOperatorOptions = [
    {
      label: 'Is',
      value: CustomOperatorOption.Is
    },
    {
      label: 'Is empty',
      value: CustomOperatorOption.IsEmpty
    },
    {
      label: 'Is not empty',
      value: CustomOperatorOption.IsNotEmpty
    }
  ];

  customSelectOperatorOptions = [
    {
      label: 'is',
      value: 'iexact'
    },
    {
      label: 'is not',
      value: 'not_in'
    }
  ];

  showSecondCondition: boolean = false;

  constructor() { }

  showOrHideAddButton() {
    this.showSecondCondition = true;
  }

  ngOnInit(): void {
  }

}
