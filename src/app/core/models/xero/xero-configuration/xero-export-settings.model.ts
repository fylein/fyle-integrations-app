import { FormGroup } from "@angular/forms";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { AutoMapEmployeeOptions, CCCExpenseState, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from "../../enum/enum.model";
import { ExportSettingGeneralMapping } from "../../intacct/intacct-configuration/export-settings.model";


export type XeroExportSettingWorkspaceGeneralSettingPost = {
  reimbursable_expenses_object: XeroReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: XeroCorporateCreditCardExpensesObject | null,
  auto_map_employees: AutoMapEmployeeOptions | null,
}

export interface XeroExportSettingWorkspaceGeneralSetting extends XeroExportSettingWorkspaceGeneralSettingPost {
  is_simplify_report_closure_enabled: boolean
}

export type XeroExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute
}

export type XeroExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSettingPost,
  general_mappings: XeroExportSettingGeneralMapping
}

export type XeroExportSettingGet = {
  expense_group_settings: ExpenseGroupSettingGet,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSetting,
  general_mappings: ExportSettingGeneralMapping,
  workspace_id: number
}

export interface XeroExportSettingFormOption extends SelectFormOption {
  value: ExpenseState | CCCExpenseState | XeroReimbursableExpensesObject | XeroCorporateCreditCardExpensesObject | ExpenseGroupingFieldOption | ExportDateType | AutoMapEmployeeOptions | null;
}

export class XeroExportSettingModel {
  static constructPayload(exportSettingsForm: FormGroup): XeroExportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const exportSettingPayload: XeroExportSettingPost = {
      expense_group_settings: {
        expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : ExportDateType.CURRENT_DATE,
        ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
        ccc_export_date_type: exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value : ExportDateType.SPENT_AT
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExpense')?.value ? XeroReimbursableExpensesObject.PURCHASE_BILL : null,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExpense')?.value ? XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION : null,
        auto_map_employees: exportSettingsForm.get('AutoMapEmployeeOptionss')?.value
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : emptyDestinationAttribute
      }
    };
    return exportSettingPayload;
  }
}
