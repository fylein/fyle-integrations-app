import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QBDCorporateCreditCardExpensesObject, ConfigurationCta, QBDExpenseGroupedBy, ExpenseState, QBDExportDateType, QBDReimbursableExpensesObject, QBDOnboardingState, QBDEntity, ToastSeverity, ClickEvent, Page, ProgressPhase, UpdateEvent, CCCExpenseState, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { QBDExportSettingModel, QBDExportSettingFormOption, QBDExportSettingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbd-export-setting',
  templateUrl: './qbd-export-setting.component.html',
  styleUrls: ['./qbd-export-setting.component.scss']
})
export class QbdExportSettingComponent implements OnInit {

  isLoading: boolean = true;

  saveInProgress: boolean = false;

  isOnboarding: boolean = true;

  exportSettingsForm: FormGroup;

  ConfigurationCtaText = ConfigurationCta;

  QBDReimbursableExpensesObject= QBDReimbursableExpensesObject;

  expenseStateOptions: QBDExportSettingFormOption[];

  cccExpenseStateOptions: QBDExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = false;

  redirectLink = brandingKbArticles.topLevelArticles.QBD;

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
      label: 'Spend date',
      value: QBDExportDateType.SPENT_AT
    },
    {
      label: 'Date of export',
      value: QBDExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: QBDExportSettingFormOption[];

  creditCardExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Credit card purchase',
      value: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
    },
    {
      label: 'Journal entry',
      value: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }
  ];

  reimbursableExportTypes: QBDExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: QBDReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal entry',
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

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private exportSettingService: QbdExportSettingService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private workspaceService: QbdWorkspaceService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private mappingService: QbdMappingService
  ) { }

  navigateToMapping() {
    this.router.navigate([`/integrations/qbd/main/mapping`]);
  }

  reimbursableExpenseGroupingDateOptionsFn(): QBDExportSettingFormOption[] {
    const reimbursableExpenseGroup: QBDExportSettingFormOption[] = [];
    reimbursableExpenseGroup.push(this.reimbursableExpenseGroupingDateOptions[1]);
    return reimbursableExpenseGroup;
  }

  private CCCExportTypeWatcher(): void {
    this.exportSettingsForm.controls.cccExportType.valueChanges.subscribe((cccExportType: QBDCorporateCreditCardExpensesObject) => {
      this.setCreditCardExpenseGroupingDateOptions(cccExportType, this.exportSettingsForm.controls.cccExportGroup.value);
    });
  }

  private CCCExportGroupWatcher(): void {
    this.exportSettingsForm.controls.cccExportGroup.valueChanges.subscribe((cccExportGroup: QBDExpenseGroupedBy) => {
      this.setCreditCardExpenseGroupingDateOptions(this.exportSettingsForm.controls.cccExportType.value, cccExportGroup);
    });
  }

  private setCreditCardExpenseGroupingDateOptions(cccExportType: QBDCorporateCreditCardExpensesObject, cccExportGroup: QBDExpenseGroupedBy) : void {
    if (cccExportType === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE){
      this.cccExpenseGroupingDateOptions = [
        {
          label: 'Card transaction post date',
          value: QBDExportDateType.POSTED_AT
        },
        {
          label: 'Spend date',
          value: QBDExportDateType.SPENT_AT
        }
      ];
    } else if (cccExportType === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && cccExportGroup === QBDExpenseGroupedBy.EXPENSE) {
      this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
        label: 'Card transaction post date',
        value: QBDExportDateType.POSTED_AT
      }]);
    } else {
      this.cccExpenseGroupingDateOptions = [this.reimbursableExpenseGroupingDateOptions[1]];
    }
  }

  namePreference(): string {
    return `Grouping reflects how the expense entries of a ${this.exportType(this.exportSettingsForm.get('cccExportType')?.value, this.creditCardExportTypes) } are posted in QuickBooks Desktop.`;
  }

  accountName(): string {
    const name = this.exportSettingsForm.get('reimbursableExportType')?.value === QBDReimbursableExpensesObject.BILL ? 'accounts payable' : 'bank';
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
        this.exportSettingsForm.controls.cccExportDate.patchValue(this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.cccExpenseGroupingDateOptions[0].value);
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

  private setExportSettingValidatorsAndWatchers(): void {

    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();

    // CCCDateoptions
    this.CCCExportGroupWatcher();
    this.CCCExportTypeWatcher();
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
        } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
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
        label: 'Approved',
        value: CCCExpenseState.APPROVED
      },
      {
        label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
        value: CCCExpenseState.PAID
      }
    ];

    this.expenseStateOptions = [
      {
        label: this.is_simplify_report_closure_enabled ? 'Processing' : 'Payment processing',
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
        value: ExpenseState.PAID
      }
    ];
  }

  private setupCCCExpenseGroupingDateOptions(): void {
    if (this.exportSettings?.credit_card_expense_export_type) {
      const creditCardExpenseExportGroup = this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : QBDExpenseGroupedBy.EXPENSE;
      this.setCreditCardExpenseGroupingDateOptions(this.exportSettings?.credit_card_expense_export_type, creditCardExpenseExportGroup);
    } else {
      this.setCreditCardExpenseGroupingDateOptions(QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE, QBDExpenseGroupedBy.EXPENSE);
    }
  }

  private getSettingsAndSetupForm(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.exportSettingService.getQbdExportSettings().subscribe((exportSettingResponse : QBDExportSettingGet) => {
      this.exportSettings = exportSettingResponse;
      this.is_simplify_report_closure_enabled = this.exportSettings?.is_simplify_report_closure_enabled;
      this.setUpExpenseStates();
      this.setupCCCExpenseGroupingDateOptions();

      this.exportSettingsForm = this.formBuilder.group({
        reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type],
        reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false, this.exportSelectionValidator()],
        reimbursableExportGroup: [this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by : null],
        reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
        creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false, this.exportSelectionValidator()],
        cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings?.credit_card_expense_export_type : null],
        cccExportGroup: [this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions[1].value],
        cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.cccExpenseGroupingDateOptions[0].value],
        bankAccount: [this.exportSettings?.bank_account_name ? this.exportSettings?.bank_account_name : null],
        mileageAccountName: [this.exportSettings?.mileage_account_name ? this.exportSettings?.mileage_account_name : null],
        cccEntityName: [this.exportSettings?.credit_card_entity_name_preference ? this.exportSettings?.credit_card_entity_name_preference : null],
        cccAccountName: [this.exportSettings?.credit_card_account_name ? this.exportSettings?.credit_card_account_name : null],
        reimbursableExpenseState: [this.exportSettings?.reimbursable_expense_state ? this.exportSettings?.reimbursable_expense_state : null],
        cccExpenseState: [this.exportSettings?.credit_card_expense_state ? this.exportSettings?.credit_card_expense_state : null],
        searchOption: []
      });
      this.setExportSettingValidatorsAndWatchers();
      this.isLoading = false;
    }, () => {
        this.setUpExpenseStates();
        this.setupCCCExpenseGroupingDateOptions();
        this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [null],
          reimbursableExpense: [false, this.exportSelectionValidator()],
          reimbursableExportGroup: [this.expenseGroupingFieldOptions[1].value],
          reimbursableExportDate: [null],
          creditCardExpense: [false, this.exportSelectionValidator()],
          cccExportType: [null],
          cccExportGroup: [this.expenseGroupingFieldOptions[1].value],
          cccExportDate: [this.cccExpenseGroupingDateOptions[0].value],
          bankAccount: [null],
          mileageAccountName: [null],
          cccEntityName: [null],
          cccAccountName: [null],
          reimbursableExpenseState: [null],
          cccExpenseState: [null]
        });
        this.setExportSettingValidatorsAndWatchers();
        this.isLoading = false;
      }
    );
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = QBDExportSettingModel.constructPayload(this.exportSettingsForm);
    this.exportSettingService.postQbdExportSettings(exportSettingPayload).subscribe((response: QBDExportSettingGet) => {
      this.saveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      this.mappingService.refreshMappingPages();
      this.trackingService.trackTimeSpent(TrackingApp.QBD, Page.EXPORT_SETTING_QBD, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === QBDOnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.QBD, QBDOnboardingState.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.QBD,
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
