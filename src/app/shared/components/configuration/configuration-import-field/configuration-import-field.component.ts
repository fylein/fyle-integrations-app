import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { IntegrationFields } from 'src/app/core/models/db/mapping.model';
import { MappingSourceField } from 'src/app/core/models/enum/enum.model';
import { Sage300DefaultFields } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';

@Component({
  selector: 'app-configuration-import-field',
  templateUrl: './configuration-import-field.component.html',
  styleUrls: ['./configuration-import-field.component.scss']
})
export class ConfigurationImportFieldComponent implements OnInit {

  @Input() appName: string = 'Sage 300 CRE';

  @Input() form: FormGroup;

  @Input() accountingFieldOptions: IntegrationFields[];

  @Input() fyleFieldOptions: IntegrationFields[];

  @Input() defaultImportFields: Sage300DefaultFields[];

  @Input() costCategoryOption: any;

  @Input() costCodeFieldOption: any;

  showDependentFieldWarning: boolean;


  constructor(
    private formBuilder: FormBuilder
  ) { }

  get expenseFieldsGetter() {
    return this.form.get('expenseFields') as FormArray;
  }

  hasDuplicateOption(formGroup: AbstractControl, index: number, controlName: string): boolean {
    return (formGroup as FormGroup).controls[controlName].valid;
  }

  onDropdownChange(event: any, index: number) {
    // Get the selected value from the <p-dropdown>
    const selectedValue = event.value;

    // Find the selected field in 'fyleFields' based on the selected value
    const selectedField = this.fyleFieldOptions.find(field => field.attribute_type === selectedValue);

    // Check if the selected field is dependent (assuming 'is_dependent' is a property in 'selectedField')
    // If (selectedField?.is_dependent) {
    //   // Set the toggle to false
    //   (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(false);

    //   // Get the 'import_to_fyle' control at the specified index and disable it
    //   (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.disable();
    // }
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    event?.stopPropagation();
  }

  showWarningForDependentFields(event: any, formGroup: AbstractControl): void {
    if (!event.checked && formGroup.value.source_field === MappingSourceField.PROJECT) {
      this.showDependentFieldWarning = true;
    }
  }

  isExpenseFieldDependent(expenseField: MappingSetting): boolean {
    // Const isDependent = this.fyleFieldOptions.find(field => field.attribute_type === expenseField.source_field)?.is_dependent;
    // Return isDependent ? true : false;
    return true;
  }

  updateDependentField(sourceField: string, importToFyle: boolean) {
    if (!(sourceField==='PROJECT' && importToFyle)) {
      this.form.controls.isDependentImportEnabled.setValue(false);
    }
  }

  ngOnInit(): void {
  }

}
