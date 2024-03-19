import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ImportDefaultField, ImportSettingMappingRow, ImportSettingsCustomFieldRow, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, MappingSourceField, XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { Sage300DefaultFields, Sage300DependentImportFields, Sage300ImportSettingModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-configuration-import-field',
  templateUrl: './configuration-import-field.component.html',
  styleUrls: ['./configuration-import-field.component.scss']
})
export class ConfigurationImportFieldComponent implements OnInit {

  @Input() appName: string;

  @Input() form: FormGroup;

  @Input() accountingFieldOptions: IntegrationField[];

  @Input() fyleFieldOptions: FyleField[];

  @Input() defaultImportFields: Sage300DefaultFields[] | ImportDefaultField[];

  @Input() costCategoryOption: ImportSettingsCustomFieldRow[];

  @Input() costCodeFieldOption: ImportSettingsCustomFieldRow[];

  @Input() dependentImportFields: Sage300DependentImportFields[];

  @Input() dependentDestinationValue: string;

  @Input() isDestinationFixedImport: boolean = false;

  @Input() isCloneSettingView: boolean;

  @Input() redirectLink: string;

  @Output() showWarningForDependentFields = new EventEmitter();

  filteredFyleFields: FyleField[];

  showDependentFieldWarning: boolean;

  showAddButton: any;

  AppName = AppName;

  isXeroProjectMapped: boolean;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  @Output() xeroProjectMapping:EventEmitter<boolean> = new EventEmitter();

  constructor(
    public windowService: WindowService
  ) { }

  get expenseFieldsGetter() {
    return this.form.get('expenseFields') as FormArray;
  }

  showOrHideAddButton() {
    if (this.form.controls.expenseFields.value.length === this.accountingFieldOptions?.length) {
      return false;
    }
    return true;
  }

  addExpenseField() {
    const expenseFields = this.form.get('expenseFields') as FormArray;
    const defaultFieldData: ImportSettingMappingRow = {
      source_field: '',
      destination_field: '',
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
    };
    expenseFields.push(ImportSettingsModel.createFormGroup(defaultFieldData));
    this.showAddButton = this.showOrHideAddButton();
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
    } else {
      (this.form.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(true);
    }

    if (selectedValue === MappingSourceField.PROJECT && (this.form.get('expenseFields') as FormArray).at(index)?.get('source_field')?.value !== XeroFyleField.CUSTOMER && this.appName === AppName.XERO) {
      this.isXeroProjectMapped = true;
      this.xeroProjectMapping.emit(this.isXeroProjectMapped);
    } else {
      this.isXeroProjectMapped = false;
      this.xeroProjectMapping.emit(this.isXeroProjectMapped);
    }
  }

  getOptions(expenseField: AbstractControl): FyleField[]{
    if (expenseField.value.destination_field === 'CUSTOMER' && this.appName === AppName.XERO && !expenseField.value.import_to_fyle) {
      return this.filteredFyleFields;
    } else if (expenseField.value.source_field === 'CATEGORY') {
      return this.fyleFieldOptions;
    }
    return this.fyleFieldOptions;
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    (expenseField as FormGroup).controls.import_to_fyle.enable();
    event?.stopPropagation();
    this.isXeroProjectMapped = false;
    this.xeroProjectMapping.emit(this.isXeroProjectMapped);
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
    this.filteredFyleFields = this.appName !== AppName.XERO ? this.fyleFieldOptions.filter(option => option.attribute_type !== 'CATEGORY') : [{ attribute_type: 'DISABLED_XERO_SOURCE_FIELD', display_name: 'Project', is_dependent: false }];
  }

}
