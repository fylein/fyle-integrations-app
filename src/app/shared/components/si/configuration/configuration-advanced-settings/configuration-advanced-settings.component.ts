import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCta, FyleField, IntacctOnboardingState, IntacctUpdateEvent, Page, PaymentSyncDirection, ProgressPhase, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EmailOptions } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';
import { AdvancedSetting, AdvancedSettingFormOption, AdvancedSettingsGet, AdvancedSettingsPost, ExpenseFilterResponse, HourOption } from 'src/app/core/models/si/si-configuration/advanced-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SkipExportComponent } from '../../helper/skip-export/skip-export.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-configuration-advanced-settings',
  templateUrl: './configuration-advanced-settings.component.html',
  styleUrls: ['./configuration-advanced-settings.component.scss']
})
export class ConfigurationAdvancedSettingsComponent implements OnInit {

  @ViewChild('skipExportChild') skipExportChild: SkipExportComponent;

  isLoading: boolean = true;

  advancedSettingsForm: FormGroup;

  skipExportForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: AdvancedSettingsGet;

  memoPreviewText: string;

  adminEmails: EmailOptions[] = [];

  hours: HourOption[] = [];

  memoStructure: string[] = [];

  sageIntacctLocations: DestinationAttribute[];

  sageIntacctDepartments: DestinationAttribute[];

  sageIntacctProjects: DestinationAttribute[];

  sageIntacctClasses: DestinationAttribute[];

  sageIntacctDefaultItem: DestinationAttribute[];

  sageIntacctPaymentAccount: DestinationAttribute[];

  employeeFieldMapping: FyleField;

  private sessionStartTime = new Date();

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'None',
      value: null
    },
    {
      label: 'Export Fyle ACH Payments to Sage Intacct',
      value: PaymentSyncDirection.FYLE_TO_INTACCT
    },
    {
      label: 'Import Sage Intacct Online Payments into Fyle',
      value: PaymentSyncDirection.INTACCT_TO_FYLE
    }
  ];

  constructor(
    private router: Router,
    private advancedSettingsService: SiAdvancedSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService
  ) { }
  
  getEmployeeField() {
    return new TitleCasePipe().transform(this.employeeFieldMapping);
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
      expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
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

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.value.setDescriptionField;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.setDescriptionField.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  private initializeAdvancedSettingsFormWithData(isSkippedExpense: boolean): void {
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    const findObjectById = (array: DestinationAttribute[], id: string) => array?.find(item => item.id.toString() === id) || null;
    const filterAdminEmails = (emailToSearch: string[], adminEmails: EmailOptions[]) => {
      const adminEmailsList: EmailOptions[] = [];
      for (const email of emailToSearch) {
        adminEmails.find(item => (item.email === email ? adminEmailsList.push(item) : null));
      }
      return adminEmailsList;
    };
    this.advancedSettingsForm = this.formBuilder.group({
      scheduleAutoExport: [this.advancedSettings.workspace_schedules?.interval_hours ? this.advancedSettings.workspace_schedules?.interval_hours : null],
      email: [this.advancedSettings?.workspace_schedules?.emails_selected?.length > 0 ? filterAdminEmails(this.advancedSettings?.workspace_schedules?.emails_selected, this.adminEmails) : []],
      search: [],
      autoSyncPayments: [this.advancedSettings.configurations.sync_fyle_to_sage_intacct_payments ? PaymentSyncDirection.FYLE_TO_INTACCT : PaymentSyncDirection.INTACCT_TO_FYLE],
      autoCreateEmployeeVendor: [this.advancedSettings.configurations.auto_create_destination_entity],
      postEntriesCurrentPeriod: [this.advancedSettings.configurations.change_accounting_period ? false : true],
      setDescriptionField: [this.advancedSettings.configurations.memo_structure ? this.advancedSettings.configurations.memo_structure : this.defaultMemoFields, Validators.required],
      skipSelectiveExpenses: [isSkippedExpense],
      defaultLocation: [findObjectByDestinationId(this.sageIntacctLocations, this.advancedSettings.general_mappings.default_location.id)],
      defaultDepartment: [findObjectByDestinationId(this.sageIntacctDepartments, this.advancedSettings.general_mappings.default_department.id)],
      defaultProject: [findObjectByDestinationId(this.sageIntacctProjects, this.advancedSettings.general_mappings.default_project.id)],
      defaultClass: [findObjectByDestinationId(this.sageIntacctClasses, this.advancedSettings.general_mappings.default_class.id)],
      defaultItems: [findObjectByDestinationId(this.sageIntacctDefaultItem, this.advancedSettings.general_mappings.default_item.id)],
      defaultPaymentAccount: [findObjectById(this.sageIntacctPaymentAccount, this.advancedSettings.general_mappings.payment_account.id)],
      useEmployeeLocation: [this.advancedSettings.general_mappings.use_intacct_employee_locations ? this.advancedSettings.general_mappings.use_intacct_employee_locations : null],
      useEmployeeDepartment: [this.advancedSettings.general_mappings.use_intacct_employee_departments ? this.advancedSettings.general_mappings.use_intacct_employee_departments : null]
    });
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

    // Hours Options for Scheduled Exports
    for (let i = 1; i <= 24; i++) {
      this.hours.push({ label: `${i} hour${i > 1 ? 's' : ''}`, value: i });
    }

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
        this.employeeFieldMapping = configuration.employee_field_mapping
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
      if (this.advancedSettingsForm.value.skipSelectiveExpenses) {
        this.skipExportChild.saveSkipExportFields();
      }
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      this.trackingService.trackTimeSpent(Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.ADVANCED_CONFIGURATION) {
        this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.ADVANCED_CONFIGURATION, 3, advancedSettingsPayload);
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
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/intacct/onboarding/done`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving advanced settings, please try again later');
      });
  }

  getAdminEmails() {
    this.isLoading= true;
    this.advancedSettingsService.getAdditionalEmails().subscribe((emailResponse: EmailOptions[]) => {
      this.adminEmails = emailResponse;
      this.getSettingsAndSetupForm();
    });
  }

  ngOnInit(): void {
    this.getAdminEmails();
  }

}
