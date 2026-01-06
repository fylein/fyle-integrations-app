import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConditionField, EmailOption, ExpenseFilterPayload, ExpenseFilterResponse, SkipExportModel, SkipExportValidatorRule, skipExportValidator } from 'src/app/core/models/common/advanced-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, NameInJournalEntry, NetsuiteAdvancedSettingDestinationOptionKey, NetSuiteCorporateCreditCardExpensesObject, NetsuiteExportSettingDestinationOptionKey, NetsuiteOnboardingState, NetsuiteReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { NetsuiteConfiguration } from 'src/app/core/models/netsuite/db/netsuite-workspace-general-settings.model';
import { NetsuiteAdvancedSettingGet } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-advanced-settings.model';
import { NetSuiteExportSettingGet } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-export-setting.model';
import { Org } from 'src/app/core/models/org/org.model';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteAdvancedSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-advanced-settings.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TranslocoService } from '@jsverse/transloco';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';

@Component({
    selector: 'app-netsuite-advanced-settings',
    templateUrl: './netsuite-advanced-settings.component.html',
    styleUrls: ['./netsuite-advanced-settings.component.scss'],
    standalone: false
})
export class NetsuiteAdvancedSettingsComponent implements OnInit {


  isLoading: boolean = true;

  isSaveInProgress: boolean;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.NETSUITE.ADVANCED_SETTING;

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.NETSUITE.SKIP_EXPORT;

  isOnboarding: boolean;

  appName: AppName = AppName.NETSUITE;

  hours: SelectFormOption[] = AdvancedSettingsService .getHoursOptions();

  advancedSetting: NetsuiteAdvancedSettingGet;

  exportSettings: NetSuiteExportSettingGet;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  memoStructure: string[] = [];

  netsuiteLocations: DefaultDestinationAttribute[];

  netsuiteDepartments: DefaultDestinationAttribute[];

  netsuiteClasses: DefaultDestinationAttribute[];

  brandingConfig = brandingConfig;

  adminEmails: EmailOption[] = [];

  defaultMemoOptions: string[] = NetsuiteAdvancedSettingsService.getDefaultMemoOptions();

  memoPreviewText: string = '';

  workspaceGeneralSettings: NetsuiteConfiguration;

  paymentSyncOptions: SelectFormOption[] = [];

  netsuiteLocationLevels:  DefaultDestinationAttribute[]  = [];

  netsuiteDepartmentLevels:  DefaultDestinationAttribute[]  = [];

  netsuiteClassLevels:  DefaultDestinationAttribute[]  = [];

  paymentAccounts: DefaultDestinationAttribute[];

  ConfigurationCtaText = ConfigurationCta;

  dfvReadMoreLink: string = brandingKbArticles.onboardingArticles.NETSUITE.DFV_READ_MORE;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isSkipExportFormInvalid: boolean;

  isTaxGroupSyncAllowed: boolean;

  org: Org = this.orgService.getCachedOrg();

  readonly brandingStyle = brandingStyle;

  isOptionSearchInProgress: boolean;

  NetsuiteAdvancedSettingDestinationOptionKey = NetsuiteAdvancedSettingDestinationOptionKey;

  constructor(
    private advancedSettingsService: NetsuiteAdvancedSettingsService,
    private configurationService: ConfigurationService,
    public helper: HelperService,
    private netsuiteHelperService: NetsuiteHelperService,
    private netsuiteConnectorService: NetsuiteConnectorService,
    private mappingService: MappingService,
    private router: Router,
    private skipExportService: SkipExportService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private orgService: OrgService,
    private exportSettingsService: NetsuiteExportSettingsService,
    private translocoService: TranslocoService
  ) {

    this.paymentSyncOptions = this.advancedSettingsService.getPaymentSyncOptions();
    this.netsuiteLocationLevels = this.advancedSettingsService.getDefaultLevelOptions();
    this.netsuiteDepartmentLevels = this.advancedSettingsService.getDefaultLevelOptions();
    this.netsuiteClassLevels = this.advancedSettingsService.getDefaultLevelOptions();
  }

  searchOptionsDropdown(event: ExportSettingOptionSearch): void {
    if (event.searchTerm) {
      this.isOptionSearchInProgress = true;
      this.optionSearchHandler(event.searchTerm, event.destinationAttributes, event.destinationOptionKey as string);
    }
  }

  clearSearch(): void {
    this.advancedSettingForm.controls.searchOption?.patchValue('');
  }

  private dfvDropdownOptions(destinationAttributes: DefaultDestinationAttribute[], destinationAttributeKey: string): void {
    switch (destinationAttributeKey) {
      case 'LOCATION':
        this.netsuiteLocations = destinationAttributes.concat();
        break;
      case 'DEPARTMENT':
        this.netsuiteDepartments = destinationAttributes.concat();
        break;
      case 'CLASS':
        this.netsuiteClasses = destinationAttributes.concat();
        break;
      default:
        break;
    }
  }

  private optionSearchHandler(searchTerm: string, destinationAttributes: DefaultDestinationAttribute[], destinationAttributeKey: string): void {
    debounceTime(1000);
    this.isOptionSearchInProgress = true;
    const existingOptions = destinationAttributes.concat();
    let newOptions: DefaultDestinationAttribute[];

    this.mappingService.getPaginatedDestinationAttributes(destinationAttributeKey, searchTerm).subscribe((response) => {
      newOptions = response.results.map(this.exportSettingsService.formatGeneralMappingPayload);

        // Insert new options to existing options
        newOptions.forEach((option) => {
          if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
            existingOptions.push(option);
          }
      });

      // Insert new options to existing options
      newOptions.forEach((option: DefaultDestinationAttribute) => {
        if (!existingOptions.find((existingOption) => existingOption.id === option.id)) {
          existingOptions.push(option);
        }
      });
      destinationAttributes = existingOptions.concat();
      destinationAttributes = this.sortDropdownOptions(destinationAttributes);
      this.dfvDropdownOptions(destinationAttributes, destinationAttributeKey);
      this.isOptionSearchInProgress = false;
    }, (error) => {
      this.isOptionSearchInProgress = false;
    });
  }

  private sortDropdownOptions(destinationAttributes: DefaultDestinationAttribute[]): DefaultDestinationAttribute[] {
    return destinationAttributes.sort((a: DefaultDestinationAttribute, b: DefaultDestinationAttribute) => {
      return a.name?.localeCompare(b.name || '') || 0;
    });
  }

  isOptional(): string {
    return brandingFeatureConfig.featureFlags.showOptionalTextInsteadOfAsterisk ? this.translocoService.translate('netsuiteAdvancedSettings.optional') : '';
  }

  invalidSkipExportForm($event: boolean) {
    this.isSkipExportFormInvalid = $event;
  }

  getCreateVendorLabel(): string {
    if (this.workspaceGeneralSettings.employee_field_mapping === EmployeeFieldMapping.VENDOR) {
      return EmployeeFieldMapping.VENDOR.toLowerCase();
    }
    return EmployeeFieldMapping.EMPLOYEE.toLowerCase();
  }

  getCreateMerchantLabel(): string {
    return NameInJournalEntry.MERCHANT.toLowerCase();
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/netsuite/onboarding/import_settings`]);
  }

  private saveSkipExportFields(): void {
    if (!this.skipExportForm.valid) {
      return;
    }
    let valueField = this.skipExportForm.getRawValue();
    if (!valueField.condition1.field_name) {
      return;
    }
    valueField = SkipExportModel.constructSkipExportValue(valueField);
    valueField.rank = 1;
    const skipExportRank1: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
    const payload1 = SkipExportModel.constructSkipExportPayload(skipExportRank1, this.skipExportForm.get('value1')?.value);
    this.skipExportService.postExpenseFilter(payload1).subscribe(() => {
      if (valueField.condition2 && valueField.operator2) {
        valueField.rank = 2;
        const skipExportRank2: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
        const payload2 = SkipExportModel.constructSkipExportPayload(skipExportRank2, this.skipExportForm.get('value2')?.value);
        this.skipExportService.postExpenseFilter(payload2).subscribe(() => {});
      }
    });
  }

  private saveSkipExport(): void {
    if (!this.advancedSettingForm.get('skipExport')?.value && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value: any) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingForm.get('skipExport')?.value) {
      this.saveSkipExportFields();
    }
  }

  save(): void {
    this.saveSkipExport();
    const advancedSettingPayload = NetsuiteAdvancedSettingsService.constructPayload(this.advancedSettingForm);
    this.isSaveInProgress = true;

    this.advancedSettingsService.postAdvancedSettings(advancedSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('netsuiteAdvancedSettings.saveSuccess'), undefined, this.isOnboarding);

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(NetsuiteOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/netsuite/onboarding/done`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('netsuiteAdvancedSettings.saveError'));
    });
  }

  refreshDimensions() {
    this.netsuiteHelperService.refreshNetsuiteDimensions().subscribe();
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  isAutoCreateVendorsFieldVisible(): boolean {
    return this.workspaceGeneralSettings.auto_map_employees !== null && this.workspaceGeneralSettings.auto_map_employees !== AutoMapEmployeeOptions.EMPLOYEE_CODE;
  }

  isAutoCreateMerchantsFieldVisible(): boolean {
    return this.workspaceGeneralSettings.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.CREDIT_CARD_CHARGE && !this.workspaceGeneralSettings.import_vendors_as_merchants ? true : false;
  }

  isPaymentSyncFieldVisible(): boolean | null {
    return this.workspaceGeneralSettings.reimbursable_expenses_object && this.workspaceGeneralSettings.reimbursable_expenses_object !== NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY;
  }

  isSingleCreditLineJEFieldVisible(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === NetsuiteReimbursableExpensesObject.JOURNAL_ENTRY || this.workspaceGeneralSettings.corporate_credit_card_expenses_object === NetSuiteCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
  }

  onMultiSelectChange() {
    const memo = this.advancedSettingForm.controls.memoStructure.value;
    const changedMemo = AdvancedSettingsService.formatMemoPreview(memo, this.defaultMemoOptions)[1];
    this.advancedSettingForm.controls.memoStructure.patchValue(changedMemo);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSetting.configuration.memo_structure;
    const memo: [string, string[]] = AdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
    this.memoPreviewText = memo[0];
    this.advancedSettingForm.controls.memoStructure.patchValue(memo[1]);
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoPreviewText = AdvancedSettingsService.formatMemoPreview(memoChanges, this.defaultMemoOptions)[0];
    });
  }

  skipExportWatcher(): void {
    const skipExportFormWatcherFields: SkipExportValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);

    const formWatcher: skipExportValidator = {
      'isChanged': ['condition1', 'operator1', 'value1'],
      'isNotChanged': ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by']
    };
    this.helper.handleSkipExportFormInAdvancedSettingsUpdates(this.skipExportForm, formWatcher, this.advancedSettingForm);
  }

  private setupFormWatchers() {
    this.createMemoStructureWatcher();

    NetsuiteAdvancedSettingsService.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
    this.skipExportWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields('v1'),
      this.mappingService.getGroupedDestinationAttributes(['LOCATION', 'DEPARTMENT', 'CLASS', 'VENDOR_PAYMENT_ACCOUNT'], 'v2', 'netsuite'),
      this.configurationService.getAdditionalEmails(),
      this.workspaceService.getConfiguration(),
      this.netsuiteConnectorService.getSubsidiaryMapping(),
      this.exportSettingsService.getExportSettings()
    ]).subscribe(([netsuiteAdvancedSetting, expenseFiltersGet, expenseFilterCondition, netsuiteAttributes, adminEmails, workspaceGeneralSettings, subsidiaryMapping, exportSettings]) => {
      this.advancedSetting = netsuiteAdvancedSetting;
      this.expenseFilters = expenseFiltersGet;
      this.conditionFieldOptions = expenseFilterCondition;
      this.exportSettings = exportSettings;
      this.defaultMemoOptions = NetsuiteAdvancedSettingsService.getMemoOptions(this.exportSettings, this.appName);
      this.adminEmails = adminEmails;
      if (this.advancedSetting.workspace_schedules?.additional_email_options && this.advancedSetting.workspace_schedules?.additional_email_options.length > 0) {
        this.adminEmails = this.adminEmails.concat(this.advancedSetting.workspace_schedules?.additional_email_options);
      }

      if (subsidiaryMapping && subsidiaryMapping.country_name !== '_unitedStates') {
        this.isTaxGroupSyncAllowed = true;
      }

      this.workspaceGeneralSettings = workspaceGeneralSettings;

      this.paymentAccounts = netsuiteAttributes.VENDOR_PAYMENT_ACCOUNT.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option)) || [];

      this.netsuiteLocations = netsuiteAttributes.LOCATION.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option)) || [];

      this.netsuiteDepartments = netsuiteAttributes.DEPARTMENT.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option)) || [];

      this.netsuiteClasses = netsuiteAttributes.CLASS.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option)) || [];

      const isSkipExportEnabled = expenseFiltersGet.count > 0;

      this.advancedSettingForm = this.advancedSettingsService.mapAPIResponseToFormGroup(this.advancedSetting, isSkipExportEnabled, this.adminEmails, this.helper.shouldAutoEnableAccountingPeriod(this.org.created_at), this.isOnboarding);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);
      this.isLoading = false;
      this.setupFormWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }
}
