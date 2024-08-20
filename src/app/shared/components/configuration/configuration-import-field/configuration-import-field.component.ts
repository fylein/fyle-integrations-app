import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ImportDefaultField, ImportSettingMappingRow, ImportSettingsCustomFieldRow, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, MappingSourceField, Sage300Field, XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { Sage300DefaultFields, Sage300DependentImportFields, Sage300ImportSettingModel } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

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

  @Input() commitmentFieldSupportArticleLink: string;

  @Input() dependantFieldSupportArticleLink: string;

  @Input() importCodeFieldConfig: any;

  isOnboarding: boolean;

  @Output() showWarningForDependentFields = new EventEmitter();

  showDependentFieldWarning: boolean;

  showAddButton: any;

  AppName = AppName;

  isXeroProjectMapped: boolean;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]> = {
    "ACCOUNT": [
      {
        label: 'Import Codes + Names',
        value: true,
        subLabel: 'Example: 4567 Meals & Entertainment'
      },
      {
        label: 'Import Names only',
        value: false,
        subLabel: 'Example: Meals & Entertainment'
      }
    ],
    "VENDOR": [
      {
        label: 'Import Codes + Names',
        value: true,
        subLabel: 'Example: 4567 Joanna'
      },
      {
        label: 'Import Names only',
        value: false,
        subLabel: 'Example: Joanna'
      }
    ],
    "JOB": [
      {
        label: 'Import Codes + Names',
        value: true,
        subLabel: 'Example: 4567 Test Job'
      },
      {
        label: 'Import Names only',
        value: false,
        subLabel: 'Example: Test Job'
      }
    ]
  };

  isImportCodeEnabledCounter: boolean[] = [];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingXeroContent = brandingContent.xero.configuration.importSetting.toggleToastMessage;

  @Output() xeroProjectMapping:EventEmitter<boolean> = new EventEmitter();

  constructor(
    public windowService: WindowService,
    public helper: HelperService,
    public router: Router,
    private workspace: WorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.form.get('expenseFields') as FormArray;
  }

  showImportCodeSection(expenseField: AbstractControl<any, any>): any {
    return expenseField.value.import_to_fyle && expenseField.value.source_field;
  }

  isImportCodeFieldDisabledportCode(): boolean {
    if (!this.isOnboarding) {
      return !this.isOnboarding;
    }
    return this.isOnboarding;
  }

  getImportCodeSelectorOptions(destinationField: string): SelectFormOption[] {
    return this.importCodeSelectorOptions[destinationField];
  }


  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  disablethefield(dependentField: Sage300DependentImportFields) {
    if (dependentField.isDisabled) {
      this.form.controls[dependentField.formController].disable();
    }
    return dependentField.isDisabled;
  }

  getDestinationField(destinationField: string): string {
    const lastChar = destinationField.slice(-1).toLowerCase();
    const lastTwoChars = destinationField.slice(-2).toLowerCase();

    if (lastChar === 'y') {
        return destinationField.slice(0, -1) + 'ies';
    } else if (['s', 'x', 'z'].includes(lastChar) || ['sh', 'ch'].includes(lastTwoChars)) {
        return destinationField + 'es';
    }
    return destinationField + 's';
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
      this.onImportToFyleToggleChange({checked: true});
    }

    if (selectedValue === 'custom_field') {
      (this.form.get('expenseFields') as FormArray).at(index)?.get('source_field')?.setValue(null);
    }

    if ( selectedValue === MappingSourceField.PROJECT && (this.form.get('expenseFields') as FormArray).at(index)?.get('destination_field')?.value === Sage300Field.JOB && this.appName === AppName.SAGE300) {
      this.form.controls.isDependentImportEnabled.setValue(true);
    }

    if (selectedValue === MappingSourceField.PROJECT && (this.form.get('expenseFields') as FormArray).at(index)?.get('source_field')?.value !== XeroFyleField.CUSTOMER && this.appName === AppName.XERO) {
      this.isXeroProjectMapped = true;
      this.xeroProjectMapping.emit(this.isXeroProjectMapped);
    } else {
      this.isXeroProjectMapped = false;
      this.xeroProjectMapping.emit(this.isXeroProjectMapped);
    }
  }

  getOptions(expenseField: AbstractControl): FyleField[] {
    if (expenseField.get('destination_field')?.value === 'CUSTOMER' && this.appName === AppName.XERO && !expenseField.get('import_to_fyle')?.value) {
      return [{ attribute_type: 'DISABLED_XERO_SOURCE_FIELD', display_name: 'Project', is_dependent: false }];
    } else if (expenseField.get('source_field')?.value === 'CATEGORY') {
      return this.fyleFieldOptions.filter(option => option.attribute_type === 'CATEGORY');
    }

    return this.fyleFieldOptions.filter(option => option.attribute_type !== 'CATEGORY');
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    (expenseField as FormGroup).controls.import_to_fyle.enable();
    this.onImportToFyleToggleChange({checked: false});
    event?.stopPropagation();
    this.isXeroProjectMapped = false;
    this.xeroProjectMapping.emit(this.isXeroProjectMapped);
  }

  onSwitchChanged(event: any, formGroup: AbstractControl): void {
    this.onShowWarningForDependentFields(event, formGroup);
    if (event.checked && this.appName === AppName.SAGE300 && formGroup.get('source_field')?.value === 'PROJECT') {
      this.form.controls.isDependentImportEnabled.setValue(true);
    }
  }

  onImportToFyleToggleChange(event: any): void {
    if (this.appName === AppName.SAGE300) {
      event.checked ? this.isImportCodeEnabledCounter.push(true) : this.isImportCodeEnabledCounter.pop();
    }
  }

  onShowWarningForDependentFields(event: any, formGroup: AbstractControl): void {
    if (this.costCodeFieldOption?.length && this.costCodeFieldOption?.length) {
      if (!event.checked && formGroup.value.source_field === MappingSourceField.PROJECT && this.costCodeFieldOption[0]?.attribute_type !== 'custom_field' && this.costCodeFieldOption[0]?.attribute_type !== 'custom_field') {
        this.showWarningForDependentFields.emit();
      }
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

  disableDestinationFields() {
    this.expenseFieldsGetter.controls.forEach((expenseField) => {
      expenseField.get('destination_field')?.disable();
      if ((expenseField.get('source_field')?.value === 'CATEGORY') || (expenseField.get('destination_field')?.value === 'CUSTOMER' && this.appName === AppName.XERO)) {
        expenseField.get('source_field')?.disable();
      }
    });
  }

  setupImportCodeCounter() {
    Object.keys(this.form.controls).forEach(key => {
      if (['importCategories', 'importVendorAsMerchant'].includes(key) && this.form.get(key)?.value) {
        this.isImportCodeEnabledCounter.push(true);
      }
    });
    Object.keys(this.expenseFieldsGetter.controls).forEach(key => {
      const importCode = this.expenseFieldsGetter.controls[key as unknown as number].get('import_to_fyle');
      if (importCode?.value === true) {
        this.isImportCodeEnabledCounter.push(true);
      }
    });
  }

  ngOnInit(): void {
    if (this.appName !== AppName.SAGE300) {
      this.disableDestinationFields();
    } else {
      this.setupImportCodeCounter();
    }
  }

}
