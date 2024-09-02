import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-clone-setting-field',
  templateUrl: './clone-setting-field.component.html',
  styleUrls: ['./clone-setting-field.component.scss']
})
export class CloneSettingFieldComponent implements OnInit, OnChanges {

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

  @Input() tooltipText: string;

  @Input() inputType: InputType = InputType.DROPDOWN;

  @Input() isDisabled: boolean;

  @Input() isMultiLineOption: boolean;

  InputType = InputType;

  constructor() { }

  ngOnInit() {
    if (this.isDisabled) {
      this.form.get(this.formControllerName)?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled?.currentValue) {
      this.form.get(this.formControllerName)?.disable();
    } else if (!changes.disabled?.currentValue) {
      this.form.get(this.formControllerName)?.enable();
    }
  }

}
