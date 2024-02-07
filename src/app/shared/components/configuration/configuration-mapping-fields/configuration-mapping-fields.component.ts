import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { TravelperkPaymentProfileSettingGet } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';

@Component({
  selector: 'app-configuration-mapping-fields',
  templateUrl: './configuration-mapping-fields.component.html',
  styleUrls: ['./configuration-mapping-fields.component.scss']
})
export class ConfigurationMappingFieldsComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() sourceFieldText: string;

  @Input() destinationFieldText: string;

  @Input() sourceFieldPlaceholderText: string;

  @Input() destinationPlaceholderFieldText: string;

  @Input() sourceFieldOptions: string[] | SelectFormOption[];

  @Input() destinationFieldOptions: string[] | TravelperkPaymentProfileSettingGet[];

  @Input() isDestinationDisabled: boolean;

  @Input() totalAvailableRows: number;

  @Input() showCrossIcon: boolean;

  @Input() appName: string;

  @Output() loadMoreClick =  new EventEmitter();

  readonly brandingConfig = brandingConfig;

  constructor() { }

  get paymentProfileMappingsGetter() {
    return this.form.get('paymentProfileMappings') as FormArray;
  }

  showOrHideLoadMoreButton() {
    if (this.form.controls.paymentProfileMappings.value.length < this.totalAvailableRows) {
      return true;
    }
    return false;
  }

  showAllFields() {
    this.loadMoreClick.emit();
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.userRole.patchValue('');
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
