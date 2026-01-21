import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConditionField, EmailOption, ExpenseFilterPayload, ExpenseFilterResponse, SkipExportModel, SkipExportValidatorRule, skipExportValidator } from 'src/app/core/models/common/advanced-settings.model';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, AutoMapEmployeeOptions, ConfigurationCta, EmployeeFieldMapping, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOPaymentSyncDirection, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { QBOAdvancedSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-advanced-setting.model';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QboAdvancedSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-advanced-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { TranslocoService } from '@jsverse/transloco';
import { AdvancedSettingsService } from 'src/app/core/services/common/advanced-settings.service';

@Component({
    selector: 'app-qbo-advanced-settings',
    templateUrl: './qbo-advanced-settings.component.html',
    styleUrls: ['./qbo-advanced-settings.component.scss'],
    standalone: false
})
export class QboAdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  isSaveInProgress: boolean;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.QBO.ADVANCED_SETTING;

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.QBO.SKIP_EXPORT;

  isOnboarding: boolean;

  appName: AppName = AppName.QBO;

  hours: SelectFormOption[] = AdvancedSettingsService.getHoursOptions();

  advancedSetting: QBOAdvancedSettingGet;

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  memoStructure: string[] = [];

  billPaymentAccounts: DefaultDestinationAttribute[];

  brandingConfig = brandingConfig;

  adminEmails: EmailOption[] = [];

  defaultMemoOptions: string[] = [];

  memoPreviewText: string = '';

  workspaceGeneralSettings: QBOWorkspaceGeneralSetting;

  paymentSyncOptions: SelectFormOption[] = this.advancedSettingsService.getPaymentSyncOptions();

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  isSkipExportFormInvalid: boolean;

  org: Org = this.orgService.getCachedOrg();

  readonly brandingStyle = brandingStyle;

  constructor(
    private advancedSettingsService: QboAdvancedSettingsService,
    private configurationService: ConfigurationService,
    private helper: HelperService,
    private qboHelperService: QboHelperService,
    private mappingService: MappingService,
    private router: Router,
    private skipExportService: SkipExportService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private orgService: OrgService,
    private exportSettingsService: QboExportSettingsService,
    private translocoService: TranslocoService
  ) {
    this.paymentSyncOptions = this.advancedSettingsService.getPaymentSyncOptions();
  }


  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/import_settings`]);
  }

  invalidSkipExportForm($event: boolean) {
    this.isSkipExportFormInvalid = $event;
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
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingForm.get('skipExport')?.value) {
      this.saveSkipExportFields();
    }
  }

  save(): void {
    this.saveSkipExport();
    const advancedSettingPayload = QboAdvancedSettingsService.constructPayload(this.advancedSettingForm);
    this.isSaveInProgress = true;

    this.advancedSettingsService.postAdvancedSettings(advancedSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qboAdvancedSettings.advancedSettingsSuccess'), undefined, this.isOnboarding);

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBOOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/qbo/onboarding/done`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qboAdvancedSettings.advancedSettingsError'));
    });
  }

  refreshDimensions() {
    this.qboHelperService.refreshQBODimensions().subscribe();
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  isAutoCreateVendorsFieldVisible(): boolean {
    return this.workspaceGeneralSettings.employee_field_mapping === EmployeeFieldMapping.VENDOR && this.workspaceGeneralSettings.auto_map_employees !== null && this.workspaceGeneralSettings.auto_map_employees !== AutoMapEmployeeOptions.EMPLOYEE_CODE && (this.workspaceGeneralSettings.reimbursable_expenses_object === QBOReimbursableExpensesObject.BILL || this.workspaceGeneralSettings.reimbursable_expenses_object === QBOReimbursableExpensesObject.EXPENSE);
  }

  isPaymentSyncFieldVisible(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === QBOReimbursableExpensesObject.BILL;
  }

  isSingleCreditLineJEFieldVisible(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === QBOReimbursableExpensesObject.JOURNAL_ENTRY || this.workspaceGeneralSettings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
  }

  isAutoCreateMerchantsAsVendorsFieldVisible(): boolean {
    return !this.workspaceGeneralSettings.import_vendors_as_merchants && (this.workspaceGeneralSettings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE || this.workspaceGeneralSettings.corporate_credit_card_expenses_object === QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE || this.workspaceGeneralSettings.name_in_journal_entry === NameInJournalEntry.MERCHANT);
  }

  onMultiSelectChange() {
    const memo = this.advancedSettingForm.controls.memoStructure.value;
    const changedMemo = AdvancedSettingsService.formatMemoPreview(memo, this.defaultMemoOptions)[1];
    this.advancedSettingForm.controls.memoStructure.patchValue(changedMemo);
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.get('memoStructure')?.value;
    const memo = AdvancedSettingsService.formatMemoPreview(this.memoStructure, this.defaultMemoOptions);
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

    QboAdvancedSettingsService.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
    this.skipExportWatcher();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingsService.getAdvancedSettings(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields('v1'),
      this.mappingService.getGroupedDestinationAttributes(['BANK_ACCOUNT'], 'v1', 'qbo'),
      this.configurationService.getAdditionalEmails(),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.exportSettingsService.getExportSettings()
    ]).subscribe(([sage300AdvancedSettingResponse, expenseFiltersGet, expenseFilterCondition, billPaymentAccounts, adminEmails, workspaceGeneralSettings, exportSettings]) => {
      this.advancedSetting = sage300AdvancedSettingResponse;
      this.expenseFilters = expenseFiltersGet;
      this.conditionFieldOptions = expenseFilterCondition;

      this.adminEmails = adminEmails;
      if (this.advancedSetting.workspace_schedules?.additional_email_options && this.advancedSetting.workspace_schedules?.additional_email_options.length > 0) {
        this.adminEmails = this.adminEmails.concat(this.advancedSetting.workspace_schedules?.additional_email_options);
      }

      this.workspaceGeneralSettings = workspaceGeneralSettings;

      this.billPaymentAccounts = billPaymentAccounts.BANK_ACCOUNT.map((option: DestinationAttribute) => this.exportSettingsService.formatGeneralMappingPayload(option)) || [];

      const isSkipExportEnabled = expenseFiltersGet.count > 0;

      this.advancedSettingForm = this.advancedSettingsService.mapAPIResponseToFormGroup(this.advancedSetting, isSkipExportEnabled, this.adminEmails, this.helper.shouldAutoEnableAccountingPeriod(this.org.created_at), this.isOnboarding);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);
      this.defaultMemoOptions = AdvancedSettingsService.getMemoOptions(exportSettings, AppName.QBO);
      this.setupFormWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
