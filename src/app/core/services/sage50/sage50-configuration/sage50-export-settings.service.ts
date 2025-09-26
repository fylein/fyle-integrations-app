import { Injectable } from "@angular/core";
import { ApiService } from "../../common/api.service";
import { ExportSettingsService } from "../../common/export-settings.service";
import { Observable } from "rxjs";
import { WorkspaceService } from "../../common/workspace.service";
import { Sage50CCCExportType, Sage50CreditCardExpensesDate, Sage50ExpensesGroupedBy, Sage50ExportSettings, Sage50ExportSettingsForm, Sage50ReimbursableExpenseDate, Sage50ReimbursableExportType } from "src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectFormOption } from "src/app/core/models/common/select-form-option.model";

@Injectable({
    providedIn: 'root'
  })
export class Sage50ExportSettingsService extends ExportSettingsService {

  // Export type options
  public readonly sage50ReimbursableExportTypeOptions: SelectFormOption[] = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.generalJournalEntryOptionLabel'),
      value: Sage50ReimbursableExportType.GENERAL_JOURNAL_ENTRY
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.purchasesOptionLabel'),
      value: Sage50ReimbursableExportType.PURCHASES_RECEIVE_INVENTORY
    }
  ];

  public readonly sage50CCCExportTypeOptions: SelectFormOption[] = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.generalJournalEntryOptionLabel'),
      value: Sage50CCCExportType.GENERAL_JOURNAL_ENTRY
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.paymentsJournalOptionLabel'),
      value: Sage50CCCExportType.PAYMENTS_JOURNAL
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.purchasesOptionLabel'),
      value: Sage50CCCExportType.PURCHASES_RECEIVE_INVENTORY
    }
  ];

  // Expense state options
  public readonly sage50ReimbursableExpenseStateOptions = this.getReimbursableExpenseStateOptions();

  public readonly sage50CCCExpenseStateOptions = this.getCCCExpenseStateOptions();

  // Expense grouping options - for both reimbursable and CCC expenses
  public readonly sage50ExpenseGroupingOptions = this.getExpenseGroupingOptions();

  // Expense date options for CCC + group by expense only - all other cases are preset
  public readonly sage50CCCExpenseDateOptions: SelectFormOption[] = [
    {
      label: this.translocoService.translate('services.sage50ExportSettings.transactionPostDateOptionLabel'),
      value: Sage50CreditCardExpensesDate.POSTED_AT
    },
    {
      label: this.translocoService.translate('services.sage50ExportSettings.spendDateOptionLabel'),
      value: Sage50CreditCardExpensesDate.SPENT_AT
    }
  ];

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) {
    super();
  }

  getExportSettings(): Observable<Sage50ExportSettings> {
    return this.apiService.get(`/${this.workspaceService.getWorkspaceId()}/settings/export_settings/`, {});
  }

  mapApiResponseToFormGroup(apiResponse: Sage50ExportSettings | null): FormGroup<Sage50ExportSettingsForm> {
    return new FormGroup<Sage50ExportSettingsForm>({
      reimbursableExpenses: new FormControl(!!apiResponse?.reimbursable_expense_export_type, { nonNullable: true }),
      reimbursableExportType: new FormControl(apiResponse?.reimbursable_expense_export_type ?? null),
      reimbursableExpenseState: new FormControl(apiResponse?.reimbursable_expense_state ?? null),
      reimbursableExportDate: new FormControl(apiResponse?.reimbursable_expense_date ?? null),
      reimbursableExportGroup: new FormControl(apiResponse?.reimbursable_expense_grouped_by ?? null),
      cccExpenses: new FormControl(!!apiResponse?.credit_card_expense_export_type, { nonNullable: true }),
      cccExportType: new FormControl(apiResponse?.credit_card_expense_export_type ?? null),
      cccExpenseState: new FormControl(apiResponse?.credit_card_expense_state ?? null),
      cccExportDate: new FormControl(apiResponse?.credit_card_expense_date ?? null),
      cccExportGroup: new FormControl(apiResponse?.credit_card_expense_grouped_by ?? null),
      jeSingleCreditLine: new FormControl(apiResponse?.je_single_credit_line ? true : false),
      reimbursableDefaultAccountPayableAccount: new FormControl(apiResponse?.reimbursable_default_account_payable_account ?? null),
      reimbursableDefaultCreditLineAccount: new FormControl(apiResponse?.reimbursable_default_credit_line_account ?? null),
      cccDefaultCreditLineAccount: new FormControl(apiResponse?.ccc_default_credit_line_account ?? null),
      cccDefaultAccountPayableAccount: new FormControl(apiResponse?.ccc_default_account_payable_account ?? null),
      defaultPaymentMethod: new FormControl(apiResponse?.default_payment_method ?? null),
      defaultVendor: new FormControl(apiResponse?.default_vendor ?? null),
      defaultCashAccount: new FormControl(apiResponse?.default_cash_account ?? null)
    });
  }
}
