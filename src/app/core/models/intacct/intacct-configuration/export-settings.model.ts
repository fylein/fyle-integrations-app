import { IntacctCorporateCreditCardExpensesObject, FyleField, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject, CCCExpenseState, IntacctExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../../enum/enum.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { ExportSettingOptionSearch } from "../../common/export-settings.model";

export type ExportSettingFormOption = {
    label: string,
    value: ExpenseState | IntacctReimbursableExpensesObject | IntacctCorporateCreditCardExpensesObject | ExportDateType | string | FyleField | null;
}

export type ExportSettingConfiguration = {
    employee_field_mapping: string,
    auto_map_employees: string,
    reimbursable_expenses_object: IntacctReimbursableExpensesObject | null,
    corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject | null,
    use_merchant_in_journal_line: boolean
  }

export type ExportSettingGeneralMapping = {
    default_gl_account: DefaultDestinationAttribute,
    default_credit_card: DefaultDestinationAttribute,
    default_charge_card: DefaultDestinationAttribute,
    default_ccc_expense_payment_type: DefaultDestinationAttribute,
    default_reimbursable_expense_payment_type: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
}

export type ExpenseGroupSettingPost = {
    expense_state: ExpenseState;
    ccc_expense_state: CCCExpenseState;
    reimbursable_expense_group_fields: string[] | null;
    reimbursable_export_date_type: ExportDateType | null;
    corporate_credit_card_expense_group_fields: string[] | null;
    ccc_export_date_type: ExportDateType | null;
  };

export interface IntacctExpenseGroupSettingPost extends ExpenseGroupSettingPost {
    split_expense_grouping: SplitExpenseGrouping;
  }

export interface IntacctExpenseGroupSettingGet extends IntacctExpenseGroupSettingPost {}

export type ExportSettingGet = {
    configurations: ExportSettingConfiguration,
    expense_group_settings: IntacctExpenseGroupSettingGet,
    general_mappings: ExportSettingGeneralMapping,
    workspace_id: number
}

export type ExportSettingPost = {
    configurations: ExportSettingConfiguration,
    expense_group_settings: IntacctExpenseGroupSettingPost,
    general_mappings: ExportSettingGeneralMapping
  }

export interface IntacctExportSettingOptionSearch extends ExportSettingOptionSearch {
    destinationOptionKey: IntacctExportSettingDestinationOptionKey
}
