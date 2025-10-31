import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ExpenseField, ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, DefaultImportFields, QBOCorporateCreditCardExpensesObject, QBOField, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { QBOImportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { TranslocoService } from '@jsverse/transloco';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-qbo-import-settings',
  templateUrl: './qbo-import-settings.component.html',
  styleUrls: ['./qbo-import-settings.component.scss']
})
export class QboImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.QBO.IMPORT_SETTING;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.QBO;

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

  importSettings: QBOImportSettingGet;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customField: ExpenseField;

  customFieldOption: ExpenseField[];

  chartOfAccountTypesList: string[];

  workspaceGeneralSettings: QBOWorkspaceGeneralSetting;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean;

  qboImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  DefaultImportFields = DefaultImportFields;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]>;

  readonly brandingStyle = brandingStyle;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private helperService: QboHelperService,
    private importSettingService: QboImportSettingsService,
    private qboConnectorService: QboConnectorService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    public helper: HelperService,
    private translocoService: TranslocoService,
    private exportSettingsService: ExportSettingsService,
    public brandingService: BrandingService
  ) {
    this.customFieldOption = this.importSettingService.getCustomFieldOption();
    this.chartOfAccountTypesList = this.importSettingService.getChartOfAccountTypesList();
  }

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

  refreshDimensions() {
    this.helperService.refreshQBODimensions().subscribe();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/export_settings`]);
  }

  getImportCodeSelectorOptions(destinationField: string): SelectFormOption[] {
    return this.importCodeSelectorOptions[destinationField];
  }

  updateImportCodeFieldConfig() {
    if (this.importSettingForm.controls.importCategories.value && this.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]) {
      this.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT] = false;
    }
  }

  save(): void {
    this.isSaveInProgress = true;
    const importSettingPayload = this.importSettingService.constructPayload(this.importSettingForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qboImportSettings.importSettingsSuccess'));
      this.updateImportCodeFieldConfig();
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBOOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/qbo/onboarding/advanced_settings`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qboImportSettings.importSettingsError'));
    });
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
      ((this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0] as FormGroup).controls.import_to_fyle.disable();
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = shouldShowDialog;
  }

  private createTaxCodeWatcher(): void {
    this.importSettingForm.controls.taxCode.valueChanges.subscribe((isTaxCodeEnabled) => {
      if (isTaxCodeEnabled) {
        this.importSettingForm.controls.defaultTaxCode.setValidators(Validators.required);
      } else {
        this.importSettingForm.controls.defaultTaxCode.clearValidators();
        this.importSettingForm.controls.defaultTaxCode.setValue(null);
      }
    });
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
        this.importSettingForm.controls.importCategoryCode.setValue(this.importSettingService.getImportCodeField(this.importSettings.workspace_general_settings.import_code_fields, DefaultImportFields.ACCOUNT, this.qboImportCodeFieldCodeConfig));
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
    this.createTaxCodeWatcher();
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

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.importCodeSelectorOptions = {
      "ACCOUNT": [
        {
          label: this.translocoService.translate('qboImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('qboImportSettings.importCodesAndNamesSubLabel')
        },
        {
          label: this.translocoService.translate('qboImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('qboImportSettings.importNamesOnlySubLabel')
        }
      ]
    };
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields('v1'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.qboConnectorService.getQBOCredentials(),
      this.mappingService.getDestinationAttributes(QBOField.TAX_CODE, 'v1', 'qbo'),
      this.importSettingService.getQBOFields(),
      this.importSettingService.getImportCodeFieldConfig()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, workspaceGeneralSettings, qboCredentials, taxCodes, qboFields, importCodeFieldConfig]) => {
      this.qboFields = qboFields;
      this.importSettings = importSettingsResponse;
      this.workspaceGeneralSettings = workspaceGeneralSettings;
      this.taxCodes = taxCodes.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option));
      this.isImportMerchantsAllowed = !workspaceGeneralSettings.auto_create_merchants_as_vendors;

      if (qboCredentials && qboCredentials.country !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      this.qboImportCodeFieldCodeConfig = importCodeFieldConfig;
      this.importSettingForm = this.importSettingService.mapAPIResponseToFormGroup(this.importSettings, this.qboFields, this.qboImportCodeFieldCodeConfig);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: this.translocoService.translate('qboImportSettings.createCustomField'), is_dependent: false });
      this.updateImportCodeFieldConfig();
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }


  ngOnInit(): void {
    this.customFieldOption = this.importSettingService.getCustomFieldOption();
    this.chartOfAccountTypesList = this.importSettingService.getChartOfAccountTypesList();
    this.setupPage();
  }

}
