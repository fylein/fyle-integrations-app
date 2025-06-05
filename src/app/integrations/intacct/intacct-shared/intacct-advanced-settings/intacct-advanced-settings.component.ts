import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { ExportSettingModel } from 'src/app/core/models/common/export-settings.model';
import { AppName, ConfigurationCta, FyleField, IntacctOnboardingState, IntacctReimbursableExpensesObject, IntacctCorporateCreditCardExpensesObject, IntacctUpdateEvent, Page, PaymentSyncDirection, ProgressPhase, ToastSeverity, TrackingApp, ExpenseGroupingFieldOption } from 'src/app/core/models/enum/enum.model';
import { AdvancedSetting, AdvancedSettingFormOption, AdvancedSettingsGet, AdvancedSettingsPost, HourOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';

import { LowerCasePipe } from '@angular/common';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { Configuration } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { environment } from 'src/environments/environment';
import { AdvancedSettingsModel } from 'src/app/core/models/common/advanced-settings.model';
import { SkipExportComponent } from 'src/app/shared/components/si/helper/skip-export/skip-export.component';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';

@Component({
  selector: 'app-intacct-advanced-settings',
  templateUrl: './intacct-advanced-settings.component.html',
  styleUrls: ['./intacct-advanced-settings.component.scss']
})

export class IntacctAdvancedSettingsComponent implements OnInit {
  isSkipExportFormInvalid: boolean;

  @ViewChild('skipExportChild') skipExportChild: SkipExportComponent;

  isLoading: boolean = true;

  advancedSettingsForm: FormGroup;

  skipExportForm: FormGroup;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.ADVANCED_SETTING;

  intacctLink = brandingKbArticles.topLevelArticles.INTACCT;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: AdvancedSettingsGet;

  memoPreviewText: string;

  topMemoPreviewText: string;

  adminEmails: QBDEmailOptions[] = [];

  hours: SelectFormOption[] = AdvancedSettingsModel.getHoursOptions();

  sageIntacctLocations: IntacctDestinationAttribute[];

  sageIntacctDepartments: IntacctDestinationAttribute[];

  sageIntacctProjects: IntacctDestinationAttribute[];

  sageIntacctClasses: IntacctDestinationAttribute[];

  sageIntacctDefaultItem: IntacctDestinationAttribute[];

  sageIntacctPaymentAccount: IntacctDestinationAttribute[];

  employeeFieldMapping: FyleField;

  reimbursableExpense?: IntacctReimbursableExpensesObject;

  corporateCreditCardExpense?: IntacctCorporateCreditCardExpensesObject;

  reimbursableExportGroup?: ExpenseGroupingFieldOption;

  cccExportGroup?: ExpenseGroupingFieldOption;

  importVendorsAsMerchants: boolean;

  useMerchantInJournalLine: boolean;

  IntacctReimbursableExpensesObjectER: IntacctReimbursableExpensesObject.EXPENSE_REPORT;

  IntacctReimbursableExpensesObjectBILL: IntacctReimbursableExpensesObject.BILL;

  appName = AppName.INTACCT;

  private sessionStartTime = new Date();

  defaultMemoFields: string[] = AdvancedSettingsModel.getDefaultMemoOptions();

  defaultTopMemoFields: string[];

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'None',
      value: null
    },
    {
      label: 'Export ' + brandingConfig.brandName + ' ACH payments to Sage Intacct',
      value: PaymentSyncDirection.FYLE_TO_INTACCT
    },
    {
      label: 'Import Sage Intacct payments into ' + brandingConfig.brandName + '',
      value: PaymentSyncDirection.INTACCT_TO_FYLE
    }
  ];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly AppName = AppName;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private advancedSettingsService: SiAdvancedSettingService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService,
    private exportSettingService : SiExportSettingService
  ) { }

  invalidSkipExportForm($event: boolean) {
    this.isSkipExportFormInvalid = $event;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/intacct/onboarding/import_settings`]);
  }

  isOverflowing(element: any, mapping: DestinationAttribute): string {
    return element.offsetWidth < element.scrollWidth ? mapping.value : '';
  }

  refreshDimensions(isRefresh: boolean) {
    this.mappingService.refreshSageIntacctDimensions().subscribe();
    this.mappingService.refreshFyleDimensions().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage Intacct');
  }

  getEmployeeField() {
    return new LowerCasePipe().transform(this.employeeFieldMapping);
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  private createAutoSyncPaymentsWatcher(): void {
    this.advancedSettingsForm.controls.autoSyncPayments.valueChanges.subscribe((paymentChanges) => {
      if (paymentChanges === PaymentSyncDirection.FYLE_TO_INTACCT) {
        this.advancedSettingsForm.controls.defaultPaymentAccount.setValidators([Validators.required]);
      } else {
        this.advancedSettingsForm.controls.defaultPaymentAccount.clearValidators();
      }
    });
  }

  private createMemoStructureWatchers(): void {
    // For the line item-level memo fields selector
    const selectedMemoFields = this.advancedSettingsForm.get('setDescriptionField')?.value;
    const [memoPreviewText] = AdvancedSettingsModel.formatMemoPreview(selectedMemoFields, this.defaultMemoFields);
    this.memoPreviewText = memoPreviewText;

    this.advancedSettingsForm.controls.setDescriptionField.valueChanges.subscribe((memoChanges) => {
      const [memoPreviewText] = AdvancedSettingsModel.formatMemoPreview(memoChanges, this.defaultMemoFields);
      this.memoPreviewText = memoPreviewText;
    });

    // For the top-level memo fields selector
    const selectedTopMemoFields = this.advancedSettingsForm.get('setTopMemoField')?.value;
    const [topMemoPreviewText] = AdvancedSettingsModel.formatMemoPreview(selectedTopMemoFields, this.defaultTopMemoFields);
    this.topMemoPreviewText = topMemoPreviewText;

    this.advancedSettingsForm.controls.setTopMemoField?.valueChanges.subscribe((topMemoChanges) => {
      const [topMemoPreviewText] = AdvancedSettingsModel.formatMemoPreview(topMemoChanges, this.defaultTopMemoFields);
      this.topMemoPreviewText = topMemoPreviewText;
    });
  }

  private getPaymentSyncConfiguration(configurations: Configuration): string {
    let paymentSync = '';
    if (configurations.sync_fyle_to_sage_intacct_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_INTACCT;
    } else if (configurations.sync_sage_intacct_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.INTACCT_TO_FYLE;
    }

    return paymentSync;
  }

  isSingleCreditLineJEFieldVisible(): boolean {
    return (this.reimbursableExpense === IntacctReimbursableExpensesObject.JOURNAL_ENTRY && this.reimbursableExportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER) || (this.corporateCreditCardExpense === IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY && this.cccExportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER);
  }

  private initializeAdvancedSettingsFormWithData(isSkippedExpense: boolean): void {
    const findObjectByDestinationId = (array: IntacctDestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;

    const topLevelMemoFieldValue = this.advancedSettings.configurations.top_level_memo_structure;
    if (topLevelMemoFieldValue) {
      for (let i = 0; i < topLevelMemoFieldValue.length; i++) {
        const currentOption = topLevelMemoFieldValue[i];
        const expenseOrReportNumberOptions = ['expense_number', 'report_number'];

        // If expense number or report number was previously selected when it is not a valid option anymore, swap it
        if (expenseOrReportNumberOptions.includes(currentOption) && !this.defaultTopMemoFields.includes(currentOption)) {
          topLevelMemoFieldValue[i] = currentOption === 'expense_number' ? 'report_number' : 'expense_number';
        }
      }
    }

    this.advancedSettingsForm = this.formBuilder.group({
      exportSchedule: new FormControl(this.advancedSettings.workspace_schedules?.enabled || (this.isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary) ? true : false),
      exportScheduleFrequency: new FormControl(AdvancedSettingsModel.getExportFrequency(this.advancedSettings.workspace_schedules?.is_real_time_export_enabled, this.isOnboarding, this.advancedSettings.workspace_schedules?.enabled, this.advancedSettings.workspace_schedules?.interval_hours)),
      additionalEmails: [[]],
      scheduleAutoExport: [(this.advancedSettings.workspace_schedules?.interval_hours && this.advancedSettings.workspace_schedules?.enabled) ? this.advancedSettings.workspace_schedules?.interval_hours : null],
      email: [this.advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsModel.filterAdminEmails(this.advancedSettings?.workspace_schedules?.emails_selected, this.adminEmails) : []],
      search: [],
      autoSyncPayments: [this.getPaymentSyncConfiguration(this.advancedSettings.configurations)],
      autoCreateEmployeeVendor: [this.advancedSettings.configurations.auto_create_destination_entity],
      postEntriesCurrentPeriod: [this.advancedSettings.configurations.change_accounting_period ? true : false],
      setDescriptionField: [this.advancedSettings.configurations.memo_structure ? this.advancedSettings.configurations.memo_structure : this.defaultMemoFields, Validators.required],
      setTopMemoField: [topLevelMemoFieldValue ? topLevelMemoFieldValue : []],
      skipSelectiveExpenses: [isSkippedExpense],
      defaultLocation: [findObjectByDestinationId(this.sageIntacctLocations, this.advancedSettings.general_mappings.default_location.id)],
      defaultDepartment: [findObjectByDestinationId(this.sageIntacctDepartments, this.advancedSettings.general_mappings.default_department.id)],
      defaultProject: [findObjectByDestinationId(this.sageIntacctProjects, this.advancedSettings.general_mappings.default_project.id)],
      defaultClass: [findObjectByDestinationId(this.sageIntacctClasses, this.advancedSettings.general_mappings.default_class.id)],
      defaultItems: [findObjectByDestinationId(this.sageIntacctDefaultItem, this.advancedSettings.general_mappings.default_item.id)],
      defaultPaymentAccount: [findObjectByDestinationId(this.sageIntacctPaymentAccount, this.advancedSettings.general_mappings.payment_account.id)],
      useEmployeeLocation: [this.advancedSettings.general_mappings.use_intacct_employee_locations ? this.advancedSettings.general_mappings.use_intacct_employee_locations : null],
      useEmployeeDepartment: [this.advancedSettings.general_mappings.use_intacct_employee_departments ? this.advancedSettings.general_mappings.use_intacct_employee_departments : null],
      searchOption: [''],
      autoCreateMerchants: new FormControl(this.advancedSettings?.configurations.auto_create_merchants_as_vendors ? true : false),
      singleCreditLineJE: [this.advancedSettings.configurations.je_single_credit_line]
    });
    this.createAutoSyncPaymentsWatcher();
    this.createMemoStructureWatchers();
  }

  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }
    return false;
  }

  isCCT(): boolean {
    if (this.advancedSettingsForm.get('autoSyncPayments')?.value === PaymentSyncDirection.FYLE_TO_INTACCT) {
      return true;
    }
    return false;
  }

  private initializeSkipExportForm(): void {
    this.skipExportForm = this.formBuilder.group({
      condition1: [''],
      operator1: [''],
      value1: [['']],
      customFieldType1: [''],
      join_by: [''],
      condition2: [''],
      operator2: [''],
      value2: [['']],
      customFieldType2: ['']
    });
  }

  updateForm(updatedForm: FormGroup) {
    this.skipExportForm = updatedForm;
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const destinationAttributes = ['LOCATION', 'DEPARTMENT', 'PROJECT', 'CLASS', 'ITEM', 'PAYMENT_ACCOUNT'];

    const groupedAttributes$ = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const advancedSettings$ = this.advancedSettingsService.getAdvancedSettings();
    const expenseFilters$ = this.advancedSettingsService.getExpenseFilter();
    const config$ = this.mappingService.getConfiguration();
    const exportSettings$ = this.exportSettingService.getExportSettings();

    forkJoin({
      advancedSettings: advancedSettings$,
      groupedAttributes: groupedAttributes$,
      expenseFilter: expenseFilters$,
      configuration: config$,
      exportSettings: exportSettings$
    }).subscribe(
      ({ advancedSettings, groupedAttributes, expenseFilter, configuration, exportSettings }) => {
        this.advancedSettings = advancedSettings;
        this.sageIntacctLocations = groupedAttributes.LOCATION;
        this.sageIntacctDefaultItem = groupedAttributes.ITEM;
        this.sageIntacctDepartments = groupedAttributes.DEPARTMENT;
        this.sageIntacctProjects = groupedAttributes.PROJECT;
        this.sageIntacctClasses = groupedAttributes.CLASS;
        this.sageIntacctPaymentAccount = groupedAttributes.PAYMENT_ACCOUNT;
        this.reimbursableExpense = configuration.reimbursable_expenses_object;
        this.corporateCreditCardExpense = configuration.corporate_credit_card_expenses_object;
        const reimbursableGroup = ExportSettingModel.getExportGroup(exportSettings?.expense_group_settings?.reimbursable_expense_group_fields);
        const cccGroup = ExportSettingModel.getExportGroup(exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields);

        this.reimbursableExportGroup = reimbursableGroup ? reimbursableGroup as ExpenseGroupingFieldOption : undefined;
        this.cccExportGroup = cccGroup ? cccGroup as ExpenseGroupingFieldOption : undefined;
        this.importVendorsAsMerchants = configuration.import_vendors_as_merchants;
        this.useMerchantInJournalLine = configuration.use_merchant_in_journal_line;
        this.employeeFieldMapping = configuration.employee_field_mapping;

        if (this.advancedSettings.workspace_schedules?.additional_email_options) {
          this.adminEmails = this.adminEmails.concat(this.advancedSettings.workspace_schedules?.additional_email_options);
        }
        this.defaultMemoFields = AdvancedSettingsModel.getMemoOptions(configuration, AppName.INTACCT);

        const isReimbursableEnabled = exportSettings.configurations.reimbursable_expenses_object;
        const isCCCEnabled = exportSettings.configurations.corporate_credit_card_expenses_object;

        this.defaultTopMemoFields = AdvancedSettingsModel.getTopLevelMemoOptions(
          isReimbursableEnabled ? this.reimbursableExportGroup : undefined,
          isCCCEnabled ? this.cccExportGroup : undefined
        );
        this.initializeAdvancedSettingsFormWithData(!!expenseFilter.count);
        this.initializeSkipExportForm();
        this.isLoading = false;
      });
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save(): void {
    this.saveInProgress = true;
    const advancedSettingsPayload = AdvancedSetting.constructPayload(this.advancedSettingsForm);
    this.advancedSettingsService.postAdvancedSettings(advancedSettingsPayload).subscribe((response: AdvancedSettingsPost) => {
      if (this.advancedSettingsForm.get('skipSelectiveExpenses')?.value) {
        this.skipExportChild.saveSkipExportFields();
      } else {
        this.advancedSettingsService.deleteExpenseFilter(1).subscribe();
        this.advancedSettingsService.deleteExpenseFilter(2).subscribe();
      }
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.INTACCT, Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.ADVANCED_CONFIGURATION) {
        this.trackingService.integrationsOnboardingCompletion(TrackingApp.INTACCT, IntacctOnboardingState.ADVANCED_CONFIGURATION, 3, advancedSettingsPayload);
      } else {
        this.trackingService.intacctUpdateEvent(
          IntacctUpdateEvent.ADVANCED_SETTINGS_INTACCT,
          {
            phase: this.getPhase(),
            oldState: this.advancedSettings,
            newState: response
          }
        );
      }
      this.saveInProgress = false;
      if (this.isOnboarding) {
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/intacct/onboarding/done`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving advanced settings, please try again later');
      });
  }

  getAdminEmails() {
    this.isLoading= true;
    this.advancedSettingsService.getAdditionalEmails().subscribe((emailResponse: QBDEmailOptions[]) => {
      this.adminEmails = emailResponse;
      this.getSettingsAndSetupForm();
    });
  }

  isAutoCreateMerchantsFieldVisible(): boolean {
    return (this.corporateCreditCardExpense === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION && !this.importVendorsAsMerchants) ||
      (this.corporateCreditCardExpense === IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY && !this.importVendorsAsMerchants && this.useMerchantInJournalLine);
  }

  ngOnInit(): void {
    this.getAdminEmails();
  }

}
