import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
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
      label: 'Report',
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
      label: 'Date of export',
      value: ExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: ExportSettingFormOption[];

  creditCardExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Charge Card Transaction',
      value: CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
    },
    {
      label: 'Journal Entry',
      value: CorporateCreditCardExpensesObject.JOURNAL_ENTRY
    }
  ];

  reimbursableExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Bill',
      value: ReimbursableExpensesObject.BILL
    },
    {
      label: 'Journal Entry',
      value: ReimbursableExpensesObject.JOURNAL_ENTRY
    },
    {
      label: 'Expense Report',
      value: ReimbursableExpensesObject.EXPENSE_REPORT
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
      this.isLoading = false;
    }, () => {
        this.setUpExpenseStates();
        this.setupCCCExpenseGroupingDateOptions();
        this.exportSettingsForm = this.formBuilder.group({
          reimbursableExportType: [null],
          reimbursableExpense: [false],
          reimbursableExportGroup: [this.expenseGroupingFieldOptions[1].value],
          reimbursableExportDate: [null],
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
        this.isLoading = false;
      }
    );
  }

  private watcher(): void {
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
    this.watcher();
  }

}
