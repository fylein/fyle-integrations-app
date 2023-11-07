import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportSettingsCustomFieldRow } from 'src/app/core/models/common/import-settings.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { MappingSourceField } from 'src/app/core/models/enum/enum.model';
import { Sage300DefaultFields, Sage300DependentImportFields } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/si/si-configuration/import-settings.model';

@Component({
  selector: 'app-configuration-import-field',
  templateUrl: './configuration-import-field.component.html',
  styleUrls: ['./configuration-import-field.component.scss']
})
export class ConfigurationImportFieldComponent implements OnInit {

  @Input() appName: string = 'Sage 300 CRE';

  @Input() form: FormGroup;

  @Input() accountingFieldOptions: IntegrationField[];

  @Input() fyleFieldOptions: FyleField[];

  @Input() defaultImportFields: Sage300DefaultFields[];

  @Input() costCategoryOption: ImportSettingsCustomFieldRow[];

  @Input() costCodeFieldOption: ImportSettingsCustomFieldRow[];

  @Input() dependentImportFields: Sage300DependentImportFields[];

  @Output() showWarningForDependentFields = new EventEmitter();

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
    if (selectedField?.is_dependent) {
      // Set the toggle to false
      (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(false);

      // Get the 'import_to_fyle' control at the specified index and disable it
      (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.disable();
    }
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).value[0].source_field.patchValue('');
    (expenseField as FormGroup).value[0].import_to_fyle.patchValue(false);
    event?.stopPropagation();
  }

  onShowWarningForDependentFields(event: any, formGroup: AbstractControl): void {
    if (!event.checked && formGroup.value.source_field === MappingSourceField.PROJECT) {
      this.showWarningForDependentFields.emit();
    }
  }

  isExpenseFieldDependent(expenseField: MappingSetting): boolean {
    const isDependent = this.fyleFieldOptions.find(field => field.attribute_type === expenseField.source_field)?.is_dependent;
    return isDependent ? true : false;
  }

  updateDependentField(sourceField: string, importToFyle: boolean) {
    if (!(sourceField==='PROJECT' && importToFyle)) {
      this.form.controls.isDependentImportEnabled.setValue(false);
    }
  }

  ngOnInit(): void {
  }

}
