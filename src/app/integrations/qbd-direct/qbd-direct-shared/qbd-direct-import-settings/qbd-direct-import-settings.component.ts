import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { catchError, forkJoin, of } from 'rxjs';
import { brandingKbArticles, brandingFeatureConfig, brandingStyle, brandingConfig } from 'src/app/branding/branding-config';
import { ExpenseField, ImportCodeFieldConfigType } from 'src/app/core/models/common/import-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, QBDReimbursableExpensesObject, QBDCorporateCreditCardExpensesObject, DefaultImportFields, ToastSeverity, QbdDirectOnboardingState, ProgressPhase, QbdDirectUpdateEvent, TrackingApp, Page } from 'src/app/core/models/enum/enum.model';
import { QbdDirectImportSettingGet, QbdDirectImportSettingPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';
import { QbdDirectExportSettingGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdDirectAdvancedSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.service';
import { QbdDirectExportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.service';
import { QbdDirectImportSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.service';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
    selector: 'app-qbd-direct-import-settings',
    imports: [CommonModule, SharedModule, MultiSelectModule, TranslocoModule],
    templateUrl: './qbd-direct-import-settings.component.html',
    styleUrl: './qbd-direct-import-settings.component.scss'
})
export class QbdDirectImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.QBD_DIRECT.IMPORT_SETTING;

  isConfigToggleLeftAligned = brandingFeatureConfig.qbdDirect.configToggleLeftAligned;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.QBD_DIRECT;

  importSettingForm: FormGroup;

  QbdDirectFields: IntegrationField[];

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

  importSettings: QbdDirectImportSettingGet | null;

  exportSettings: QbdDirectExportSettingGet;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customField: ExpenseField;

  customFieldOption: ExpenseField[] = this.qbdDirectImportSettingsService.getCustomFieldOption();

  chartOfAccountTypesList: string[] = this.qbdDirectImportSettingsService.getChartOfAccountTypesList();

  QbdDirectReimbursableExpensesObject = QBDReimbursableExpensesObject;

  QbdDirectCorporateCreditCardExpensesObject = QBDCorporateCreditCardExpensesObject;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean = true;

  QbdDirectImportCodeFieldCodeConfig: ImportCodeFieldConfigType;

  DefaultImportFields = DefaultImportFields;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  importCodeSelectorOptions: Record<string, { label: string; value: boolean; subLabel: string; }[]>;

  sessionStartTime: Date = new Date();

  readonly brandingStyle = brandingStyle;

  constructor(
    private formBuilder: FormBuilder,
    private importSettingService: QbdDirectImportSettingsService,
    private mappingService: MappingService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private advancedSettingsService: QbdDirectAdvancedSettingsService,
    private exportSettingService: QbdDirectExportSettingsService,
    private qbdDirectHelperService: QbdDirectHelperService,
    public helper: HelperService,
    private trackingService: TrackingService,
    private translocoService: TranslocoService,
    private qbdDirectImportSettingsService: QbdDirectImportSettingsService,
    public brandingService: BrandingService
  ) {
    this.customFieldOption = this.qbdDirectImportSettingsService.getCustomFieldOption();
    this.chartOfAccountTypesList = this.qbdDirectImportSettingsService.getChartOfAccountTypesList();
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
    this.qbdDirectHelperService.importAttributes(true);
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbd_direct/onboarding/export_settings`]);
  }

  getImportCodeSelectorOptions(destinationField: string): SelectFormOption[] {
    return this.importCodeSelectorOptions[destinationField];
  }

  updateImportCodeFieldConfig() {
    if (this.importSettingForm.controls.importCategories.value && this.QbdDirectImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]) {
      this.QbdDirectImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT] = false;
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
    if (!isImportCodeEnabled && this.QbdDirectImportCodeFieldCodeConfig[value]) {
      fields = fields?.filter((field: string) => field !== value);
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
        this.importSettingForm.controls.importCategoryCode.setValue(this.importSettings?.import_settings?.import_code_fields ? this.qbdDirectImportSettingsService.getImportCodeField(this.importSettings.import_settings.import_code_fields, DefaultImportFields.ACCOUNT, this.QbdDirectImportCodeFieldCodeConfig) : null);
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

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save(): void {
    this.isSaveInProgress = true;
    const importSettingPayload = this.qbdDirectImportSettingsService.constructPayload(this.importSettingForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe((response: QbdDirectImportSettingPost) => {
      this.trackingService.trackTimeSpent(TrackingApp.QBD_DIRECT, Page.IMPORT_SETTINGS_QBD_DIRECT, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QbdDirectOnboardingState.IMPORT_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.QBD_DIRECT, QbdDirectOnboardingState.IMPORT_SETTINGS, 4, importSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD_DIRECT,
          QbdDirectUpdateEvent.IMPORT_SETTINGS_QBD_DIRECT,
          {
            phase: this.getPhase(),
            oldState: this.importSettings,
            newState: response
          }
        );
      }

      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdDirectImportSettings.saveSuccess'));
      this.updateImportCodeFieldConfig();
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QbdDirectOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/qbd_direct/onboarding/advanced_settings`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectImportSettings.saveError'));
    });
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields(),
      this.importSettingService.getQbdDirectFields(),
      this.importSettingService.getImportCodeFieldConfig(),
      this.advancedSettingsService.getQbdAdvancedSettings().pipe(catchError(() => of(null))),
      this.exportSettingService.getQbdExportSettings()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, QbdDirectFields, importCodeFieldConfig, advancedSettingsResponse, exportSettingsResponse]) => {
      this.QbdDirectFields = QbdDirectFields;
      this.importSettings = importSettingsResponse;
      this.exportSettings = exportSettingsResponse;

      this.QbdDirectImportCodeFieldCodeConfig = importCodeFieldConfig;
      this.isImportMerchantsAllowed = advancedSettingsResponse?.auto_create_merchant_as_vendor ? false : true;
      this.importSettingForm = this.qbdDirectImportSettingsService.mapAPIResponseToFormGroup(this.importSettings, this.QbdDirectFields, this.QbdDirectImportCodeFieldCodeConfig);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: this.translocoService.translate('qbdDirectImportSettings.createCustomField'), is_dependent: false });
      this.updateImportCodeFieldConfig();
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }


  ngOnInit(): void {
    this.importCodeSelectorOptions = {
      "ACCOUNT": [
        {
          label: this.translocoService.translate('qbdDirectImportSettings.importCodesAndNames'),
          value: true,
          subLabel: this.translocoService.translate('qbdDirectImportSettings.importCodesAndNamesSubLabel')
        },
        {
          label: this.translocoService.translate('qbdDirectImportSettings.importNamesOnly'),
          value: false,
          subLabel: this.translocoService.translate('qbdDirectImportSettings.importNamesOnlySubLabel')
        }
      ]
    };
    this.setupPage();
  }

}
