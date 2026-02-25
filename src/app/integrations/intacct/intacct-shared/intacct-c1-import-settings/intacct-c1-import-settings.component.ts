import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { IntacctCategoryDestination, ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, MappingSourceField, AppName, TrackingApp, FyleField, SageIntacctField } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { ImportSettingGet, ImportSettingPost, ImportSettings, IntacctDependentImportFields, MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiImportSettingsService } from 'src/app/core/services/si/si-configuration/si-import-settings.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';

@Component({
    selector: 'app-intacct-c1-import-settings',
    templateUrl: './intacct-c1-import-settings.component.html',
    styleUrls: ['./intacct-c1-import-settings.component.scss'],
    standalone: false
})
export class IntacctC1ImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  appName = AppName.INTACCT;

  importSettingsForm: FormGroup;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  expenseFields: FormArray;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.IMPORT_SETTING;

  saveInProgress: boolean = false;

  isOnboarding: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings?: ImportSettingGet;

  sageIntacctFields: ExpenseField[];

  fyleFields: ExpenseField[];

  showAddButton: boolean = true;

  toggleSwitchTrue: boolean = true;

  intacctCategoryDestination: IntacctCategoryDestination;

  showDialog: boolean;

  customField: ExpenseField;

  customFieldControl: AbstractControl;

  private sessionStartTime = new Date();

  costCodeFieldOption: ExpenseField[];

  costCategoryOption: ExpenseField[];

  customFieldOption: ExpenseField[];

  isDialogVisible: boolean = false;

  existingFields: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  readonly brandingConfig = brandingConfig;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.INTACCT.IMPORT_SETTING;

  dependentImportFields: IntacctDependentImportFields[];

  customFieldType: string;

  showDependentFieldWarning: boolean;

  readonly brandingStyle = brandingStyle;

  intacctImportCodeConfig: any;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]>;

  acceptedImportCodeField: string[] = [SageIntacctField.ACCOUNT, SageIntacctField.DEPARTMENT, MappingSourceField.PROJECT];

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private importSettingService: SiImportSettingsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService,
    public helper: HelperService,
    private translocoService: TranslocoService,
    private importSettingsService: ImportSettingsService
  ) { }

  private setupDependentAndCustomFields(): void {
    this.costCodeFieldOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctC1ImportSettings.createCustomField'), source_placeholder: null, is_dependent: true }];
    this.costCategoryOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctC1ImportSettings.createCustomField'), source_placeholder: null, is_dependent: true }];
    this.customFieldOption = [{ attribute_type: 'custom_field', display_name: this.translocoService.translate('intacctC1ImportSettings.createCustomField'), source_placeholder: null, is_dependent: false }];
    const dependentImportFields: IntacctDependentImportFields[] = [
      {
        source_field: this.translocoService.translate('intacctC1ImportSettings.costCode'),
        options: this.costCodeFieldOption,
        formController: 'costCodes',
        isDisabled: false
      },
      {
        source_field: this.translocoService.translate('intacctC1ImportSettings.costType'),
        options: this.costCategoryOption,
        formController: 'costTypes',
        isDisabled: false
      }
    ];
    this.dependentImportFields = dependentImportFields;
  }

  get expenseFieldsGetter() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  get importCodeFieldGetter() {
    return this.importSettingsForm.get('importCodeFields') as FormArray;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/intacct/onboarding/export_settings`]);
  }

  refreshDimensions() {
    this.mappingService.refreshSageIntacctDimensions().subscribe();
    this.mappingService.refreshFyleDimensions().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctC1ImportSettings.syncingDataDimensions'));
  }

  removeFilter(expenseField: AbstractControl) {
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

  showWarningForDependentFields(): void {
    this.showDependentFieldWarning = true;
  }

  addImportCodeField(event: any, sourceField: string): void {
    // Adds or removes import code field array based on the option selection, with/without code (helps for payload construction)
    const importCodeFieldsArray = this.importSettingsForm.get('importCodeFields') as FormArray;

    if (sourceField === IntacctCategoryDestination.GL_ACCOUNT || sourceField === 'GENERAL_LEDGER_ACCOUNT') {
      sourceField = IntacctCategoryDestination.ACCOUNT;
    }

    const index = importCodeFieldsArray.controls.findIndex(control => control?.get('source_field')?.value === sourceField);

    if (event.checked) {
      if (this.acceptedImportCodeField.includes(sourceField) && this.intacctImportCodeConfig[sourceField] && index === -1) {
        const value = this.formBuilder.group({
          source_field: [sourceField],
          import_code: [this.importSettingsService.getImportCodeField(this.importSettings!.configurations.import_code_fields, sourceField, this.intacctImportCodeConfig), Validators.required]
        });
        importCodeFieldsArray.push(value);
      }
    } else {
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

  handleImportCodeEnabled(event: [boolean, string, number]): void {
    const [isEnabled, , index] = event;
    const expenseField = (this.importSettingsForm.get('expenseFields') as FormArray).at(index);
    const destinationField = expenseField?.get('destination_field')?.value;

    // Add the attribute_type to the importCodeFields array if the destination has been selected, do nothing otherwise
    if (destinationField) {
      this.addImportCodeField({ checked: isEnabled }, destinationField);
    }
  }

  acceptDependentFieldWarning(data: ConfigurationWarningOut): void {
    this.showDependentFieldWarning = false;
    if (!data.hasAccepted) {
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

  addExpenseField() {
    this.expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;
    const defaultFieldData: MappingSetting = {
      source_field: '',
      destination_field: '',
      import_to_fyle: true,
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
    if (this.customFieldType?.length > 0 && this.customFieldForm.getRawValue()) {
      this.saveDependentCustomField();
    } else {
      this.saveFyleExpenseField();
    }
  }

  private dependentCostFieldsWatchers(formControllerName: string): void {
    this.importSettingsForm.controls[formControllerName].valueChanges.subscribe((value) => {
      if (value?.attribute_type === 'custom_field') {
        // Show a dialog when the "Create a custom field" button is clicked
        this.addCustomField();
        this.customFieldType = formControllerName;
        this.customFieldControl = this.importSettingsForm.controls[formControllerName];
        if (value.source_field === 'custom_field') {
          this.importSettingsForm.controls[formControllerName].patchValue({
            source_field: null
          });
        }
      } else if (value?.attribute_type && formControllerName === 'costCodes') {
        // Once the cost codes dialog is submitted and the field value is set,
        // 1. disable cost codes
        // 2. enable cost types
        this.importSettingsForm.get('costCodesImportToggle')?.setValue(true);
        this.importSettingsForm.get('costCodesImportToggle')?.disable();

        this.importSettingsForm.get('costTypes')?.enable();
        this.importSettingsForm.get('costTypesImportToggle')?.enable();
      }
    });
  }

  private dependentFieldWatchers(): void {
    if (this.importSettingsForm.get('costCodes')?.value) {
      this.helper.disableFormField(this.importSettingsForm, 'costCodes');
      this.helper.disableFormField(this.importSettingsForm, 'costCodesImportToggle');
    } else {
      // Cost types cannot be edited without first mapping cost codes
      this.helper.disableFormField(this.importSettingsForm, 'costTypes');
      this.helper.disableFormField(this.importSettingsForm, 'costTypesImportToggle');
      this.helper.disableFormField(this.importSettingsForm, 'costTypesImportToggle');
    }

    if (this.importSettingsForm.get('costTypes')?.value) {
      this.importSettingsForm.controls.costTypes.disable();
    }

    this.importSettingsForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
      if (isDependentImportEnabled) {
        this.helper.markControllerAsRequired(this.importSettingsForm, 'costCodes');
      } else {
        this.importSettingsForm?.get('costCodes')?.clearValidators();
      }
    });

    this.dependentCostFieldsWatchers('costCodes');
    this.dependentCostFieldsWatchers('costTypes');
  }

  saveDependentCustomField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.get('attribute_type')?.value,
      display_name: this.customFieldForm.get('attribute_type')?.value,
      source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
      is_dependent: true,
      is_custom: true
    };
    if (this.customFieldControl) {
      if (this.customFieldType === 'costCodes') {
        this.costCodeFieldOption.pop();
        this.costCodeFieldOption.push(this.customField);
      } else {
        this.costCategoryOption.pop();
        this.costCategoryOption.push(this.customField);
      }
      this.importSettingsForm.controls[this.customFieldType].patchValue(this.customField);
      this.customFieldForm.reset();
      this.showDialog = false;
    }
    this.customFieldControl.disable();
  }

  saveFyleExpenseField() {
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

  private addCustomField() {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: [null, Validators.required],
      display_name: [null],
      source_placeholder: [null, Validators.required]
    });
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
  }

  private createFormGroup(data: MappingSetting): FormGroup {
    return this.formBuilder.group({
      source_field: [data.source_field || '', RxwebValidators.unique()],
      destination_field: [data.destination_field || '', RxwebValidators.unique()],
      import_to_fyle: [data.import_to_fyle || false],
      is_custom: [data.is_custom || false],
      source_placeholder: [data.source_placeholder || null]
    });
  }

  // Main function to construct form array
  private constructFormArray(): FormGroup[] {
    const expenseFieldFormArray: FormGroup[] = [];
    const mappedFieldMap = new Map<string, any>();
    const unmappedFieldMap = new Map<string, any>();

    // First loop to populate mappedFieldMap
    this.sageIntacctFields.forEach((sageIntacctField) => {
      const mappingSetting = this.importSettings?.mapping_settings.find(
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

    expenseFieldFormArray.push(this.createFormGroup({
      source_field: FyleField.CATEGORY,
      destination_field: 'GENERAL_LEDGER_ACCOUNT',
      import_to_fyle: this.importSettings?.configurations.import_categories || false,
      is_custom: false,
      source_placeholder: null
    }));

    this.sageIntacctFields.push({ attribute_type: 'GENERAL_LEDGER_ACCOUNT', display_name: this.translocoService.translate('intacctC1ImportSettings.generalLedgerAccount'), source_placeholder: '', is_dependent: false });
    this.fyleFields.pop();
    this.fyleFields.push({ attribute_type: FyleField.CATEGORY, display_name: this.translocoService.translate('intacctC1ImportSettings.category'), source_placeholder: '', is_dependent: false });
    this.fyleFields.push(this.customFieldOption[0]);

    // Handle only mapped fields
    this.sageIntacctFields.forEach((sageIntacctField) => {
      const fieldData = mappedFieldMap.get(sageIntacctField.attribute_type);
      if (fieldData) {
        expenseFieldFormArray.push(this.createFormGroup(fieldData));
      }
    });

    this.sageIntacctFields.forEach((sageIntacctField) => {
      const fieldData = unmappedFieldMap.get(sageIntacctField.attribute_type);
      if (fieldData) {
        expenseFieldFormArray.push(this.createFormGroup(fieldData));
      }
    });

    return expenseFieldFormArray;
  }

  dependentFieldFormValue(fieldName: string, placeholder: string, formfield: string): ExpenseField {
    const fieldValue = {
      attribute_type: fieldName,
      display_name: fieldName,
      source_placeholder: placeholder,
      is_dependent: true,
      is_custom: true
    };

    if (formfield === 'costCodes') {
      this.costCodeFieldOption.pop();
      this.costCodeFieldOption.push(fieldValue);
    } else {
      this.costCategoryOption.pop();
      this.costCategoryOption.push(fieldValue);
    }

    return fieldValue;
  }

  private buildImportCodeFieldsFormArray(importSettings: ImportSettingGet): FormGroup[] {
    const importCodeFieldsFormArray: FormGroup[] = [];
    if (importSettings.configurations.import_code_fields && importSettings.configurations.import_code_fields.length > 0) {
      importSettings.configurations.import_code_fields.forEach((sourceField: string) => {
        if (this.acceptedImportCodeField.includes(sourceField) && this.intacctImportCodeConfig[sourceField]) {
          const formGroup = this.formBuilder.group({
            source_field: [sourceField],
            import_code: [this.importSettingsService.getImportCodeField(importSettings.configurations.import_code_fields, sourceField, this.intacctImportCodeConfig), Validators.required]
          });
          importCodeFieldsFormArray.push(formGroup);
        }
      });
    }
    return importCodeFieldsFormArray;
  }

  private initializeImportCodeFieldsForMappedFields(importSettings: ImportSettingGet): void {
    const expenseFields = this.importSettingsForm.get('expenseFields') as FormArray;

    let categoryDestination = this.intacctCategoryDestination as string;
    if (categoryDestination === IntacctCategoryDestination.GL_ACCOUNT) {
      categoryDestination = IntacctCategoryDestination.ACCOUNT;
    }

    if (importSettings.configurations.import_categories &&
        this.acceptedImportCodeField.includes(categoryDestination) &&
        this.intacctImportCodeConfig[categoryDestination]) {
      this.addImportCodeField({ checked: true }, this.intacctCategoryDestination);
    }

    expenseFields.controls.forEach((control) => {
      const mappingSetting = control.value;
      if (mappingSetting.import_to_fyle && mappingSetting.destination_field && mappingSetting.source_field &&
          mappingSetting.source_field !== FyleField.CATEGORY) {
        const destinationField = mappingSetting.destination_field;
        if (this.acceptedImportCodeField.includes(destinationField) && this.intacctImportCodeConfig[destinationField]) {
          this.addImportCodeField({ checked: true }, destinationField);
        }
      }
    });
  }

  private initializeForm(importSettings: ImportSettingGet): void {
    const importCodeFieldsFormArray = this.buildImportCodeFieldsFormArray(importSettings);

    this.importSettingsForm = this.formBuilder.group({
      importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
      importCategories: [importSettings.configurations.import_categories || null],
      importTaxCodes: [importSettings.configurations.import_tax_codes || false],
      costCodes: [importSettings.dependent_field_settings?.cost_code_field_name ? this.dependentFieldFormValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder, 'costCodes') : null],
      costCodesImportToggle: [true],
      sImportToggle: [true],
      workspaceId: this.storageService.get('workspaceId'),
      costTypes: [importSettings.dependent_field_settings?.cost_type_field_name ? this.dependentFieldFormValue(importSettings.dependent_field_settings.cost_type_field_name, importSettings.dependent_field_settings.cost_type_placeholder, 'costTypes') : null],
      costTypesImportToggle: [!!importSettings.dependent_field_settings?.is_cost_type_import_enabled],
      isDependentImportEnabled: [importSettings.dependent_field_settings?.is_import_enabled || false],
      sageIntacctTaxCodes: [importSettings.general_mappings.default_tax_code.id || null],
      expenseFields: this.formBuilder.array(this.constructFormArray()),
      importCodeField: [importSettings.configurations.import_code_fields],
      importCodeFields: this.formBuilder.array(importCodeFieldsFormArray)
    });

    this.initializeImportCodeFieldsForMappedFields(importSettings);
    this.importSettingWatcher();
    this.dependentFieldWatchers();
    this.isLoading = false;
  }

  private setupImportCodeSelectorOptions(): void {
    this.importCodeSelectorOptions = {
      "ACCOUNT": [
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleCodesAndNamesMeals')
        },
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleNamesOnlyMeals')
        }
      ],
      "DEPARTMENT": [
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleCodesAndNamesFinance')
        },
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleNamesOnlyFinance')
        }
      ],
      "PROJECT": [
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleCodesAndNamesConstruction')
        },
        {
          label: this.translocoService.translate('intacctC1ImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('intacctC1ImportSettings.exampleNamesOnlyConstruction')
        }
      ]
    };
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.setupDependentAndCustomFields();
    this.setupImportCodeSelectorOptions();

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const importSettingsObservable = this.importSettingService.getImportSettings();
    const configuration = this.mappingService.getConfiguration();
    const locationEntity = this.connectorService.getLocationEntityMapping();
    const importCodeFieldConfig = this.importSettingService.getImportCodeFieldConfig();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      importSettingsObservable,
      configuration,
      locationEntity,
      importCodeFieldConfig
    ]).subscribe(
      ([sageIntacctFields, fyleFields, importSettings, configuration, locationEntity, importCodeFieldConfig]) => {
        this.sageIntacctFields = sageIntacctFields.map(field => {
          return {
            ...field,
            display_name: field.display_name
          };
        });
        this.fyleFields = fyleFields;
        this.fyleFields.push(this.customFieldOption[0]);
        this.importSettings = importSettings;
        this.intacctImportCodeConfig = importCodeFieldConfig;

        if (configuration.employee_field_mapping==='EMPLOYEE') {
          this.intacctCategoryDestination = IntacctCategoryDestination.EXPENSE_TYPE;
        } else {
          this.intacctCategoryDestination = IntacctCategoryDestination.GL_ACCOUNT;
        }
        this.initializeForm(importSettings);
      }
    );
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save(): void {
    this.saveInProgress = true;
    const importSettingPayload = ImportSettings.constructPayload(this.importSettingsForm, this.importSettings!.dependent_field_settings);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: ImportSettingPost) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctC1ImportSettings.importSettingsSuccess'), undefined, this.isOnboarding);
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
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('intacctC1ImportSettings.importSettingsError'));
      });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
