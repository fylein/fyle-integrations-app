import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { IntacctCategoryDestination, ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, MappingSourceField, AppName, TrackingApp, SageIntacctField, IntacctReimbursableExpensesObject, IntacctCorporateCreditCardExpensesObject, ButtonType, ButtonSize } from 'src/app/core/models/enum/enum.model';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { DependentFieldSetting, ImportSettingGet, ImportSettingPost, ImportSettings, IntacctImportFieldsAttributeCounts, MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { Org } from 'src/app/core/models/org/org.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { SiImportSettingsService } from 'src/app/core/services/si/si-configuration/si-import-settings.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { TranslocoService } from '@jsverse/transloco';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
    selector: 'app-intacct-import-settings',
    templateUrl: './intacct-import-settings.component.html',
    styleUrls: ['./intacct-import-settings.component.scss'],
    standalone: false
})

export class IntacctImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  appName = AppName.INTACCT;

  org: Org = this.orgService.getCachedOrg();

  importSettingsForm: FormGroup;

  customFieldForm: FormGroup;

  expenseFields: FormArray;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.IMPORT_SETTING;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: ImportSettingGet;

  sageIntacctTaxGroup: IntacctDestinationAttribute[];

  sageIntacctFields: ExpenseField[];

  fyleFields: ExpenseField[];

  showAddButton: boolean = true;

  toggleSwitchTrue: boolean = true;

  intacctCategoryDestination: IntacctCategoryDestination;

  intacctCategoryDestinationLabel: string;

  showDialog: boolean;

  customField: ExpenseField;

  customFieldControl: AbstractControl;

  customFieldForDependentField: boolean = false;

  private sessionStartTime = new Date();

  costCodeFieldOption: ExpenseField[];

  private isCostCodeFieldSelected: boolean = false;

  costTypeFieldOption: ExpenseField[];

  customFieldOption: ExpenseField[];

  dependentFieldSettings: DependentFieldSetting | null;

  isImportTaxVisible: boolean = true;

  showDependentFieldWarning: boolean;

  isDialogVisible: boolean = false;

  importCodeField: FormGroup[] = [];

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  acceptedImportCodeField: string[] = [SageIntacctField.ACCOUNT, SageIntacctField.DEPARTMENT, MappingSourceField.PROJECT];

  existingFields: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  intacctImportCodeConfig: any;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]>;

  readonly brandingStyle = brandingStyle;

  attributeCounts: IntacctImportFieldsAttributeCounts;

  defaultAttribuitesWarningArray: boolean[] = [false, false, false];

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private importSettingService: SiImportSettingsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService,
    public helper: HelperService,
    private translocoService: TranslocoService,
    private importSettingsService: ImportSettingsService,
    public brandingService: BrandingService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  get importCodeFieldGetter() {
    return this.importSettingsForm.get('importCodeFields') as FormArray;
  }

  showWarningForImportFields(isImportCodeEnabled: boolean, destinationField: keyof IntacctImportFieldsAttributeCounts, formControlName: string, index: number): void {
    if (isImportCodeEnabled) {
      this.importSettingService.getImportFieldsAttributeCounts().subscribe((importFieldsAttributeCounts: IntacctImportFieldsAttributeCounts) => {
        this.attributeCounts = importFieldsAttributeCounts;
        const destinationFieldCount: number = importFieldsAttributeCounts[destinationField] as number;
        if (destinationFieldCount >= 0) {
          this.importSettingsForm.controls[formControlName].setValue(false);
          this.importSettingsForm.controls[formControlName].disable();
          this.defaultAttribuitesWarningArray[index] = true;
        } else {
          this.importSettingsForm.controls[formControlName].setValue(isImportCodeEnabled);
          this.importSettingsForm.controls[formControlName].enable();
          this.defaultAttribuitesWarningArray[index] = false;
        }
      });
    }
  }

  updateImportFields(event: [boolean, string, number]): void {
    const destinationField = this.helper.getDestinationFieldPlural(event[1].toLowerCase()) + "_count";
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    if (event[0]) {
      this.importSettingService.getImportFieldsAttributeCounts().subscribe((importFieldsAttributeCounts: IntacctImportFieldsAttributeCounts) => {
        const count = importFieldsAttributeCounts[destinationField as keyof IntacctImportFieldsAttributeCounts];
        if (typeof count === 'number' && count >= 0) {
          const expenseField = expenseFieldArray.controls[event[2]];
          expenseField.patchValue({
            import_to_fyle: false,
            is_auto_import_enabled: false,
            count: count
          });
        } else {
          const expenseField = expenseFieldArray.controls[event[2]];
          expenseField.patchValue({
            import_to_fyle: event[0],
            is_auto_import_enabled: true
          });
        }
      });
    }
  }

  addImportCodeField(event: any, sourceField: string) {
    // Get the reference to the FormArray from the form
    const importCodeFieldsArray = this.importSettingsForm.get('importCodeFields') as FormArray;

    if (sourceField === IntacctCategoryDestination.GL_ACCOUNT) {
      sourceField = IntacctCategoryDestination.ACCOUNT;
    }

    // Find the index of the FormGroup
    const index = importCodeFieldsArray.controls.findIndex(control => control?.get('source_field')?.value === sourceField);

    if (event.checked && this.acceptedImportCodeField.includes(sourceField) && this.intacctImportCodeConfig[sourceField] && index === -1) {
      // Create a new FormGroup
      const value = this.formBuilder.group({
        source_field: [sourceField],
        import_code: [this.importSettingsService.getImportCodeField(this.importSettings.configurations.import_code_fields, sourceField, this.intacctImportCodeConfig), Validators.required]
      });

      // Push the new FormGroup into the FormArray
      importCodeFieldsArray.push(value);
    } else {

      // If found, remove the FormGroup from the FormArray
      if (index !== -1) {
        importCodeFieldsArray.removeAt(index);
      }
    }
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

  refreshDimensions(isRefresh: boolean) {
    this.mappingService.refreshSageIntacctDimensions().subscribe();
    this.mappingService.refreshFyleDimensions().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctImportSettings.syncingDataDimensions'));
  }

  removeFilter(expenseField: AbstractControl) {
    if ((expenseField as FormGroup).controls.import_to_fyle.value) {
      this.addImportCodeField({checked: false}, (expenseField as FormGroup).controls.destination_field.value);
    }
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    event?.stopPropagation();
  }

  hasDuplicateOption(formGroup: AbstractControl, index: number, controlName: string): boolean {
    return (formGroup as FormGroup).controls[controlName].valid;
  }

  showOrHideAddButton() {
    if (this.importSettingsForm.controls.expenseFields.value.length === this.sageIntacctFields.length) {
      return false;
    }
    return true;
  }

  showPreviewDialog(visible: boolean) {
    this.isDialogVisible = visible;
  }

  addExpenseField() {
    this.expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    const defaultFieldData: MappingSetting = {
      source_field: '',
      destination_field: '',
      import_to_fyle: false,
      is_custom: false,
      source_placeholder: null
    };
    this.expenseFields.push(this.createFormGroup(defaultFieldData));
    this.importSettingWatcher();
    this.showAddButton = this.showOrHideAddButton();
  }

  closeModel() {
    this.customFieldControl.patchValue({
      source_field: null
    });
    this.customFieldForm.reset();
    this.showDialog = false;
  }

  saveCustomField() {
    if (this.customFieldForDependentField && this.customFieldForm.getRawValue()) {
      this.customField = {
        attribute_type: this.customFieldForm.get('attribute_type')?.value,
        display_name: this.customFieldForm.get('attribute_type')?.value,
        source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
        is_dependent: true,
        is_custom: true
      };
      if (this.customFieldControl) {
        const fieldName = this.isCostCodeFieldSelected ? 'costCodes' : 'costTypes';
        if (this.isCostCodeFieldSelected) {
          this.costCodeFieldOption.push(this.customField);
        } else {
          this.costTypeFieldOption.push(this.customField);
        }

        this.fyleFields = this.fyleFields.filter(field => !field.is_dependent);
        this.importSettingsForm.controls[fieldName]?.patchValue(this.customField);
        this.customFieldForm.reset();
        this.showDialog = false;
      }
      this.customFieldForDependentField = false;
    } else {
      this.addImportCodeField({checked: true}, this.customFieldControl.get('destination_field')?.value);
      this.customField = {
        attribute_type: this.customFieldForm.get('attribute_type')?.value.split(' ').join('_').toUpperCase(),
        display_name: this.customFieldForm.get('attribute_type')?.value,
        source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
        is_dependent: false
      };

      if (this.customFieldControl) {
        this.fyleFields.pop();
        this.fyleFields.push(this.customField);
        this.fyleFields.push(this.customFieldOption[0]);
        const expenseField = {
          source_field: this.customField.attribute_type,
          destination_field: this.customFieldControl.get('destination_field')?.value,
          import_to_fyle: true,
          is_custom: true,
          source_placeholder: this.customField.source_placeholder
        };
        (this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
        this.customFieldForm.reset();
        this.showDialog = false;
      }
    }
  }

  updateDependentField(sourceField: string, importToFyle: boolean) {
    if (!(sourceField==='PROJECT' && importToFyle)) {
      this.importSettingsForm.controls.isDependentImportEnabled.setValue(false);
    }
  }

  private costCodesCostTypesWatcher(): void {
    if (this.importSettingsForm.get('costCodes')?.value) {
      this.costCodeFieldOption = [this.importSettingsForm.get('costCodes')?.value];
      this.dependentFieldSettings?.cost_code_field_name !== null ? this.importSettingsForm.controls.costCodes.disable() : this.importSettingsForm.controls.costCodes.enable();
      this.importSettingsForm.get('costCodesImportToggle')?.disable();
    } else {
      // Cost types cannot be edited without first mapping cost codes
      this.importSettingsForm.get('costTypes')?.disable();
      this.importSettingsForm.get('costTypesImportToggle')?.disable();
      this.importSettingsForm.get('costTypesImportToggle')?.setValue(false);
    }

    if (this.importSettingsForm.get('costTypes')?.value) {
      this.costTypeFieldOption = [this.importSettingsForm.get('costTypes')?.value];
      this.dependentFieldSettings?.cost_type_field_name !== null ? this.importSettingsForm.controls.costTypes.disable() : this.importSettingsForm.controls.costTypes.enable();
    }

    this.importSettingsForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
      if (isDependentImportEnabled) {
        this.importSettingsForm.controls.costCodes.setValidators(Validators.required);
      } else {
        this.importSettingsForm.controls.costCodes.clearValidators();
      }
    });

    this.importSettingsForm.controls.costCodes.valueChanges.subscribe((value) => {
      this.isCostCodeFieldSelected = true;
      if (value?.attribute_type === 'custom_field') {
        // Show a dialog when the "Create a custom field" button is clicked
        this.customFieldForDependentField = true;
        this.addCustomField();
        this.customFieldControl = this.importSettingsForm.controls.costCodes;
        if (value.source_field === 'custom_field') {
          this.importSettingsForm.controls.costCodes.patchValue({
              source_field: null
            });
        }
      } else if (value?.attribute_type) {
        // Once the dialog is submitted and the field value is set,
        // 1. disable cost codes
        // 2. enable cost types
        this.importSettingsForm.get('costCodesImportToggle')?.setValue(true);
        this.importSettingsForm.get('costCodesImportToggle')?.disable();

        this.importSettingsForm.get('costTypes')?.enable();
        this.importSettingsForm.get('costTypesImportToggle')?.enable();
      }
    });

    this.importSettingsForm.controls.costTypes.valueChanges.subscribe((value) => {
      this.isCostCodeFieldSelected = false;
      if (value?.attribute_type === 'custom_field') {
        // Show a dialog when the "Create a custom field" button is clicked
        this.customFieldForDependentField = true;
        this.addCustomField();
        this.customFieldControl = this.importSettingsForm.controls.costTypes;
        if (value.source_field === 'custom_field') {
          this.importSettingsForm.controls.costTypes.patchValue({
              source_field: null
            });
        }
      }
    });
  }

  private addCustomField() {
    this.customFieldForm.reset();
    this.showDialog = true;
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingsForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control) => {
      control.valueChanges.subscribe(value => {
        if (value.source_field === 'custom_field') {
         this.addCustomField();
         this.customFieldControl = control;
         this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: null
          });
        }
      });
    });
    this.importSettingsForm.controls.importTaxCodes?.valueChanges.subscribe((isImportTaxEnabled) => {
      if (isImportTaxEnabled) {
        this.importSettingsForm.controls?.sageIntacctTaxCodes.setValidators([Validators.required]);
      } else {
        this.importSettingsForm.controls.sageIntacctTaxCodes.clearValidators();
        this.importSettingsForm.controls.sageIntacctTaxCodes.updateValueAndValidity();
      }
    });
    this.costCodesCostTypesWatcher();
  }

  private createFormGroup(data: MappingSetting): FormGroup {
    return this.formBuilder.group({
      source_field: [data.source_field || '', RxwebValidators.unique()],
      destination_field: [data.destination_field || '', RxwebValidators.unique()],
      import_to_fyle: [data.import_to_fyle || false],
      is_custom: [data.is_custom || false],
      source_placeholder: [data.source_placeholder || null],
      is_auto_import_enabled: [true],
      count: [0]
    });
  }

  // Main function to construct form array
  private constructFormArray(): FormGroup[] {
    const expenseFieldFormArray: FormGroup[] = [];
    const mappedFieldMap = new Map<string, any>();
    const unmappedFieldMap = new Map<string, any>();

    // First loop to populate mappedFieldMap
    this.sageIntacctFields.forEach((sageIntacctField) => {
      const mappingSetting = this.importSettings.mapping_settings.find(
        (setting) => setting.destination_field === sageIntacctField.attribute_type
      );

      const fieldData = mappingSetting || {
        destination_field: sageIntacctField.attribute_type,
        import_to_fyle: false,
        is_custom: false,
        source_field: '',
        source_placeholder: null
      };
      if (mappingSetting) {
        mappedFieldMap.set(sageIntacctField.attribute_type, fieldData);
      } else {
        unmappedFieldMap.set(sageIntacctField.attribute_type, fieldData);
      }

    });

    const topPriorityFields = ['PROJECT', 'DEPARTMENT', 'LOCATION'];

    // Sort sageIntacctFields so that topPriorityFields come first
    this.sageIntacctFields.sort((a, b) => {
      return (topPriorityFields.includes(b.attribute_type) ? 1 : 0) - (topPriorityFields.includes(a.attribute_type) ? 1 : 0);
    });

    // Handle only mapped fields
    this.sageIntacctFields.forEach((sageIntacctField) => {
      const fieldData = mappedFieldMap.get(sageIntacctField.attribute_type);
      if (fieldData) {
        expenseFieldFormArray.push(this.createFormGroup(fieldData));
      }
    });

    if (mappedFieldMap.size === 0){
      this.sageIntacctFields.forEach((sageIntacctField) => {
        if (expenseFieldFormArray.length < 3) {
          const fieldData = unmappedFieldMap.get(sageIntacctField.attribute_type);
          if (fieldData) {
            expenseFieldFormArray.push(this.createFormGroup(fieldData));
          }
        }
      });
    }

    return expenseFieldFormArray;
  }

  onDropdownChange(event: any, index: number) {
    // Get the selected value from the <p-select>
    const selectedValue = event.value;

    // Find the selected field in 'fyleFields' based on the selected value
    const selectedField = this.fyleFields.find(field => field.attribute_type === selectedValue);

    // Check if the selected field is dependent (assuming 'is_dependent' is a property in 'selectedField')
    if (selectedField?.is_dependent) {
      // Set the toggle to false
      (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(false);

      // Get the 'import_to_fyle' control at the specified index and disable it
      (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.disable();
    } else {
      (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.setValue(true);
      this.addImportCodeField({checked: true}, (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('destination_field')?.value);
    }

    if (selectedValue === 'custom_field') {
      (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('source_field')?.setValue(null);
    }

    this.updateImportFields([(this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('import_to_fyle')?.value, (this.importSettingsForm.get('expenseFields') as FormArray).at(index)?.get('destination_field')?.value, index]);
  }

  isExpenseFieldDependent(expenseField: MappingSetting): boolean {
    const isDependent = this.fyleFields.find(field => field.attribute_type === expenseField.source_field)?.is_dependent;
    return isDependent ? true : false;
  }

  private generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
    return {
      attribute_type: attribute_type,
      display_name: attribute_type,
      source_placeholder: source_placeholder,
      is_dependent: true
    };
  }

  showImportTax(locationEntity: LocationEntityMapping) {
    return new Date(this.org.created_at) < new Date('2024-08-19') && locationEntity.country_name && locationEntity.country_name !== 'United States' && locationEntity.destination_id !== 'top_level' ? true : false;
  }

  private initializeForm(importSettings: ImportSettingGet): void {
    const expenseFieldFormArray: FormGroup[] = [];
    this.importSettingsForm = this.formBuilder.group({
      importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
      importCategories: [importSettings.configurations.import_categories || null],
      importTaxCodes: [importSettings.configurations.import_tax_codes || null],
      costCodes: [importSettings.dependent_field_settings?.cost_code_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null],
      costCodesImportToggle: [true],
      costTypesImportToggle: [!!importSettings.dependent_field_settings?.is_cost_type_import_enabled],
      workspaceId: this.storageService.get('workspaceId'),
      costTypes: [importSettings.dependent_field_settings?.cost_type_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_type_field_name, importSettings.dependent_field_settings.cost_type_placeholder!) : null],
      isDependentImportEnabled: [importSettings.dependent_field_settings?.is_import_enabled || false],
      sageIntacctTaxCodes: [(this.sageIntacctTaxGroup?.find(taxGroup => taxGroup.destination_id === this.importSettings?.general_mappings?.default_tax_code?.id)) || null, importSettings.configurations.import_tax_codes ? [Validators.required] : []],
      expenseFields: this.formBuilder.array(this.constructFormArray()),
      searchOption: [''],
      importCodeField: [importSettings.configurations.import_code_fields],
      importCodeFields: this.formBuilder.array(this.importCodeField)
    });
    if (this.importSettingsForm.controls.costCodes.value && this.importSettingsForm.controls.costTypes.value && this.dependentFieldSettings?.is_import_enabled) {
      this.fyleFields = this.fyleFields.filter(field => !field.is_dependent);
    }

    let sourceField = this.intacctCategoryDestination;
    if (sourceField === IntacctCategoryDestination.GL_ACCOUNT) {
      sourceField = IntacctCategoryDestination.ACCOUNT;
    }

    if (this.importSettings.configurations.import_code_fields && this.importSettings.configurations.import_code_fields.length > 0 && !this.importSettings.configurations.import_code_fields.includes(sourceField) && this.intacctImportCodeConfig[sourceField] && this.importSettings.configurations.import_categories) {
      this.addImportCodeField({checked: true}, this.intacctCategoryDestination);
    }

    // Disable toggle for expense fields that are dependent
    const expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;

    expenseFields.controls.forEach((control, index) => {
      if (this.isExpenseFieldDependent(control.value)) {
        control.get('import_to_fyle')?.disable();
      }
    });

    this.importSettingWatcher();
    this.costCodesCostTypesWatcher();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.customFieldForm = this.formBuilder.group({
      attribute_type: [null, Validators.required],
      display_name: [null],
      source_placeholder: [null, Validators.required]
    });
    this.costCodeFieldOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctImportSettings.createCustomField'), source_placeholder: null, is_dependent: true }];
    this.costTypeFieldOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctImportSettings.createCustomField'), source_placeholder: null, is_dependent: true }];
    this.customFieldOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctImportSettings.createCustomField'), source_placeholder: null, is_dependent: false }];
    this.importCodeSelectorOptions = {
      "ACCOUNT": [
        {
          label: this.translocoService.translate('intacctImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleCodesAndNamesMeals')
        },
        {
          label: this.translocoService.translate('intacctImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleNamesOnlyMeals')
        }
      ],
      "DEPARTMENT": [
        {
          label: this.translocoService.translate('intacctImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleCodesAndNamesFinance')
        },
        {
          label: this.translocoService.translate('intacctImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleNamesOnlyFinance')
        }
      ],
      "PROJECT": [
        {
          label: this.translocoService.translate('intacctImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleCodesAndNamesConstruction')
        },
        {
          label: this.translocoService.translate('intacctImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctImportSettings.exampleNamesOnlyConstruction')
        }
      ]
    };

    const destinationAttributes = ['TAX_DETAIL'];

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const groupedAttributesObservable = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const importSettingsObservable = this.importSettingService.getImportSettings();
    const configuration = this.mappingService.getConfiguration();
    const locationEntity = this.connectorService.getLocationEntityMapping();
    const importCodeFieldConfig = this.importSettingService.getImportCodeFieldConfig();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      groupedAttributesObservable,
      importSettingsObservable,
      configuration,
      locationEntity,
      importCodeFieldConfig
    ]).subscribe(
      ([sageIntacctFields, fyleFields, groupedAttributesResponse, importSettings, configuration, locationEntity, importCodeFieldConfig]) => {
        this.dependentFieldSettings = importSettings.dependent_field_settings;
        this.isImportTaxVisible = this.showImportTax(locationEntity);
        this.sageIntacctFields = sageIntacctFields.map(field => {
          return {
            ...field,
            display_name: field.display_name
          };
        });
        this.fyleFields = fyleFields;
        this.fyleFields.push(this.customFieldOption[0]);
        this.sageIntacctTaxGroup = groupedAttributesResponse.TAX_DETAIL;
        this.importSettings = importSettings;

        const mappingSettings: MappingSetting[] = this.importSettings.mapping_settings;

        this.intacctImportCodeConfig = importCodeFieldConfig;

        for (const setting of mappingSettings) {
          const { source_field, destination_field, import_to_fyle } = setting;
          if (source_field === 'PROJECT' && destination_field === 'PROJECT' && import_to_fyle === true) {
            if (importSettings.dependent_field_settings?.is_import_enabled) {
              this.customField = {
                attribute_type: importSettings.dependent_field_settings.cost_code_field_name,
                display_name: importSettings.dependent_field_settings.cost_code_field_name,
                source_placeholder: importSettings.dependent_field_settings.cost_code_placeholder,
                is_dependent: true
              };
              this.costCodeFieldOption.push(this.customField);
              this.customField = {
                attribute_type: importSettings.dependent_field_settings.cost_type_field_name,
                display_name: importSettings.dependent_field_settings.cost_type_field_name,
                source_placeholder: importSettings.dependent_field_settings.cost_type_placeholder,
                is_dependent: true
              };
              this.costTypeFieldOption.push(this.customField);
            }
            break;
          }
        }

        if (configuration.reimbursable_expenses_object === IntacctReimbursableExpensesObject.EXPENSE_REPORT || configuration.corporate_credit_card_expenses_object === IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT) {
          this.intacctCategoryDestination = IntacctCategoryDestination.EXPENSE_TYPE;
        } else {
          this.intacctCategoryDestination = IntacctCategoryDestination.GL_ACCOUNT;
        }

        let label = new SnakeCaseToSpaceCasePipe().transform(this.intacctCategoryDestination);
        label = new SentenceCasePipe(this.translocoService).transform(label);
        label = label.replace('Gl ', 'GL ');
        this.intacctCategoryDestinationLabel = label;

        this.initializeForm(importSettings);
      }
    );
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  acceptDependentFieldWarning(isWarningAccepted: boolean): void {
    this.showDependentFieldWarning = false;
    if (!isWarningAccepted) {
      this.expenseFieldsGetter.controls.forEach((control) => {
        if (control.value.source_field === MappingSourceField.PROJECT) {
          control.patchValue({
            source_field: MappingSourceField.PROJECT,
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: true,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: control.value.source_placeholder
          });
          this.importSettingsForm.controls.isDependentImportEnabled.setValue(true);
          this.importSettingsForm.controls.costCodes.disable();
          this.importSettingsForm.controls.costTypes.disable();
        }
      });
    }
  }

  showWarningForDependentFields(event: any, formGroup: AbstractControl): void {
    if (!event.checked && formGroup.value.source_field === MappingSourceField.PROJECT && this.costCodeFieldOption[0].attribute_type !== 'custom_field') {
      this.showDependentFieldWarning = true;
    }
    if (formGroup.value.source_field) {
      this.addImportCodeField(event, formGroup.value.destination_field);
    }
  }

  save(): void {
    this.saveInProgress = true;
    const importSettingPayload = ImportSettings.constructPayload(this.importSettingsForm, this.dependentFieldSettings);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: ImportSettingPost) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctImportSettings.importSettingsSuccess'), undefined, this.isOnboarding);
      this.trackingService.trackTimeSpent(TrackingApp.INTACCT, Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.IMPORT_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.INTACCT, IntacctOnboardingState.IMPORT_SETTINGS, 3, importSettingPayload);
      } else {
        this.trackingService.intacctUpdateEvent(
          IntacctUpdateEvent.ADVANCED_SETTINGS_INTACCT,
          {
            phase: this.getPhase(),
            oldState: this.importSettings,
            newState: response
          }
        );
      }
      this.saveInProgress = false;
      if (this.isOnboarding) {
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/intacct/onboarding/advanced_settings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('intacctImportSettings.importSettingsError'));
      });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
