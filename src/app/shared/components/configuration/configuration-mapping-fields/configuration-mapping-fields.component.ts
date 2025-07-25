import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SelectFormLabel, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { TravelperkPaymentProfileSettingGet } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { TravelperkDestinationAttribuite } from 'src/app/core/models/travelperk/travelperk.model';

@Component({
    selector: 'app-configuration-mapping-fields',
    templateUrl: './configuration-mapping-fields.component.html',
    styleUrls: ['./configuration-mapping-fields.component.scss'],
    standalone: false
})
export class ConfigurationMappingFieldsComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() sourceFieldText: string;

  @Input() destinationFieldText: string;

  @Input() sourceFieldPlaceholderText: string;

  @Input() destinationPlaceholderFieldText: string;

  @Input() sourceFieldOptions: any[];

  @Input() destinationFieldOptions: any[];

  @Input() isDestinationDisabled: boolean;

  @Input() totalAvailableRows: number;

  @Input() showCrossIcon: boolean;

  @Input() appName: string;

  @Input() formControllerName: string;

  @Input() destinationAttributeNames: SelectFormLabel;

  @Input() sourceAttributeNames: SelectFormLabel;

  @Input() isMandatory: boolean;

  @Output() loadMoreClick =  new EventEmitter();

  readonly brandingConfig = brandingConfig;

  constructor() { }

  get mappingsFieldsGetter() {
    return this.form.get(this.formControllerName) as FormArray;
  }

  isOverflowing(element: any): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  showOrHideLoadMoreButton() {
    if (this.form.controls[this.formControllerName].value.length < this.totalAvailableRows) {
      return true;
    }
    return false;
  }

  showAllFields() {
    this.loadMoreClick.emit();
  }

  removeFilter(mappingField: AbstractControl) {
    (mappingField as FormGroup).controls.sourceName.patchValue('');
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
