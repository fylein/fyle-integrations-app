import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingKbArticles } from 'src/app/branding/branding-config';
import { IntacctCategoryDestination, ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, MappingSourceField, AppName, TrackingApp, FyleField } from 'src/app/core/models/enum/enum.model';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { DependentFieldSetting, ImportSettingGet, ImportSettingPost, ImportSettings, MappingSetting } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-intacct-c1-import-settings',
  templateUrl: './intacct-c1-import-settings.component.html',
  styleUrls: ['./intacct-c1-import-settings.component.scss']
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

  importSettings: ImportSettingGet;

  sageIntacctFields: ExpenseField[];

  fyleFields: ExpenseField[];

  showAddButton: boolean = true;

  toggleSwitchTrue: boolean = true;

  intacctCategoryDestination: IntacctCategoryDestination;

  showDialog: boolean;

  customField: ExpenseField;

  customFieldControl: AbstractControl;

  private sessionStartTime = new Date();

  customFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: false }];

  isDialogVisible: boolean = false;

  existingFields: string[] = ['employee id', 'organisation name', 'employee name', 'employee email', 'expense date', 'expense date', 'expense id', 'report id', 'employee id', 'department', 'state', 'reporter', 'report', 'purpose', 'vendor', 'category', 'category code', 'mileage distance', 'mileage unit', 'flight from city', 'flight to city', 'flight from date', 'flight to date', 'flight from class', 'flight to class', 'hotel checkin', 'hotel checkout', 'hotel location', 'hotel breakfast', 'currency', 'amount', 'foreign currency', 'foreign amount', 'tax', 'approver', 'project', 'billable', 'cost center', 'cost center code', 'approved on', 'reimbursable', 'receipts', 'paid date', 'expense created date'];

  readonly brandingConfig = brandingConfig;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.INTACCT.IMPORT_SETTING;

  constructor(
    private router: Router,
    private mappingService: SiMappingsService,
    private connectorService: IntacctConnectorService,
    private importSettingService: SiImportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private storageService: StorageService,
    private workspaceService: SiWorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/intacct/onboarding/export_settings`]);
  }

  refreshDimensions() {
    this.mappingService.refreshSageIntacctDimensions().subscribe();
    this.mappingService.refreshFyleDimensions().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage Intacct');
  }

  removeFilter(expenseField: AbstractControl) {
    (expenseField as FormGroup).controls.source_field.patchValue('');
    (expenseField as FormGroup).controls.import_to_fyle.patchValue(false);
    event?.stopPropagation();
  }

  hasDuplicateOption(formGroup: AbstractControl, index: number, controlName: string): boolean {
    return (formGroup as FormGroup).controls[controlName].valid;
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
      import_to_fyle: true,
      is_custom: false,
      source_placeholder: null
    };
    this.expenseFields.push(this.createFormGroup(defaultFieldData));
    this.importSettingWatcher();
    this.showAddButton = this.showOrHideAddButton();
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showDialog = false;
  }

  saveCustomField() {
    this.customField = {
      attribute_type: this.customFieldForm.value.attribute_type.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.value.attribute_type,
      source_placeholder: this.customFieldForm.value.source_placeholder,
      is_dependent: false
    };

    if (this.customFieldControl) {
      this.fyleFields.pop();
      this.fyleFields.push(this.customField);
      this.fyleFields.push(this.customFieldOption[0]);
      const expenseField = {
        source_field: this.customField.attribute_type,
        destination_field: this.customFieldControl.value.destination_field,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingsForm.get('expenseFields') as FormArray).controls.filter(field => field.value.destination_field === this.customFieldControl.value.destination_field)[0].patchValue(expenseField);
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
            destination_field: control.value.destination_field,
            import_to_fyle: control.value.import_to_fyle,
            is_custom: control.value.is_custom,
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

    expenseFieldFormArray.push(this.createFormGroup({
      source_field: FyleField.CATEGORY,
      destination_field: 'GENERAL_LEDGER_ACCOUNT',
      import_to_fyle: this.importSettings?.configurations.import_categories || false,
      is_custom: false,
      source_placeholder: null
    }));

    this.sageIntacctFields.push({ attribute_type: 'GENERAL_LEDGER_ACCOUNT', display_name: 'General Ledger Account', source_placeholder: '', is_dependent: false });
    this.fyleFields.push({ attribute_type: FyleField.CATEGORY, display_name: 'Category', source_placeholder: '', is_dependent: false });

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

  private initializeForm(importSettings: ImportSettingGet): void {
    this.importSettingsForm = this.formBuilder.group({
      importVendorAsMerchant: [importSettings.configurations.import_vendors_as_merchants || null],
      importCategories: [importSettings.configurations.import_categories || null],
      importTaxCodes: [false],
      costCodes: [null],
      dependentFieldImportToggle: [false],
      workspaceId: this.storageService.get('workspaceId'),
      costTypes: [null],
      isDependentImportEnabled: [false],
      sageIntacctTaxCodes: [null],
      expenseFields: this.formBuilder.array(this.constructFormArray())
    });

    this.importSettingWatcher();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const sageIntacctFieldsObservable = this.mappingService.getSageIntacctFields();
    const fyleFieldsObservable = this.mappingService.getFyleFields();
    const importSettingsObservable = this.importSettingService.getImportSettings();
    const configuration = this.mappingService.getConfiguration();
    const locationEntity = this.connectorService.getLocationEntityMapping();

    forkJoin([
      sageIntacctFieldsObservable,
      fyleFieldsObservable,
      importSettingsObservable,
      configuration,
      locationEntity
    ]).subscribe(
      ([sageIntacctFields, fyleFields, importSettings, configuration, locationEntity]) => {
        this.sageIntacctFields = sageIntacctFields.map(field => {
          return {
            ...field,
            display_name: this.toTitleCase(field.display_name)
          };
        });
        this.fyleFields = fyleFields;
        this.fyleFields.push(this.customFieldOption[0]);
        this.importSettings = importSettings;

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
    const importSettingPayload = ImportSettings.constructPayload(this.importSettingsForm, null);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: ImportSettingPost) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
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
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
      });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
