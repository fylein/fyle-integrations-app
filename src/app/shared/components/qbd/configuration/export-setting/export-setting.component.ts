import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QBDCorporateCreditCardExpensesObject, QBDConfigurationCtaText, QBDExpenseGroupedBy, QBDExpenseState, QBDExportDateType, QBDReimbursableExpensesObject, QBDOnboardingState, QBDEntity, ToastSeverity, ClickEvent, Page, QBDProgressPhase, UpdateEvent, QBDCCCExpenseState } from 'src/app/core/models/enum/enum.model';
import { ExportSettingModel, QBDExportSettingFormOption, QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/export-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QbdToastService } from 'src/app/core/services/qbd/qbd-core/qbd-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-export-setting',
  templateUrl: './export-setting.component.html',
  styleUrls: ['./export-setting.component.scss']
})
export class ExportSettingComponent implements OnInit {

  isLoading: boolean = true;

  saveInProgress: boolean = false;

  isOnboarding: boolean = true;

  exportSettingsForm: FormGroup;

  ConfigurationCtaText = QBDConfigurationCtaText;

  QBDReimbursableExpensesObject= QBDReimbursableExpensesObject;

  expenseStateOptions: QBDExportSettingFormOption[];

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = false;

  expenseGroupingFieldOptions: QBDExportSettingFormOption[] = [
    {
      label: 'Report',
      value: QBDExpenseGroupedBy.REPORT
    },
    {
      label: 'Expense',
      value: QBDExpenseGroupedBy.EXPENSE
    }
  ];

  reimbursableExpenseGroupingDateOptions: QBDExportSettingFormOption[] = [
    {
      label: 'Spend Date',
      value: QBDExportDateType.SPENT_AT
    },
    {
      label: 'Date of export',
      value: QBDExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: QBDExportSettingFormOption[] = this.reimbursableExpenseGroupingDateOptions.concat([{
    label: 'Posted Date',
    value: QBDExportDateType.POSTED_AT
  }])

  creditCardExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Credit Card Purchase',
      value: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    },
    {
      label: 'Journal Entry',
      value: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }
  ];

  reimbursableExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: QBDReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal Entry',
      value: QBDReimbursableExpensesObject.JOURNAL_ENTRY
    }
  ];

  cccEntityNameOptions: QBDExportSettingFormOption[] = [
    {
      label: 'Employee',
      value: QBDEntity.EMPLOYEE
    },
    {
      label: 'Vendor',
      value: QBDEntity.VENDOR
    }
  ];

  exportSettings: QBDExportSettingGet;

  customMessage: string;

  private sessionStartTime = new Date();

  constructor(
    private router: Router,
    private exportSettingService: QbdExportSettingService,
    private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private toastService: QbdToastService,
    private trackingService: TrackingService
  ) { }

  reimbursableExpenseGroupingDateOptionsFn(): QBDExportSettingFormOption[] {
    const reimbursableExpenseGroup: QBDExportSettingFormOption[] = [];
    reimbursableExpenseGroup.push(this.reimbursableExpenseGroupingDateOptions[1]);
    return reimbursableExpenseGroup;
  }

  cccExpenseGroupingDateOptionsFn(): QBDExportSettingFormOption[] {
    const cccExpenseGroup: QBDExportSettingFormOption[] = [];
    cccExpenseGroup.concat(this.cccExpenseGroupingDateOptions.slice(1,2));
    return cccExpenseGroup;
  }

  namePreference(): string {
    return `Grouping reflects how the expense entries of a ${this.exportType(this.exportSettingsForm.value.cccExportType, this.creditCardExportTypes) } are posted in QuickBooks Desktop.`;
  }

  accountName(): string {
    const name = this.exportSettingsForm.value.reimbursableExportType === QBDReimbursableExpensesObject.BILL ? 'Accounts Payable' : 'Bank';
    this.customMessage = 'Please enter ' + name + ' name';
    return name;
  }

  exportType(exportTypeValue:string, exportTypeOptions: QBDExportSettingFormOption[]) {
    return exportTypeValue === exportTypeOptions[0].value ? exportTypeOptions[0].label : exportTypeOptions[1].label;
  }

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExpenseState.setValidators(Validators.required);
        this.exportSettingsForm.controls.bankAccount.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportGroup.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
        this.exportSettingsForm.controls.reimbursableExpenseState.clearValidators();
        this.exportSettingsForm.controls.bankAccount.clearValidators();
        this.exportSettingsForm.controls.bankAccount.setValue(null);
        this.exportSettingsForm.controls.reimbursableExpenseState.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportGroup.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportDate.setValue(null);
      }
    });
  }

  private createCreditCardExpenseWatcher(): void {
    this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.exportSettingsForm.controls.cccExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExportGroup.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExportGroup.patchValue(this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions[1].value);
        this.exportSettingsForm.controls.cccExportDate.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExportDate.patchValue(this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.reimbursableExpenseGroupingDateOptions[0].value);
        this.exportSettingsForm.controls.cccEntityName.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccExpenseState.setValidators(Validators.required);
        this.exportSettingsForm.controls.cccAccountName.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.cccExportType.clearValidators();
        this.exportSettingsForm.controls.cccExportGroup.clearValidators();
        this.exportSettingsForm.controls.cccExportDate.clearValidators();
        this.exportSettingsForm.controls.cccEntityName.clearValidators();
        this.exportSettingsForm.controls.cccExpenseState.clearValidators();
        this.exportSettingsForm.controls.cccAccountName.clearValidators();
        this.exportSettingsForm.controls.cccExportType.setValue(null);
        this.exportSettingsForm.controls.cccExpenseState.setValue(null);
        this.exportSettingsForm.controls.cccAccountName.setValue(null);
        this.exportSettingsForm.controls.cccExportGroup.setValue(null);
        this.exportSettingsForm.controls.cccExportDate.setValue(null);
        this.exportSettingsForm.controls.cccEntityName.setValue(null);
      }
    });
  }

  private setCustomValidatorsAndWatchers(): void {
    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();
  }

  private exportSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (this.exportSettingsForm ) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === QBDExpenseState.PAID || control.value === QBDExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        }
        if (!forbidden) {
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }
      return {
        forbiddenOption: {
          value: control.value
        }
      };
    };
  }

  private setUpExpenseStates(): void {
    this.cccExpenseStateOptions = [
      {
        label: this.is_simplify_report_closure_enabled ? 'Approved' : 'Payment Processing',
        value: this.is_simplify_report_closure_enabled ? QBDCCCExpenseState.APPROVED: QBDCCCExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
        value: QBDCCCExpenseState.PAID
      }
    ];

    this.expenseStateOptions = [
      {
        label: this.is_simplify_report_closure_enabled ? 'Processing' : 'Payment Processing',
        value: QBDExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
        value: QBDExpenseState.PAID
      }
    ];
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getQbdExportSettings().subscribe((exportSettingResponse : QBDExportSettingGet) => {
      this.exportSettings = exportSettingResponse;
      this.is_simplify_report_closure_enabled = this.exportSettings?.is_simplify_report_closure_enabled;
      this.setUpExpenseStates();

      this.exportSettingsForm = this.formBuilder.group({
        reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type],
        reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false, this.exportSelectionValidator()],
        reimbursableExportGroup: [this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by : null],
        reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
        creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false, this.exportSelectionValidator()],
        cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings?.credit_card_expense_export_type : null],
        cccExportGroup: [this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions[1].value],
        cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.reimbursableExpenseGroupingDateOptions[0].value],
        bankAccount: [this.exportSettings?.bank_account_name ? this.exportSettings?.bank_account_name : null],
        cccEntityName: [this.exportSettings?.credit_card_entity_name_preference ? this.exportSettings?.credit_card_entity_name_preference : null],
        cccAccountName: [this.exportSettings?.credit_card_account_name ? this.exportSettings?.credit_card_account_name : null],
        reimbursableExpenseState: [this.exportSettings?.reimbursable_expense_state ? this.exportSettings?.reimbursable_expense_state : null],
        cccExpenseState: [this.exportSettings?.credit_card_expense_state ? this.exportSettings?.credit_card_expense_state : null]
      });
      this.setCustomValidatorsAndWatchers();
      this.isLoading = false;
    }, () => {
        this.setUpExpenseStates();
        this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [null],
          reimbursableExpense: [false, this.exportSelectionValidator()],
          reimbursableExportGroup: [this.expenseGroupingFieldOptions[1].value],
          reimbursableExportDate: [null],
          creditCardExpense: [false, this.exportSelectionValidator()],
          cccExportType: [null],
          cccExportGroup: [this.expenseGroupingFieldOptions[1].value],
          cccExportDate: [this.reimbursableExpenseGroupingDateOptions[0].value],
          bankAccount: [null],
          cccEntityName: [null],
          cccAccountName: [null],
          reimbursableExpenseState: [null],
          cccExpenseState: [null]
        });
        this.setCustomValidatorsAndWatchers();
        this.isLoading = false;
      }
    );
  }

  private getPhase(): QBDProgressPhase {
    return this.isOnboarding ? QBDProgressPhase.ONBOARDING : QBDProgressPhase.POST_ONBOARDING;
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);
    this.exportSettingService.postQbdExportSettings(exportSettingPayload).subscribe((response: QBDExportSettingGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      this.trackingService.trackTimeSpent(Page.EXPORT_SETTING_QBD, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QBDOnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(QBDOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          UpdateEvent.ADVANCED_SETTINGS_QBD,
          {
            phase: this.getPhase(),
            oldState: this.exportSettings,
            newState: response
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(QBDOnboardingState.FIELD_MAPPINGS);
        this.router.navigate([`/integrations/qbd/onboarding/field_mappings`]);
      }
    }, () => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      });
  }


  save(): void {
    if (this.exportSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
