import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppName, AppNameInService, ConfigurationCta, DefaultImportFields, MappingSourceField, Page, Sage300OnboardingState, Sage300UpdateEvent, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { Sage300ImportSettingGet, Sage300DefaultFields, Sage300ImportSettingModel, Sage300DependentImportFields, Sage300ImportSettingsDependentFieldSetting } from 'src/app/core/models/sage300/sage300-configuration/sage300-import-settings.model';
import { ExpenseField, ImportCodeFieldConfigType, ImportSettingMappingRow, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { IntegrationField, FyleField } from 'src/app/core/models/db/mapping.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { Sage300ImportSettingsService } from 'src/app/core/services/sage300/sage300-configuration/sage300-import-settings.service';
import { Sage300HelperService } from 'src/app/core/services/sage300/sage300-helper/sage300-helper.service';
import { fyleFieldsResponse, importSettingsResponse, sage300FieldsResponse } from '../fixture';
import { catchError, forkJoin, of } from 'rxjs';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';

@Component({
  selector: 'app-sage300-import-settings',
  templateUrl: './sage300-import-settings.component.html',
  styleUrls: ['./sage300-import-settings.component.scss']
})
export class Sage300ImportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  importSettings: Sage300ImportSettingGet | null | any;

  importSettingForm: FormGroup;

  isLoading: boolean = true;

  fyleFields: FyleField[];

  sage300Fields: IntegrationField[];

  customFieldForm: FormGroup;

  showCustomFieldDialog: boolean = false;

  isPreviewDialogVisible: boolean;

  customFieldControl: AbstractControl;

  isDependentFieldAllowed: boolean;

  appName: string = AppName.SAGE300;

  customField: any;

  costCodeFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: true }];

  costCategoryOption:ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: true }];

  customFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: false }];

  customFieldForDependentField: boolean = false;

  customFieldType: string = '';

  sessionStartTime = new Date();

  readonly defaultImportFields: Sage300DefaultFields[] = [
    {
      source_field: DefaultImportFields.CATEGORY,
      destination_field: DefaultImportFields.ACCOUNT,
      formController: 'importCategories',
      import_code: 'importCategoryCode'
    },
    {
      source_field: DefaultImportFields.MERCHANT,
      destination_field: DefaultImportFields.VENDOR,
      formController: 'importVendorAsMerchant',
      import_code: 'importVendorCode'
    }
  ];

  readonly dependentImportFields: Sage300DependentImportFields[] = [
    {
      source_field: 'Cost Codes',
      options: this.costCodeFieldOption,
      formController: 'costCodes',
      isDisabled: false
    },
    {
      source_field: 'Cost Category',
      options: this.costCategoryOption,
      formController: 'costCategory',
      isDisabled: false
    }
  ];

  showDependentFieldWarning: boolean;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.SAGE300.IMPORT_SETTING;

  dependantFieldSupportArticleLink: string = brandingKbArticles.onboardingArticles.SAGE300.DEPENDANT_FIELD;

  commitmentFieldSupportArticleLink: string = brandingKbArticles.onboardingArticles.SAGE300.COMMITMENT_FIELD;

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingConfig = brandingConfig;

  sage300ImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  constructor(
    private router: Router,
    private importSettingService: Sage300ImportSettingsService,
    private mappingService: MappingService,
    private helperService: Sage300HelperService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private helper: HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingForm.get('expenseFields') as FormArray;
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = false;
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
          this.importSettingForm.controls.isDependentImportEnabled.setValue(true);
        }
      });
    }
  }

  showWarningForDependentFields(): void {
    this.showDependentFieldWarning = true;
  }

  saveDependentCustomField(formControllerName: string): void {
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
        this.costCodeFieldOption.push(this.customFieldOption[0]);
      } else {
        this.costCategoryOption.pop();
        this.costCategoryOption.push(this.customField);
        this.costCategoryOption.push(this.customFieldOption[0]);
      }
      this.importSettingForm.controls[formControllerName].patchValue(this.customField);

      this.fyleFields = this.fyleFields.filter(field => !field.is_dependent);
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
    this.importSettingForm.controls[formControllerName].disable();
    this.customFieldForDependentField = false;
  }

  saveFyleExpenseField(): void {
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
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  saveCustomField() {
    if (this.customFieldType.length > 0 && this.customFieldForm.getRawValue()) {
      this.saveDependentCustomField(this.customFieldType);
    } else {
      this.saveFyleExpenseField();
    }
  }

  private dependentCostFieldsWatchers(formControllerName: string): void {
    this.importSettingForm.controls[formControllerName].valueChanges.subscribe((value) => {
      if (value?.attribute_type === 'custom_field') {
        this.initializeCustomFieldForm(true);
        this.customFieldType = formControllerName;
        this.customFieldControl = this.importSettingForm.controls[formControllerName];
        if (value.source_field === 'custom_field') {
          this.importSettingForm.controls[formControllerName].patchValue({
            source_field: null
          });
        }
      } else if (value) {
        this.dependentImportFields.forEach((fields, index) => {
          if (fields.formController === formControllerName) {
            this.dependentImportFields[index].isDisabled = true;
          }
        });
      }
    });
  }

  private dependentFieldWatchers(): void {
    if (this.importSettingForm.get('isDependentImportEnabled')?.value) {
      this.helper.disableFormField(this.importSettingForm, 'costCodes');
      this.helper.disableFormField(this.importSettingForm, 'costCategory');
    }

    this.importSettingForm.controls.isDependentImportEnabled.valueChanges.subscribe((isDependentImportEnabled) => {
      if (isDependentImportEnabled) {
        this.helper.enableFormField(this.importSettingForm, 'costCodes');
        this.helper.enableFormField(this.importSettingForm, 'costCategory');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCodes');
        this.helper.markControllerAsRequired(this.importSettingForm, 'costCategory');
        this.dependentImportFields[0].isDisabled = false;
        this.dependentImportFields[1].isDisabled = false;
      } else {
        this.helper.disableFormField(this.importSettingForm, 'costCodes');
        this.helper.disableFormField(this.importSettingForm, 'costCategory');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCodes');
        this.helper.clearValidatorAndResetValue(this.importSettingForm, 'costCategory');
        this.dependentImportFields[0].isDisabled = true;
        this.dependentImportFields[1].isDisabled = true;
      }
    });

    this.dependentCostFieldsWatchers('costCodes');
    this.dependentCostFieldsWatchers('costCategory');
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: ['', Validators.required],
      display_name: [''],
      source_placeholder: ['', Validators.required]
    });
    this.showCustomFieldDialog = shouldShowDialog;
  }

  updateImportCodeFields(isImportCodeEnabled: boolean, value: string): void {
    let fields = this.importSettingForm.get('importCodeFields')?.value;
    if (!isImportCodeEnabled && this.sage300ImportCodeFieldCodeConfig[value]) {
      fields = fields.filter((field: string) => field !== value);
    } else if (isImportCodeEnabled && !fields.includes(value)) {
      fields.push(value);
    }
    this.importSettingForm.get('importCodeFields')?.patchValue(fields);
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
          this.customFieldControl = control;
          this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: null
          });
        } else if (value.source_field === 'PROJECT' && value.destination_field === 'PROJECT') {
          this.isDependentFieldAllowed = true;
        } else if (control.value.import_code &&  control.value.import_to_fyle) {
          this.updateImportCodeFields(true, value.destination_field);
        } else if (!control.value.import_code || !control.value.import_to_fyle) {
          const onboardingState = this.workspaceService.getOnboardingState();
	        if (onboardingState === Sage300OnboardingState.IMPORT_SETTINGS) {
            this.updateImportCodeFields(false, value.destination_field);
          }
        }
      });
    });
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  isExpenseFieldDependent(expenseField: ImportSettingMappingRow): boolean {
    const isDependent = this.fyleFields.find(field => field.attribute_type === expenseField.source_field);
    return isDependent ? true : false;
  }

  dependentFieldFormCreation(){
    const mappingSettings = this.importSettings?.mapping_settings;

    if (mappingSettings) {
      for (const setting of mappingSettings) {
        const { source_field, destination_field, import_to_fyle } = setting;
        if (source_field === 'PROJECT' && destination_field === 'JOB' && import_to_fyle === true) {
          if (this.importSettings?.dependent_field_settings?.is_import_enabled) {
            this.customField = {
              attribute_type: this.importSettings.dependent_field_settings.cost_code_field_name,
              display_name: this.importSettings.dependent_field_settings.cost_code_field_name,
              source_placeholder: this.importSettings.dependent_field_settings.cost_code_placeholder,
              is_dependent: true
            };
            this.costCodeFieldOption.push(this.customField);
            this.customField = {
              attribute_type: this.importSettings.dependent_field_settings.cost_category_field_name,
              display_name: this.importSettings.dependent_field_settings.cost_category_field_name,
              source_placeholder: this.importSettings.dependent_field_settings.cost_category_placeholder,
              is_dependent: true
            };
            this.costCategoryOption.push(this.customField);
            this.dependentImportFields[0].isDisabled = true;
            this.dependentImportFields[1].isDisabled = true;
          }
          break;
        }
      }
    }
  }


  private defaultFieldCodeImportFieldWatcher() {
    this.importSettingForm.controls.importCategoryCode.valueChanges.subscribe((importCode) => {
      if (importCode && this.importSettingForm.controls.importCategories) {
        this.updateImportCodeFields(true, DefaultImportFields.ACCOUNT);
      } else {
        this.updateImportCodeFields(false, DefaultImportFields.ACCOUNT);
      }
    });

    this.importSettingForm.controls.importVendorCode.valueChanges.subscribe((importCode) => {
      if (importCode && this.importSettingForm.controls.importVendorAsMerchant) {
        this.updateImportCodeFields(true, DefaultImportFields.VENDOR);
      } else {
        this.updateImportCodeFields(false, DefaultImportFields.VENDOR);
      }
    });
  }

  private defaultFieldWatcher() {
    this.importSettingForm.controls.importCategories.valueChanges.subscribe((importFromFyle) => {
      if (importFromFyle) {
        this.helper.markControllerAsRequired(this.importSettingForm, 'importCategoryCode');
      } else {
        this.importSettingForm.controls.importCategoryCode.clearValidators();
        this.importSettingForm.controls.importCategoryCode.setValue(ImportSettingsModel.getImportCodeField(this.importSettings.import_settings.import_code_fields, DefaultImportFields.ACCOUNT, this.sage300ImportCodeFieldCodeConfig));
      }
    });

    this.importSettingForm.controls.importVendorAsMerchant.valueChanges.subscribe((importFromFyle) => {
      if (importFromFyle) {
        this.helper.markControllerAsRequired(this.importSettingForm, 'importVendorCode');
      } else {
        this.importSettingForm.controls.importVendorCode.clearValidators();
        this.importSettingForm.controls.importVendorCode.setValue(ImportSettingsModel.getImportCodeField(this.importSettings.import_settings.import_code_fields, DefaultImportFields.VENDOR, this.sage300ImportCodeFieldCodeConfig));
      }
    });
  }

  private setupFormWatchers() {
    this.importSettingWatcher();
    this.defaultFieldWatcher();
    this.dependentFieldWatchers();
    this.defaultFieldCodeImportFieldWatcher();
  }

updateImportCodeFieldConfig() {
    if (this.importSettingForm.controls.importCategories.value && this.sage300ImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]) {
      this.sage300ImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT] = false;
    }
    if (this.importSettingForm.controls.importVendorAsMerchant.value && this.sage300ImportCodeFieldCodeConfig[DefaultImportFields.VENDOR]) {
      this.sage300ImportCodeFieldCodeConfig[DefaultImportFields.VENDOR] = false;
    }

    this.expenseFieldsGetter.controls.forEach(element => {
      if (element.value.import_to_fyle && this.sage300ImportCodeFieldCodeConfig[element.value.destination_field]) {
        this.sage300ImportCodeFieldCodeConfig[element.value.destination_field] = false;
      }
    });
  }

  constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const importSettingPayload = Sage300ImportSettingModel.createImportSettingPayload(this.importSettingForm, this.importSettings);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((importSettingsResponse: Sage300ImportSettingGet) => {
      this.isSaveInProgress = false;
      this.updateImportCodeFieldConfig();
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.SAGE300, Page.IMPORT_SETTINGS_SAGE300, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === Sage300OnboardingState.IMPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.SAGE300, Sage300OnboardingState.IMPORT_SETTINGS, 3, importSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.SAGE300,
          Sage300UpdateEvent.ADVANCED_SETTINGS_SAGE300,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.importSettings,
            newState: importSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/sage300/onboarding/advanced_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
      });
  }

  save(): void {
    if (this.importSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getSage300ImportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getFyleFields(),
      this.mappingService.getIntegrationsFields(AppNameInService.SAGE300),
      this.importSettingService.getImportCodeFieldConfig()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, sage300FieldsResponse, importCodeFieldConfig]) => {
      this.importSettings = importSettingsResponse;
      this.importSettingForm = Sage300ImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, sage300FieldsResponse, importCodeFieldConfig);
      this.fyleFields = fyleFieldsResponse;
      this.sage300Fields = sage300FieldsResponse;
      this.sage300ImportCodeFieldCodeConfig = importCodeFieldConfig;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: false });
      this.setupFormWatchers();
      this.updateImportCodeFieldConfig();
      this.dependentFieldFormCreation();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/sage300/onboarding/export_settings`]);
  }

}
