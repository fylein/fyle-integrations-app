import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';

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

  @Input() SourceFields: string[];

  @Input() DestinationFields: string[];

  @Input() isSourceDisabled: boolean;

  @Input() isDestinationDisabled: boolean;

  @Input() noOfFieldsToShow: number = 0;

  @Input() showCrossIcon: boolean;

  @Input() appName: string;

  currentLength: number = this.noOfFieldsToShow;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  get expenseFieldsGetter() {
    return this.form.get('userRoleFields') as FormArray;
  }

  showOrHideLoadMoreButton() {
    if (this.form.controls.expenseFields.value.length > this.currentLength) {
      return true;
    }
    return false;
  }

  addExpenseFields() {
    this.currentLength = this.form.controls.expenseFields.value.length;
  }

  hasDuplicateOption(formGroup: AbstractControl, index: number, controlName: string): boolean {
    return (formGroup as FormGroup).controls[controlName].valid;
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    (expenseField as FormGroup).controls.import_to_fyle.enable();
    event?.stopPropagation();
  }

  onDropdownChange(event: any, index: number) {
    // Get the selected value from the <p-dropdown>
    const selectedValue = event.value;

    // Find the selected field in 'fyleFields' based on the selected value
    // Const selectedField = this.SourceFields.find(field => field.attribute_type === selectedValue);

    // Check if the selected field is dependent (assuming 'is_dependent' is a property in 'selectedField')
    // If (selectedField?.is_dependent) {
      // Set the toggle to false
      // (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(false);

      // Get the 'import_to_fyle' control at the specified index and disable it
      (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.disable();
    // } else {
      (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(true);
    // }
  }

  ngOnInit(): void {
  }

}
