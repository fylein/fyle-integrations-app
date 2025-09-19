import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ImportDefaultField, ImportSettingMappingRow, ImportSettingsCustomFieldRow } from 'src/app/core/models/common/import-settings.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, MappingSourceField, Sage300Field, XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { Sage300DefaultFields, Sage300DependentImportFields } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';

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

  @Output() showWarningForDependentFields = new EventEmitter();

  isConfigToggleLeftAligned = brandingFeatureConfig.qbdDirect.configToggleLeftAligned;

  showDependentFieldWarning: boolean;

  showAddButton: any;

  AppName = AppName;

  isXeroProjectMapped: boolean;

  uiExposedAppName: string;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]> = {
    "ACCOUNT": [],
    "VENDOR": [],
    "JOB": []
  };

  isImportCodeEnabledCounter: boolean[] = [];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingStyle = brandingStyle;

  @Output() xeroProjectMapping:EventEmitter<boolean> = new EventEmitter();

  constructor(
    public windowService: WindowService,
    public helper: HelperService,
    public router: Router,
    private workspace: WorkspaceService,
    private translocoService: TranslocoService,
    private importSettingsService: ImportSettingsService
  ) { }

  get expenseFieldsGetter() {
    return this.form.get('expenseFields') as FormArray;
  }

  getContentForJob(destinationField: string): string {
    return destinationField === this.dependentDestinationValue ? this.translocoService.translate('configurationImportField.jobContentInfo', {destinationField: this.helper.sentenseCaseConversion(this.getDestinationField(destinationField)).toLowerCase()}) : '';
  }

  showImportCodeSection(expenseField: AbstractControl<any, any>): any {
    return expenseField.value.import_to_fyle && expenseField.value.source_field && this.importCodeFieldConfig[expenseField.value.destination_field];
  }

  getImportCodeSelectorOptions(destinationField: string): SelectFormOption[] {
    return this.importCodeSelectorOptions[destinationField];
  }


  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
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
    expenseFields.push(this.importSettingsService.createFormGroup(defaultFieldData));
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
      this.onImportToFyleToggleChange({checked: true}, (this.form.get('expenseFields') as FormArray).at(index)?.get('destination_field')?.value);
      if (this.appName === AppName.SAGE300) {
        (this.form.get('expenseFields') as FormArray).at(index)?.get('import_code')?.addValidators(Validators.required);
      }
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
    if (expenseField.get('destination_field')?.value === 'CUSTOMER' && this.appName === AppName.XERO) {
      return [{ attribute_type: 'DISABLED_XERO_SOURCE_FIELD', display_name: this.translocoService.translate('configurationImportField.disabledXeroSourceFieldProject'), is_dependent: false }];
    } else if (expenseField.get('source_field')?.value === 'CATEGORY') {
      return this.fyleFieldOptions.filter(option => option.attribute_type === 'CATEGORY');
    }

    return this.fyleFieldOptions.filter(option => option.attribute_type !== 'CATEGORY');
  }

  removeFilter(expenseField: AbstractControl) {
    if ((expenseField as FormGroup).controls.import_to_fyle.value) {
      this.onImportToFyleToggleChange({checked: false}, (expenseField as FormGroup).controls.destination_field.value);
    }
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    (expenseField as FormGroup).controls.import_to_fyle.enable();
    event?.stopPropagation();
    this.isXeroProjectMapped = false;
    this.xeroProjectMapping.emit(this.isXeroProjectMapped);
  }

  onSwitchChanged(event: any, formGroup: AbstractControl): void {
    this.onShowWarningForDependentFields(event, formGroup);
    if (event.checked && this.appName === AppName.SAGE300 && formGroup.get('source_field')?.value === 'PROJECT') {
      this.form.controls.isDependentImportEnabled.setValue(true);
    }
    if (!event.checked && this.appName === AppName.SAGE300) {
      formGroup?.get('import_code')?.clearValidators();
    }
    if (this.appName === AppName.SAGE300 && formGroup.get('source_field')?.value) {
      this.onImportToFyleToggleChange(event, formGroup?.get('destination_field')?.value);
    }
  }

  onImportToFyleToggleChange(event: any, destinationField: string): void {
    if (this.appName === AppName.SAGE300 && this.importCodeFieldConfig[destinationField]) {
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
      const destinationValue = key === 'importCategories' ? 'ACCOUNT' : 'VENDOR';
      if (['importCategories', 'importVendorAsMerchant'].includes(key) && this.form.get(key)?.value) {
        if (this.importCodeFieldConfig[destinationValue]) {
        this.isImportCodeEnabledCounter.push(true);
        } else {
        this.isImportCodeEnabledCounter.pop();
        }
      }
    });
    Object.keys(this.expenseFieldsGetter.controls).forEach(key => {
      const importCode = this.expenseFieldsGetter.controls[key as unknown as number].get('import_to_fyle');
      const destinationValue = this.expenseFieldsGetter.controls[key as unknown as number].get('destination_field')?.value;
      if (importCode?.value === true ) {
        if (this.importCodeFieldConfig[destinationValue]) {
        this.isImportCodeEnabledCounter.push(true);
        } else {
        this.isImportCodeEnabledCounter.pop();
        }
      }
    });
  }

  getImportSubLabel(destinationField: string): string {
    const subLabelPart1 = this.translocoService.translate('configurationImportField.howToImportSubLabel', { destinationFields: this.helper.sentenseCaseConversion(this.getDestinationField(destinationField)).toLowerCase() });
    const jobContent = this.getContentForJob(destinationField);
    return `${subLabelPart1}${jobContent ? ' ' + jobContent : ''}`;
  }

  private setupImportCodeSelectorOptions(): void {
    const commonLabels = {
      importCodesAndNames: this.translocoService.translate('configurationImportField.labelImportCodesAndNames'),
      importNamesOnly: this.translocoService.translate('configurationImportField.labelImportNamesOnly')
    };
    this.importCodeSelectorOptions = {
      "ACCOUNT": [
        {
          label: commonLabels.importCodesAndNames,
          value: true,
          subLabel: this.translocoService.translate('configurationImportField.exampleAccount')
        },
        {
          label: commonLabels.importNamesOnly,
          value: false,
          subLabel: this.translocoService.translate('configurationImportField.exampleAccountNameOnly')
        }
      ],
      "VENDOR": [
        {
          label: commonLabels.importCodesAndNames,
          value: true,
          subLabel: this.translocoService.translate('configurationImportField.exampleVendor')
        },
        {
          label: commonLabels.importNamesOnly,
          value: false,
          subLabel: this.translocoService.translate('configurationImportField.exampleVendorNameOnly')
        }
      ],
      "JOB": [
        {
          label: commonLabels.importCodesAndNames,
          value: true,
          subLabel: this.translocoService.translate('configurationImportField.exampleJob')
        },
        {
          label: commonLabels.importNamesOnly,
          value: false,
          subLabel: this.translocoService.translate('configurationImportField.exampleJobNameOnly')
        }
      ]
    };
  }

  ngOnInit(): void {
    this.setupImportCodeSelectorOptions();
    this.uiExposedAppName = this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
    if (this.form.controls?.dependentFieldImportToggle?.value) {
      this.form.controls?.dependentFieldImportToggle.disable();
    }
    if (this.appName !== AppName.SAGE300) {
      this.disableDestinationFields();
    } else {
      this.setupImportCodeCounter();
    }
  }

}
