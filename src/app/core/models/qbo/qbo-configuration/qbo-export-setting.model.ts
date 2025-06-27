import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ExportModuleRule, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { brandingConfig, brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { ExportSettingsService } from "src/app/core/services/common/export-settings.service";

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
