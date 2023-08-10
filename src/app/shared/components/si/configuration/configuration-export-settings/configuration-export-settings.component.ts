import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CCCExpenseState, ConfigurationCta, CorporateCreditCardExpensesObject, Entity, ExpenseGroupedBy, ExpenseState, ExportDateType, RedirectLink, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ExportSettingFormOption, ExportSettingGet } from 'src/app/core/models/si/si-configuration/export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-configuration-export-settings',
  templateUrl: './configuration-export-settings.component.html',
  styleUrls: ['./configuration-export-settings.component.scss']
})
export class ConfigurationExportSettingsComponent implements OnInit {

  isLoading: boolean;

  exportSettingsForm: FormGroup;

  RedirectLink = RedirectLink;

  isOnboarding: boolean = true;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  ReimbursableExpensesObject= ReimbursableExpensesObject;

  expenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  is_simplify_report_closure_enabled: boolean = false;

  exportSettings: ExportSettingGet;

  customMessage: string;

  private sessionStartTime = new Date();

  expenseGroupingFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Expense Report',
      value: ExpenseGroupedBy.REPORT
    },
    {
      label: 'Expense',
      value: ExpenseGroupedBy.EXPENSE
    },
    {
      label: 'Payment',
      value: ExpenseGroupedBy.PAYMENT
    }
  ];

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = [
    {
      label: 'Spend Date',
      value: ExportDateType.SPENT_AT
    },
    {
      label: 'Current Date',
      value: ExportDateType.CURRENT_DATE
    },
    {
      label: 'Verification Date',
      value: ExportDateType.VERIFIED_DATE
    },
    {
      label: 'Approval Date',
      value: ExportDateType.APPROVAL_DATE
    },
    {
      label: 'Last Spend Date',
      value: ExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: ExportSettingFormOption[];

  creditCardExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: ReimbursableExpensesObject.BILL
    },
    {
      label: 'Expense Report',
      value: ReimbursableExpensesObject.EXPENSE_REPORT
    },
    {
      label: 'Journal Entry',
      value: CorporateCreditCardExpensesObject.JOURNAL_ENTRY
    },
    {
      label: 'Charge Card Transaction',
      value: CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
    }
  ];

  reimbursableExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Expense Report',
      value: ReimbursableExpensesObject.EXPENSE_REPORT
    },
    {
      label: 'Bill',
      value: ReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal Entry',
      value: ReimbursableExpensesObject.JOURNAL_ENTRY
    }
  ];

  EntityNameOptions: ExportSettingFormOption[] = [
    {
      label: 'Employee',
      value: Entity.EMPLOYEE
    },
    {
      label: 'Vendor',
      value: Entity.VENDOR
    }
  ];

  glAccount: boolean = false;

  constructor(
    private router: Router,
    private exportSettingService: SiExportSettingService,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: SiWorkspaceService
    ) { }

    private setUpExpenseStates(): void {
      this.cccExpenseStateOptions = [
        {
          label: this.is_simplify_report_closure_enabled ? 'Approved' : 'Payment Processing',
          value: this.is_simplify_report_closure_enabled ? CCCExpenseState.APPROVED: CCCExpenseState.PAYMENT_PROCESSING
        },
        {
          label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
          value: CCCExpenseState.PAID
        }
      ];

      this.expenseStateOptions = [
        {
          label: this.is_simplify_report_closure_enabled ? 'Processing' : 'Payment Processing',
          value: ExpenseState.PAYMENT_PROCESSING
        },
        {
          label: this.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
          value: ExpenseState.PAID
        }
      ];
    }

    private setCreditCardExpenseGroupingDateOptions(cccExportType: CorporateCreditCardExpensesObject, cccExportGroup: ExpenseGroupedBy) : void {
      if (cccExportType === CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION){
        this.cccExpenseGroupingDateOptions = [
          {
            label: 'Card Transaction Post date',
            value: ExportDateType.POSTED_AT
          },
          {
            label: 'Spend Date',
            value: ExportDateType.SPENT_AT
          }
        ];
      } else if (cccExportType === CorporateCreditCardExpensesObject.JOURNAL_ENTRY && cccExportGroup === ExpenseGroupedBy.EXPENSE) {
        this.cccExpenseGroupingDateOptions = this.reimbursableExpenseGroupingDateOptions.concat([{
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        }]);
      } else {
        this.cccExpenseGroupingDateOptions = [this.reimbursableExpenseGroupingDateOptions[1]];
      }
    }

    private setupCCCExpenseGroupingDateOptions(): void {
      if (this.exportSettings?.credit_card_expense_export_type) {
        const creditCardExpenseExportGroup = this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : ExpenseGroupedBy.EXPENSE;
        this.setCreditCardExpenseGroupingDateOptions(this.exportSettings?.credit_card_expense_export_type, creditCardExpenseExportGroup);
      } else {
        this.setCreditCardExpenseGroupingDateOptions(CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION, ExpenseGroupedBy.EXPENSE);
      }
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

    private exportFieldsWatcher(): void {
      this.createReimbursableExpenseWatcher();
      this.createCreditCardExpenseWatcher();
    }

    private getSettingsAndSetupForm(): void {
      this.isLoading = true;
      this.isOnboarding = this.router.url.includes('onboarding');
      this.exportSettingService.getExportSettings().subscribe((exportSettingResponse : ExportSettingGet) => {
        this.exportSettings = exportSettingResponse;
        this.is_simplify_report_closure_enabled = this.exportSettings?.is_simplify_report_closure_enabled;
        this.setUpExpenseStates();
        this.setupCCCExpenseGroupingDateOptions();

        this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [this.exportSettings?.reimbursable_expenses_export_type],
          reimbursableExpense: [this.exportSettings?.reimbursable_expenses_export_type ? true : false],
          reimbursableExportGroup: [this.exportSettings?.reimbursable_expense_grouped_by ? this.exportSettings?.reimbursable_expense_grouped_by : null],
          reimbursableExportDate: [this.exportSettings?.reimbursable_expense_date ? this.exportSettings?.reimbursable_expense_date : null],
          employeeFieldMapping: [this.exportSettings?.employeeFieldMapping ? this.exportSettings?.employeeFieldMapping : null],
          creditCardExpense: [this.exportSettings?.credit_card_expense_export_type ? true : false],
          cccExportType: [this.exportSettings?.credit_card_expense_export_type ? this.exportSettings?.credit_card_expense_export_type : null],
          cccExportGroup: [this.exportSettings?.credit_card_expense_grouped_by ? this.exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions[1].value],
          cccExportDate: [this.exportSettings?.credit_card_expense_date ? this.exportSettings?.credit_card_expense_date : this.cccExpenseGroupingDateOptions[0].value],
          bankAccount: [this.exportSettings?.bank_account_name ? this.exportSettings?.bank_account_name : null],
          cccEntityName: [this.exportSettings?.credit_card_entity_name_preference ? this.exportSettings?.credit_card_entity_name_preference : null],
          cccAccountName: [this.exportSettings?.credit_card_account_name ? this.exportSettings?.credit_card_account_name : null],
          reimbursableExpenseState: [this.exportSettings?.reimbursable_expense_state ? this.exportSettings?.reimbursable_expense_state : null],
          cccExpenseState: [this.exportSettings?.credit_card_expense_state ? this.exportSettings?.credit_card_expense_state : null]
        });
        this.exportFieldsWatcher();
        this.isLoading = false;
      }, () => {
          this.setUpExpenseStates();
          this.setupCCCExpenseGroupingDateOptions();
          this.exportSettingsForm = this.formBuilder.group({
            reimbursableExportType: [null],
            reimbursableExpense: [false],
            reimbursableExportGroup: [this.expenseGroupingFieldOptions[1].value],
            reimbursableExportDate: [null],
            employeeFieldMapping: [null],
            creditCardExpense: [false],
            cccExportType: [null],
            cccExportGroup: [this.expenseGroupingFieldOptions[1].value],
            cccExportDate: [this.cccExpenseGroupingDateOptions[0].value],
            bankAccount: [null],
            cccEntityName: [null],
            cccAccountName: [null],
            reimbursableExpenseState: [null],
            cccExpenseState: [null]
          });
          this.exportFieldsWatcher();
          this.isLoading = false;
        }
      );
    }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
