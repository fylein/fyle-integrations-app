import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { FormControl } from "@angular/forms";

export type QBOExportSettingWorkspaceGeneralSettingPost = {
  reimbursable_expenses_object: QBOReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject | null
  name_in_journal_entry: NameInJournalEntry;
}

export type QBOExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute,
  default_ccc_account: DefaultDestinationAttribute,
  accounts_payable: DefaultDestinationAttribute,
  default_ccc_vendor: DefaultDestinationAttribute,
  qbo_expense_account: DefaultDestinationAttribute,
  default_debit_card_account: DefaultDestinationAttribute
}

export interface QBOExpenseGroupSettingPost extends ExpenseGroupSettingPost {
  split_expense_grouping: SplitExpenseGrouping;
}

export interface QBOExpenseGroupSettingGet extends QBOExpenseGroupSettingPost {}

export type QBOExportSettingPost = {
  expense_group_settings: QBOExpenseGroupSettingPost,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping
}

export type QBOExportSettingGet = {
  expense_group_settings: QBOExpenseGroupSettingGet,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping,
  workspace_id: number
}

export type QboExportSettingsForm = {
  employeeMapping: FormControl<EmployeeFieldMapping | null>,
  reimbursableExpense: FormControl<boolean>,
  reimbursableExportType: FormControl<QBOReimbursableExpensesObject | null>,
  bankAccount: FormControl<DefaultDestinationAttribute | null>,
  qboExpenseAccount: FormControl<DefaultDestinationAttribute | null>,
  accountsPayable: FormControl<DefaultDestinationAttribute | null>,
  expenseState: FormControl<ExpenseState | null>,
  reimbursableExportGroup: FormControl<ExpenseGroupingFieldOption | null>,
  reimbursableExportDate: FormControl<ExportDateType | null>,
  creditCardExpense: FormControl<boolean>,
  creditCardExportType: FormControl<QBOCorporateCreditCardExpensesObject | null>,
  nameInJournalEntry: FormControl<NameInJournalEntry | null>,
  defaultCCCAccount: FormControl<DefaultDestinationAttribute | null>,
  defaultDebitCardAccount: FormControl<DefaultDestinationAttribute | null>,
  defaultCreditCardVendor: FormControl<DefaultDestinationAttribute | null>,
  CCCAccountsPayable: FormControl<DefaultDestinationAttribute | null>,
  cccExpenseState: FormControl<CCCExpenseState | null>,
  creditCardExportGroup: FormControl<ExpenseGroupingFieldOption | null>,
  creditCardExportDate: FormControl<ExportDateType | null>,
  splitExpenseGrouping: FormControl<SplitExpenseGrouping | null>,
  searchOption: FormControl<string | null>,
}
