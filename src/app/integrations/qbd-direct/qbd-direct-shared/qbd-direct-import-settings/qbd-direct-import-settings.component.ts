import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingKbArticles, brandingFeatureConfig, brandingContent } from 'src/app/branding/branding-config';
import { brandingConfig } from 'src/app/branding/c1-contents-config';
import { ExpenseField, ImportSettingsModel, ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, QBDReimbursableExpensesObject, QBDCorporateCreditCardExpensesObject, DefaultImportFields } from 'src/app/core/models/enum/enum.model';
import { QbdDirectImportSettingGet, QbdDirectImportSettingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model copy';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';

@Component({
  selector: 'app-qbd-direct-import-settings',
  standalone: true,
  imports: [],
  templateUrl: './qbd-direct-import-settings.component.html',
  styleUrl: './qbd-direct-import-settings.component.scss'
})
export class QbdDirectImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.QBO.IMPORT_SETTING;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.QBD_DIRECT;

  importSettingForm: FormGroup;

  qboFields: IntegrationField[];

  fyleFields: FyleField[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  importSettings: QbdDirectImportSettingGet;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customField: ExpenseField;

  customFieldOption: ExpenseField[] = ImportSettingsModel.getCustomFieldOption();

  chartOfAccountTypesList: string[] = QbdDirectImportSettingModel.getChartOfAccountTypesList();

  QBOReimbursableExpensesObject = QBDReimbursableExpensesObject;

  QBOCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean;

  qboImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  DefaultImportFields = DefaultImportFields;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.configuration.importSetting;

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
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private importSettingService: QbdDirectImportSettingsService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    public helper: HelperService
  ) { }

  closeModel() {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = false;
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  refreshDimensions() {}

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbd_direct/onboarding/export_settings`]);
  }

  getImportCodeSelectorOptions(destinationField: string): SelectFormOption[] {
    return this.importCodeSelectorOptions[destinationField];
  }

  updateImportCodeFieldConfig() {
    if (this.importSettingForm.controls.importCategories.value && this.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]) {
      this.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT] = false;
    }
  }

  saveFyleExpenseField(): void {
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
        destination_field: this.customFieldControl.get('destination_field')?.value,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
      ((this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0] as FormGroup).controls.import_to_fyle.disable();
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = shouldShowDialog;
  }

  updateImportCodeFields(isImportCodeEnabled: boolean, value: string): void {
    let fields = this.importSettingForm.get('importCodeFields')?.value;
    if (!isImportCodeEnabled && this.qboImportCodeFieldCodeConfig[value]) {
      fields = fields.filter((field: string) => field !== value);
    } else if (isImportCodeEnabled && !fields.includes(value)) {
      fields.push(value);
    }
    this.importSettingForm.get('importCodeFields')?.patchValue(fields);
  }

  private createCOAWatcher(): void {
    this.importSettingForm.controls.importCategories.valueChanges.subscribe((isImportCategoriesEnabled) => {
      if (!isImportCategoriesEnabled) {
        this.importSettingForm.controls.chartOfAccountTypes.setValue(['Expense']);
        this.importSettingForm.controls.importCategoryCode.clearValidators();
        this.importSettingForm.controls.importCategoryCode.setValue(ImportSettingsModel.getImportCodeField(this.importSettings.workspace_general_settings.import_code_fields, DefaultImportFields.ACCOUNT, this.qboImportCodeFieldCodeConfig));
      } if (isImportCategoriesEnabled) {
		    this.helper.markControllerAsRequired(this.importSettingForm, 'importCategoryCode');
      }
    });
  }

  private importCategroyCodeWatcher(): void {
    this.importSettingForm.controls.importCategoryCode.valueChanges.subscribe((isImportCategorieCode) => {
      if (isImportCategorieCode && this.importSettingForm.controls.importCategories) {
          this.updateImportCodeFields(true, DefaultImportFields.ACCOUNT);
        } else {
          this.updateImportCodeFields(false, DefaultImportFields.ACCOUNT);
        }
    });
  }

  private setupFormWatchers(): void {
    this.createCOAWatcher();
    this.importCategroyCodeWatcher();
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:AbstractControl) => {
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
        }
      });
    });
  }

  save() {}

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields('v1'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.importSettingService.getQbdDirectFields(),
      this.importSettingService.getImportCodeFieldConfig()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, workspaceGeneralSettings, qboFields, importCodeFieldConfig]) => {
      this.qboFields = qboFields;
      this.importSettings = importSettingsResponse;
      this.isImportMerchantsAllowed = !workspaceGeneralSettings.auto_create_merchants_as_vendors;

      this.qboImportCodeFieldCodeConfig = importCodeFieldConfig;
      this.importSettingForm = QbdDirectImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.qboFields, this.qboImportCodeFieldCodeConfig);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: false });
      this.updateImportCodeFieldConfig();
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }


  ngOnInit(): void {
    this.setupPage();
  }

}
