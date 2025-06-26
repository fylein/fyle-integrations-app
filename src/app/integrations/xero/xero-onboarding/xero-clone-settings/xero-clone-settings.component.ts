import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AdvancedSettingsModel } from 'src/app/core/models/common/advanced-settings.model';
import { ExportSettingModel } from 'src/app/core/models/common/export-settings.model';
import { ExpenseField, ImportSettingsModel } from 'src/app/core/models/common/import-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, InputType, ToastSeverity, XeroCorporateCreditCardExpensesObject, XeroFyleField } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Org } from 'src/app/core/models/org/org.model';
import { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { XeroCloneSetting, XeroCloneSettingModel } from 'src/app/core/models/xero/xero-configuration/clone-setting.model';
import { XeroAdvancedSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-advanced-settings.model';
import { XeroExportSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { XeroImportSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-import-settings.model';
import { XeroOnboardingModel } from 'src/app/core/models/xero/xero-configuration/xero-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { XeroImportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-import-settings.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-xero-clone-settings',
  templateUrl: './xero-clone-settings.component.html',
  styleUrls: ['./xero-clone-settings.component.scss']
})
export class XeroCloneSettingsComponent implements OnInit {

  isLoading: boolean = true;

  onboardingSteps: OnboardingStepper[] = [];

  brandingConfig = brandingConfig;

  brandingFeatureConfig = brandingFeatureConfig;

  bankAccounts: DefaultDestinationAttribute[];

  reimbursableExportTypes = XeroExportSettingModel.getReimbursableExportTypes();

  creditCardExportTypes =  XeroExportSettingModel.getCreditCardExportTypes();

  reimbursableExpenseGroupByOptions =  XeroExportSettingModel.getReimbursableExpenseGroupingOptions();

  cccExpenseGroupByOptions =  XeroExportSettingModel.getCCCExpenseGroupingOptions();

  reimbursableExpenseGroupingDateOptions =  XeroExportSettingModel.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions = XeroExportSettingModel.getCCCExpenseGroupingDateOptions();

  autoMapEmployeeTypes = XeroExportSettingModel.getAutoMapEmployeeOptions();

  expenseStateOptions = XeroExportSettingModel.getReimbursableExpenseStateOptions();

  cccExpenseStateOptions = XeroExportSettingModel.getCCCExpenseStateOptions();

  splitExpenseGroupingOptions = XeroExportSettingModel.getSplitExpenseGroupingOptions();

  exportSettingForm: FormGroup;

  xeroFields: IntegrationField[];

  fyleFields: FyleField[];

  cloneSetting: XeroCloneSetting;

  appName: AppName = AppName.XERO;

  InputType = InputType;

  customFieldOption: ExpenseField[] = ImportSettingsModel.getCustomFieldOption();

  chartOfAccountTypesList: string[] = XeroImportSettingModel.getChartOfAccountTypesList().map((name: string) => name[0]+name.substr(1).toLowerCase());

  isTaxGroupSyncAllowed: boolean;

  isProjectMapped: boolean;

  isCustomerPresent: boolean;

  taxCodes: DefaultDestinationAttribute[];

  importSettingForm: FormGroup;

  paymentSyncOptions: SelectFormOption[] = XeroAdvancedSettingModel.getPaymentSyncOptions();

  org: Org = this.orgService.getCachedOrg();

  scheduleIntervalHours: SelectFormOption[] = AdvancedSettingsModel.getHoursOptions();

  advancedSettingForm: FormGroup<any>;

  adminEmails: QBDEmailOptions[];

  billPaymentAccounts: DefaultDestinationAttribute[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  isWarningDialogVisible: boolean;

  warningEvent: ConfigurationWarningEvent;

  warningHeaderText: string;

  warningContextText: string;

  primaryButtonText: string;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  showCustomFieldDialog: boolean;

  isPreviewDialogVisible: boolean;

  customField: { attribute_type: any; display_name: any; source_placeholder: any; is_dependent: boolean; };

  customFieldControl: any;

  customFieldType: string;

  XeroCorporateCreditCardExpensesObject = XeroCorporateCreditCardExpensesObject;

  readonly brandingStyle = brandingStyle;

  constructor(
    private cloneSettingService: CloneSettingService,
    private configurationService: ConfigurationService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private exportSettingService: XeroExportSettingsService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private xeroConnectorService: XeroConnectorService,
    private xeroImportSettingsService: XeroImportSettingsService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private orgService: OrgService,
    private translocoService: TranslocoService
  ) { }

  resetCloneSetting(): void {
    this.warningHeaderText = this.translocoService.translate('xeroCloneSettings.areYouSure');
    this.warningContextText = this.translocoService.translate('xeroCloneSettings.resetConfigurationWarning');
    this.primaryButtonText = this.translocoService.translate('xeroCloneSettings.yes');
    this.warningEvent = ConfigurationWarningEvent.RESET_CONFIGURATION;

    this.isWarningDialogVisible = true;
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isWarningDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/xero/onboarding/export_settings`]);
    }
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/xero/onboarding/connector`]);
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

  save(): void {
    this.isSaveInProgress = true;
    const cloneSettingPayload = XeroCloneSettingModel.constructPayload(this.exportSettingForm, this.importSettingForm, this.advancedSettingForm, this.isTaxGroupSyncAllowed);

    this.cloneSettingService.postCloneSettings(cloneSettingPayload).subscribe((response) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('xeroCloneSettings.clonedSettingsSuccess'));
      this.router.navigate([`/integrations/xero/onboarding/done`]);
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('xeroCloneSettings.clonedSettingsError'));
    });

  }

  private setupOnboardingSteps(): void {
    const onboardingSteps = new XeroOnboardingModel().getOnboardingSteps('Clone settings', this.workspaceService.getOnboardingState());
    this.onboardingSteps.push(onboardingSteps[0]);
    this.onboardingSteps.push({
      active: false,
      completed: false,
      step: this.translocoService.translate('xeroCloneSettings.cloneSettingsStep'),
      icon: 'gear-medium',
      route: '/integrations/xero/onboarding/clone_settings',
      styleClasses: ['step-name-export--text']
    });
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

  private createCOAWatcher(): void {
    this.importSettingForm.controls.importCategories.valueChanges.subscribe((isImportCategoriesEnabled) => {
      if (!isImportCategoriesEnabled) {
        this.importSettingForm.controls.chartOfAccountTypes.setValue(['Expense']);
      }
    });
  }

  private createImportCustomerWatcher(): void {
    this.importSettingForm.controls.importCustomers.valueChanges.subscribe((isCustomerImportEnabled) => {
      if (isCustomerImportEnabled) {
        this.fyleFields = this.fyleFields.filter((field) => field.attribute_type !== XeroFyleField.PROJECT);
      } else {
        const fyleField = this.fyleFields.filter((field) => field.attribute_type === XeroFyleField.PROJECT);
        if (fyleField.length === 0) {
          this.fyleFields.pop();
          this.fyleFields.push({ attribute_type: XeroFyleField.PROJECT, display_name: 'Project', is_dependent: false });
          this.fyleFields.push(this.customFieldOption[0]);
        }
      }
    });
  }

  private setupImportSettingFormWatcher(): void {
    this.createTaxCodeWatcher();
    this.createCOAWatcher();
    this.createImportCustomerWatcher();
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
        }
      });
    });
  }

  setupAdvancedSettingFormWatcher() {
    XeroAdvancedSettingModel.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
  }

  updateCustomerImportAvailability(isMapped: boolean) {
    this.isProjectMapped = isMapped;
  }

  private setupPage(): void {
    this.setupOnboardingSteps();
    const destinationAttributes = [
      XeroFyleField.TAX_CODE, XeroFyleField.BANK_ACCOUNT
    ];

    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedDestinationAttributes(destinationAttributes, 'v1', 'xero'),
      this.mappingService.getFyleFields('v1'),
      this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId()),
      this.configurationService.getAdditionalEmails(),
      this.xeroImportSettingsService.getXeroField()
    ]).subscribe(([cloneSetting, destinationAttributes, fyleFieldsResponse, xeroCredentials, adminEmails, xeroFields]) => {
      this.cloneSetting = cloneSetting;

      // Export Settings
      this.bankAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => ExportSettingModel.formatGeneralMappingPayload(option));

      this.reimbursableExportTypes = XeroExportSettingModel.getReimbursableExportTypes();
      this.exportSettingForm = XeroExportSettingModel.mapAPIResponseToFormGroup(cloneSetting.export_settings, destinationAttributes.BANK_ACCOUNT);

      this.helperService.addExportSettingFormValidator(this.exportSettingForm);
      const [exportSettingValidatorRule, exportModuleRule] = XeroExportSettingModel.getValidators();

      this.helperService.setConfigurationSettingValidatorsAndWatchers(exportSettingValidatorRule, this.exportSettingForm);

      this.helperService.setExportTypeValidatorsAndWatchers(exportModuleRule, this.exportSettingForm);

      // Import Settings
      this.xeroFields = xeroFields;
      this.taxCodes = destinationAttributes.TAX_CODE.map((option: DestinationAttribute) => ExportSettingModel.formatGeneralMappingPayload(option));

      if (xeroCredentials && xeroCredentials.country !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      this.isCustomerPresent = this.xeroFields.findIndex((data:IntegrationField) => data.attribute_type === XeroFyleField.CUSTOMER) !== -1 ? true : false;

      this.xeroFields = this.xeroFields.filter((data) => data.attribute_type !== XeroFyleField.CUSTOMER);

      cloneSetting.import_settings.workspace_general_settings.charts_of_accounts = cloneSetting.import_settings.workspace_general_settings.charts_of_accounts.map((name: string) => name[0]+name.substr(1).toLowerCase());

      this.isProjectMapped = cloneSetting.import_settings.mapping_settings.findIndex((data: { source_field: XeroFyleField; destination_field: XeroFyleField; }) => data.source_field ===  XeroFyleField.PROJECT && data.destination_field !== XeroFyleField.CUSTOMER) !== -1 ? true : false;

      this.importSettingForm = XeroImportSettingModel.mapAPIResponseToFormGroup(cloneSetting.import_settings, this.xeroFields, this.isCustomerPresent, destinationAttributes.TAX_CODE);
      this.fyleFields = fyleFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: this.translocoService.translate('xeroCloneSettings.createCustomField'), is_dependent: false });
      this.setupImportSettingFormWatcher();
      this.initializeCustomFieldForm(false);

      // Advanced Settings
      this.adminEmails = adminEmails;
      if (this.cloneSetting.advanced_settings.workspace_schedules?.additional_email_options && this.cloneSetting.advanced_settings.workspace_schedules?.additional_email_options.length > 0) {
        this.adminEmails = this.adminEmails.concat(this.cloneSetting.advanced_settings.workspace_schedules?.additional_email_options).flat();
      }

      this.billPaymentAccounts = destinationAttributes.BANK_ACCOUNT.map((option: DestinationAttribute) => ExportSettingModel.formatGeneralMappingPayload(option));
      this.advancedSettingForm = XeroAdvancedSettingModel.mapAPIResponseToFormGroup(this.cloneSetting.advanced_settings, this.adminEmails, destinationAttributes.BANK_ACCOUNT, this.helperService.shouldAutoEnableAccountingPeriod(this.org.created_at), true);
      this.setupAdvancedSettingFormWatcher();

      // Convert field values from destination attributes to *default* destination attributes
      const controls = [
        this.exportSettingForm.get('bankAccount'),
        this.importSettingForm.get('defaultTaxCode'),
        this.advancedSettingForm.get('billPaymentAccount')
      ];

      for (const control of controls) {
        const fullDestinationAttribute: DestinationAttribute | null = control?.value;
        control?.setValue(
          fullDestinationAttribute && ExportSettingModel.formatGeneralMappingPayload(fullDestinationAttribute)
        );
      }

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
