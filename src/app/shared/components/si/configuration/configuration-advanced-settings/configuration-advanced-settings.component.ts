import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCta, IntacctOnboardingState, IntacctUpdateEvent, Page, PaymentSyncDirection, ProgressPhase, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingModel, EmailOptions } from 'src/app/core/models/qbd/qbd-configuration/advanced-setting.model';
import { AdvancedSetting, AdvancedSettingFormOption, AdvancedSettingsGet, AdvancedSettingsPost, ConditionField, CustomOperatorOption, ExpenseFilterResponse, HourOption, JoinOptions, SkipExport, constructPayload1, constructPayload2 } from 'src/app/core/models/si/si-configuration/advanced-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-advanced-settings',
  templateUrl: './configuration-advanced-settings.component.html',
  styleUrls: ['./configuration-advanced-settings.component.scss']
})
export class ConfigurationAdvancedSettingsComponent implements OnInit {

  isLoading: boolean = true;

  advancedSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  advancedSettings: AdvancedSettingsGet;

  skipExport: ExpenseFilterResponse;

  expenseFilters: SkipExport[];

  memoPreviewText: string;

  adminEmails: EmailOptions[];

  hours: HourOption[] = [];

  memoStructure: string[] = [];

  sageIntacctLocations: DestinationAttribute[];

  sageIntacctDepartments: DestinationAttribute[];

  sageIntacctProjects: DestinationAttribute[];

  sageIntacctClasses: DestinationAttribute[];

  sageIntacctDefaultItem: DestinationAttribute[];

  sageIntacctPaymentAccount: DestinationAttribute[];

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

    // Skip Export
    showExpenseFilters: boolean;

    skippedCondition1: string;

    skippedCondition2: string;

    isDisabledChip1: boolean = false;

    isDisabledChip2: boolean = false;

    skipExportForm: UntypedFormGroup;

    showAdditionalCondition: boolean = false;

    showAddButton: boolean = true;

    workspaceId: number;

    conditionFieldOptions: ConditionField[];

    operatorFieldOptions1: { label: string; value: string }[];

    operatorFieldOptions2: { label: string; value: string }[];

    joinByOptions = [JoinOptions.AND, JoinOptions.OR];

  constructor(
    private router: Router,
    private advancedSettingsService: SiAdvancedSettingService,
    private formBuilder: FormBuilder,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService,
    private mappingService: SiMappingsService
  ) { }

  customOperatorOptions = [
    {
      label: 'Is',
      value: CustomOperatorOption.Is
    },
    {
      label: 'Is empty',
      value: CustomOperatorOption.IsEmpty
    },
    {
      label: 'Is not empty',
      value: CustomOperatorOption.IsNotEmpty
    }
  ];

  customSelectOperatorOptions = [
    {
      label: 'Is',
      value: 'iexact'
    },
    {
      label: 'Is not',
      value: 'not_in'
    }
  ];

  valueOption1: any[] = [];

  valueOption2: any[] = [];

  // SeparatorKeysCodes: number[] = [ENTER, COMMA];

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

  private initializeExportSettingsFormWithData(): void {
    this.advancedSettingsForm = this.formBuilder.group({
      scheduleAutoExport: [null],
      errorNotificationEmail: [null],
      autoSyncPayments: [null],
      autoCreateEmployeeVendor: [null],
      postEntriesCurrentPeriod: [null],
      setDescriptionField: [this.defaultMemoFields, Validators.required],
      skipSelectiveExpenses: [null],
      defaultLocation: [null],
      defaultDepartment: [null],
      defaultProject: [null],
      defaultClass: [null],
      defaultItems: [null],
      defaultPaymentAccount: [null],
      useEmployeeLocation: [null],
      useEmployeeDepartment: [null]
    });
    this.createMemoStructureWatcher();
  }

  remove1(chipValue: any): void {
    const index = this.valueOption1.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption1.splice(index, 1);
    }
    if (this.valueOption1.length===0) {
      this.skipExportForm.controls.value1.setValue('');
    this.skipExportForm.controls.value1.setValidators(Validators.required);
    this.skipExportForm.controls.value1.updateValueAndValidity();
    }
  }

  remove2(chipValue: any): void {
    const index = this.valueOption2.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption2.splice(index, 1);
    }
    if (this.valueOption2.length===0) {
      this.skipExportForm.controls.value2.setValue('');
      this.skipExportForm.controls.value2.setValidators(Validators.required);
      this.skipExportForm.controls.value2.updateValueAndValidity();
      }
  }

  resetAdditionalFilter() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
    this.valueOption2=[];
  }

  resetFields(operator: AbstractControl, value: AbstractControl, conditionSelected: ConditionField, rank: number) {
    operator.reset();
    value.reset();
    if (rank === 1) {
      this.valueOption1 = [];
    } else if (rank === 2) {
      this.valueOption2 = [];
    }
    if (conditionSelected !== null) {
      if (conditionSelected.is_custom === true) {
        this.setCustomOperatorOptions(rank, conditionSelected.type);
      } else if (conditionSelected.is_custom === false) {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        }
      }
    }
  }

  updateAdditionalFilterVisibility(show: boolean) {
    this.showAdditionalCondition = show;
    this.showAddButton = !show;
    if (this.showAdditionalCondition) {
      this.skipExportForm.controls.join_by.setValidators(Validators.required);
      this.skipExportForm.controls.condition2.setValidators(Validators.required);
      this.skipExportForm.controls.operator2.setValidators(Validators.required);
      if (this.valueOption2.length===0) {
        this.skipExportForm.controls.value2.setValidators(Validators.required);
      }
    }
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.resetAdditionalFilter();
    this.skipExportForm.controls.join_by.clearValidators();
    this.skipExportForm.controls.join_by.setValue(null);
    this.skipExportForm.controls.condition2.clearValidators();
    this.skipExportForm.controls.condition2.setValue(null);
    this.skipExportForm.controls.operator2.clearValidators();
    this.skipExportForm.controls.operator2.setValue(null);
    this.skipExportForm.controls.value2.clearValidators();
    this.skipExportForm.controls.value2.setValue(null);
  }

  checkValidationCondition() {
    const condition1 = this.skipExportForm.controls.condition1;
    const condition2 = this.skipExportForm.controls.condition2;
    if (this.showAdditionalCondition) {
      if (condition1.valid && condition2.valid) {
        if (condition1.value?.field_name === condition2.value?.field_name) {
            this.skipExportForm.controls.operator2.setValue(null);
            return true;
          }
      }
    }
    return false;
  }

  // For conditionally adding and removing Value fields from layout
  showValueHeader1(): boolean {
    return (this.skipExportForm.value.operator1 !== 'is_empty') && (this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showValueHeader2() {
    return (this.skipExportForm.value.operator2 !== 'is_empty') && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showInputField1() {
    return this.skipExportForm.value.condition1?.field_name === 'report_title' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showChipField1() {
    return (this.skipExportForm.value.condition1?.field_name !== 'report_title') && (!this.skipExportForm.value.condition1 || this.skipExportForm.value.condition1.type==='SELECT' || this.skipExportForm.value?.condition1?.type==='TEXT' || this.skipExportForm.value?.condition1?.type==='NUMBER') && (this.skipExportForm.value.operator1 !== 'is_empty')  && (this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showDateField1() {
    return this.skipExportForm.value?.condition1?.type==='DATE' && (this.skipExportForm.value.operator1 !== 'is_empty' || this.skipExportForm.value.operator1 !== 'is_not_empty');
  }

  showInputField2() {
    return this.skipExportForm.value?.condition2?.field_name && this.skipExportForm.value?.condition2?.field_name === 'report_title'  && (this.skipExportForm.value.operator2 !== 'is_empty' || this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  showChipField2(): boolean {
    return this.skipExportForm.value?.condition2?.field_name !== 'report_title' && (!this.skipExportForm.value?.condition2 || this.skipExportForm.value?.condition2?.type==='SELECT' || this.skipExportForm.value?.condition2?.type==='TEXT' || this.skipExportForm.value?.condition2?.type==='NUMBER') && (this.skipExportForm.value.operator2 !== 'is_empty')  && (this.skipExportForm.value.operator2 !== 'is_not_empty');
  }

  saveSkipExportFields() {
    const that = this;
    that.isLoading = true;
    const valueField = this.skipExportForm.getRawValue();
    if (this.showAddButton && this.expenseFilters.length > 1) {
      this.advancedSettingsService
      .deleteExpenseFilter(this.expenseFilters[1].id)
      .subscribe((skipExport1: SkipExport) => {
      });
    }
    if (!this.advancedSettingsForm.controls.skipExport.value && this.expenseFilters.length > 0) {
      this.advancedSettingsService
      .deleteExpenseFilter(this.expenseFilters[0].id)
      .subscribe((skipExport1: SkipExport) => {
      });
      that.isLoading = false;
    } else {
      if (!valueField.condition1.field_name) {
        return;
      }
      if (valueField.condition1.field_name !== 'report_title' && valueField.operator1 === 'iexact') {
        valueField.operator1 = 'in';
      }
      if (valueField.join_by) {
        if (valueField.condition2.field_name !== 'report_title' && valueField.operator2 === 'iexact') {
          valueField.operator2 = 'in';
        }
    }
    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'is_empty') {
        valueField.value1 = ['True'];
        valueField.operator1 = 'isnull';
      } else if (valueField.operator1 === 'is_not_empty') {
        valueField.value1 = ['False'];
        valueField.operator1 = 'isnull';
      }
    }

    if (valueField.condition1.field_name === 'spent_at') {
      valueField.value1 = new Date(valueField.value1).toISOString().split('T')[0] + 'T17:00:00.000Z';
    }

    if (typeof valueField.value1 === 'string') {
      valueField.value1 = [valueField.value1];
    }
    const payload1 = constructPayload1(valueField, this.valueOption1);
    this.advancedSettingsService
      .postExpenseFilter(payload1)
      .subscribe((skipExport1: SkipExport) => {
        if (valueField.condition2 && valueField.operator2) {
          if (valueField.condition2.field_name === 'spent_at') {
            valueField.value2 = new Date(valueField.value2).toISOString().split('T')[0] + 'T17:00:00.000Z';
          }

          if (valueField.condition2.is_custom === true) {
            if (valueField.operator2 === 'is_empty') {
              valueField.value2 = ['True'];
              valueField.operator2 = 'isnull';
            } else if (valueField.operator2 === 'is_not_empty') {
              valueField.value2 = ['False'];
              valueField.operator2 = 'isnull';
            }
          }

          if (typeof valueField.value2 === 'string') {
            valueField.value2 = [valueField.value2];
          }
            const payload2 = constructPayload2(valueField, this.valueOption2);
            this.advancedSettingsService
              .postExpenseFilter(payload2)
              .subscribe((skipExport2: SkipExport) => {});
        }
        that.isLoading = false;
      });
    }
  }

  setDefaultOperatorOptions(conditionField: string) {
    const operatorList = [];
    if (
      conditionField === 'claim_number' ||
      conditionField === 'employee_email' ||
      conditionField === 'report_title'
    ) {
      operatorList.push({
        value: 'iexact',
        label: 'Is'
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: 'Is before'
      });
      operatorList.push({
        value: 'lte',
        label: 'Is it on or before'
      });
    }
    if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: 'contains'
      });
    }
    return operatorList;
  }

  setCustomOperatorOptions(rank: number, type: string) {
      if (type !== 'SELECT') {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.customOperatorOptions;
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.customOperatorOptions;
        }
      } else {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.customSelectOperatorOptions;
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.customSelectOperatorOptions;
        }
      }
    }

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition1.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator1,
          this.skipExportForm.controls.value1,
          conditionSelected,
          1
        );
      }
    );

    this.skipExportForm.controls.condition2.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator2,
          this.skipExportForm.controls.value2,
          conditionSelected,
          2
        );
      }
    );
  }

  operatorFieldWatcher() {
    this.skipExportForm.controls.operator1.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption1 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip1 = true;
          this.skipExportForm.controls.value1.clearValidators();
          this.skipExportForm.controls.value1.setValue(null);
        } else {
          this.isDisabledChip1 = false;
          this.skipExportForm.controls.value1.setValidators([Validators.required]);
          this.skipExportForm.controls.value1.setValue(null, {emitEvent: false});

        }
      }
    );

    this.skipExportForm.controls.operator2.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption2 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip2 = true;
          this.skipExportForm.controls.value2.clearValidators();
          this.skipExportForm.controls.value2.setValue(null);
        } else {
          this.isDisabledChip2 = false;
          this.skipExportForm.controls.value2.setValidators([Validators.required]);
          this.skipExportForm.controls.value2.setValue(null, {emitEvent: false});
        }
      }
    );
  }

  fieldWatcher() {
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
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

  private getSettingsAndSetupForm(): void {
    const destinationAttributes = ['LOCATION', 'DEPARTMENT', 'PROJECT', 'CLASS', 'ITEM', 'PAYMENT_ACCOUNT'];

    const groupedAttributes$ = this.mappingService.getGroupedDestinationAttributes(destinationAttributes);
    const advancedSettings$ = this.advancedSettingsService.getAdvancedSettings();
    const schedules$ = this.advancedSettingsService.getAdvancedSettings();
    const skipExport$ = this.advancedSettingsService.getExpenseFilter();

    // Hours Options for Scheduled Exports
    for (let i = 1; i <= 24; i++) {
      this.hours.push({ label: `${i} hour${i > 1 ? 's' : ''}`, value: i });
    }

    forkJoin({
      advancedSettings: advancedSettings$,
      skipExport: skipExport$,
      groupedAttributes: groupedAttributes$
    }).subscribe(
      ({ advancedSettings, skipExport, groupedAttributes }) => {
        this.advancedSettings = advancedSettings;
        this.skipExport = skipExport;
        this.sageIntacctLocations = groupedAttributes.LOCATION;
        this.sageIntacctDefaultItem = groupedAttributes.ITEM;
        this.sageIntacctDepartments = groupedAttributes.DEPARTMENT;
        this.sageIntacctProjects = groupedAttributes.PROJECT;
        this.sageIntacctClasses = groupedAttributes.CLASS;
        this.sageIntacctPaymentAccount = groupedAttributes.PAYMENT_ACCOUNT;
        this.initializeExportSettingsFormWithData();
        this.isLoading = false;
      });
  }

  getAdminEmails() {
    this.isLoading= true;
    this.orgService.getAdditionalEmails().subscribe((emailResponse: EmailOptions[]) => {
      this.adminEmails = emailResponse;
      this.getSettingsAndSetupForm();
    });
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  save(): void {
    this.saveInProgress = true;
    const advancedSettingsPayload = AdvancedSetting.constructPayload(this.advancedSettingsForm);
    this.advancedSettingsService.postAdvancedSettings(advancedSettingsPayload).subscribe((response: AdvancedSettingsPost) => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      this.trackingService.trackTimeSpent(Page.IMPORT_SETTINGS_INTACCT, this.sessionStartTime);
      if (this.workspaceService.getIntacctOnboardingState() === IntacctOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.integrationsOnboardingCompletion(IntacctOnboardingState.ADVANCED_SETTINGS, 3, advancedSettingsPayload);
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
        this.workspaceService.setIntacctOnboardingState(IntacctOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/intacct/onboarding/advanced_settings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving advanced settings, please try again later');
      });
  }

  ngOnInit(): void {
    this.getAdminEmails();
  }

}
