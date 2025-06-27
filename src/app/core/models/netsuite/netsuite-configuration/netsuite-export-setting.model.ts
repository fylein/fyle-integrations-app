import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, FyleField, NameInJournalEntry, NetSuiteCorporateCreditCardExpensesObject, NetsuiteReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import { ExportSettingFormOption } from "../../intacct/intacct-configuration/export-settings.model";
import { ExportSettingsService } from "src/app/core/services/common/export-settings.service";


export type NetsuiteExportSettingWorkspaceGeneralSettingPost = {
    employee_field_mapping: EmployeeFieldMapping,
    reimbursable_expenses_object: NetsuiteReimbursableExpensesObject | null,
    auto_map_employees: ExportSettingFormOption | null,
    corporate_credit_card_expenses_object: NetSuiteCorporateCreditCardExpensesObject | null
    name_in_journal_entry: NameInJournalEntry;
}


export type NetsuiteExportSettingGeneralMapping = {
    reimbursable_account: DefaultDestinationAttribute,
    default_ccc_account: DefaultDestinationAttribute,
    accounts_payable: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
}


export type NetSuiteExportSettingPost = {
    expense_group_settings: ExpenseGroupSettingPost,
    configuration: NetsuiteExportSettingWorkspaceGeneralSettingPost,
    general_mappings: NetsuiteExportSettingGeneralMapping
  }


export type NetSuiteExportSettingGet = {
    expense_group_settings: ExpenseGroupSettingGet,
    configuration: NetsuiteExportSettingWorkspaceGeneralSettingPost,
    general_mappings: NetsuiteExportSettingGeneralMapping,
    workspace_id: number
}