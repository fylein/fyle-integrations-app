import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { QBDEmailOptions } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { AppName, ConfigurationCta, FyleField, IntacctOnboardingState, IntacctReimbursableExpensesObject, IntacctCorporateCreditCardExpensesObject, IntacctUpdateEvent, Page, PaymentSyncDirection, ProgressPhase, ToastSeverity, TrackingApp, QBDAccountingExportsState } from 'src/app/core/models/enum/enum.model';
import { AdvancedSetting, AdvancedSettingFormOption, AdvancedSettingsGet, AdvancedSettingsPost, HourOption } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

import { TitleCasePipe } from '@angular/common';
import { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { Configuration } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
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

  adminEmails: QBDEmailOptions[] = [];

  hours: SelectFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1).toString(),
      value: day + 1
    };
  });

  memoStructure: string[] = [];

  sageIntacctLocations: IntacctDestinationAttribute[];

  sageIntacctDepartments: IntacctDestinationAttribute[];

  sageIntacctProjects: IntacctDestinationAttribute[];

  sageIntacctClasses: IntacctDestinationAttribute[];

  sageIntacctDefaultItem: IntacctDestinationAttribute[];

  sageIntacctPaymentAccount: IntacctDestinationAttribute[];

  employeeFieldMapping: FyleField;

  reimbursableExpense?: IntacctReimbursableExpensesObject;

  corporateCreditCardExpense?: IntacctCorporateCreditCardExpensesObject;

  importVendorsAsMerchants: boolean;

  useMerchantInJournalLine: boolean;

  IntacctReimbursableExpensesObjectER: IntacctReimbursableExpensesObject.EXPENSE_REPORT;

  IntacctReimbursableExpensesObjectBILL: IntacctReimbursableExpensesObject.BILL;

  appName = AppName.INTACCT;

  private sessionStartTime = new Date();

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'None',
      value: null
    },
    {
      label: 'Export ' + brandingConfig.brandName + ' ACH Payments to Sage Intacct',
      value: PaymentSyncDirection.FYLE_TO_INTACCT
    },
    {
      label: 'Import Sage Intacct Payments into ' + brandingConfig.brandName + '',
      value: PaymentSyncDirection.INTACCT_TO_FYLE
    }
  ];

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly AppName = AppName;

  constructor(
    private router: Router,
    private advancedSettingsService: SiAdvancedSettingService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService
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
    return new TitleCasePipe().transform(this.employeeFieldMapping);
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_link: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/`
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoFields.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
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

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.get('setDescriptionField')?.value;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.setDescriptionField.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
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

  private initializeAdvancedSettingsFormWithData(isSkippedExpense: boolean): void {
    const findObjectByDestinationId = (array: IntacctDestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    this.advancedSettingsForm = this.formBuilder.group({
      exportSchedule: [this.advancedSettings?.workspace_schedules?.enabled ? true : false],
      exportScheduleFrequency: [this.advancedSettings?.workspace_schedules?.enabled ? this.advancedSettings?.workspace_schedules.interval_hours : 1],
      additionalEmails: [[]],
      scheduleAutoExport: [(this.advancedSettings.workspace_schedules?.interval_hours && this.advancedSettings.workspace_schedules?.enabled) ? this.advancedSettings.workspace_schedules?.interval_hours : null],
      email: [this.advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? AdvancedSettingsModel.filterAdminEmails(this.advancedSettings?.workspace_schedules?.emails_selected, this.adminEmails) : []],
      search: [],
      autoSyncPayments: [this.getPaymentSyncConfiguration(this.advancedSettings.configurations)],
      autoCreateEmployeeVendor: [this.advancedSettings.configurations.auto_create_destination_entity],
      postEntriesCurrentPeriod: [this.advancedSettings.configurations.change_accounting_period ? true : false],
      setDescriptionField: [this.advancedSettings.configurations.memo_structure ? this.advancedSettings.configurations.memo_structure : this.defaultMemoFields, Validators.required],
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
      autoCreateMerchants: new FormControl(this.advancedSettings?.configurations.auto_create_merchants_as_vendors ? true : false)
    });
    this.createAutoSyncPaymentsWatcher();
    this.createMemoStructureWatcher();
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

    forkJoin({
      advancedSettings: advancedSettings$,
      groupedAttributes: groupedAttributes$,
      expenseFilter: expenseFilters$,
      configuration: config$
    }).subscribe(
      ({ advancedSettings, groupedAttributes, expenseFilter, configuration }) => {
        this.advancedSettings = advancedSettings;
        this.sageIntacctLocations = groupedAttributes.LOCATION;
        this.sageIntacctDefaultItem = groupedAttributes.ITEM;
        this.sageIntacctDepartments = groupedAttributes.DEPARTMENT;
        this.sageIntacctProjects = groupedAttributes.PROJECT;
        this.sageIntacctClasses = groupedAttributes.CLASS;
        this.sageIntacctPaymentAccount = groupedAttributes.PAYMENT_ACCOUNT;
        this.reimbursableExpense = configuration.reimbursable_expenses_object;
        this.corporateCreditCardExpense = configuration.corporate_credit_card_expenses_object;
        this.importVendorsAsMerchants = configuration.import_vendors_as_merchants;
        this.useMerchantInJournalLine = configuration.use_merchant_in_journal_line;
        this.employeeFieldMapping = configuration.employee_field_mapping;

        if (this.advancedSettings.workspace_schedules?.additional_email_options) {
          this.adminEmails = this.adminEmails.concat(this.advancedSettings.workspace_schedules?.additional_email_options);
        }
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
