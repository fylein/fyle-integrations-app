import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { TravelperkPaymentProfileSettingGet } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { TravelperkFormOption } from 'src/app/core/models/travelperk/travelperk.model';

@Component({
  selector: 'app-configuration-mapping-fields',
  templateUrl: './configuration-mapping-fields.component.html',
  styleUrls: ['./configuration-mapping-fields.component.scss']
})
export class ConfigurationMappingFieldsComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() sourceFieldText: string;

  @Input() DestinationFieldText: string;

  @Input() sourceFieldPlaceholderText: string;

  @Input() DestinationPlaceholderFieldText: string;

  @Input() SourceFields: string[] | TravelperkFormOption[];

  @Input() DestinationFields: string[] | TravelperkPaymentProfileSettingGet[];

  @Input() isSourceDisabled: boolean;

  @Input() isDestinationDisabled: boolean;

  @Input() noOfFieldsToShow: number = 0;

  @Input() showCrossIcon: boolean;

  @Input() appName: string;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  get expenseFieldsGetter() {
    return this.form.get('expenseFields') as FormArray;
  }

  showOrHideLoadMoreButton() {
    if (this.form.controls.expenseFields.value.length > this.noOfFieldsToShow) {
      return true;
    }
    return false;
  }

  addExpenseFields() {
    this.noOfFieldsToShow = this.form.controls.expenseFields.value.length;
  }

  hasDuplicateOption(formGroup: AbstractControl, index: number, controlName: string): boolean {
    return (formGroup as FormGroup).controls[controlName].valid;
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.user_role.patchValue('');
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
