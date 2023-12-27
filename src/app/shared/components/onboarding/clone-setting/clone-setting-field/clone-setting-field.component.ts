import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-clone-setting-field',
  templateUrl: './clone-setting-field.component.html',
  styleUrls: ['./clone-setting-field.component.scss']
})
export class CloneSettingFieldComponent {

  @Input() label: string;

  @Input() iconSource: string;

  @Input() options: any[];

  @Input() placeholder: string;

  @Input() form: FormGroup;

  @Input() isFieldMandatory: boolean;

  @Input() formControllerName: string;

  @Input() dropdownDisplayKey: string;

  @Input() disabledOption: string;

  @Input() additionalClasses: string;

  @Input() inputType: InputType = InputType.DROPDOWN;

  InputType = InputType;

  constructor() { }

}
