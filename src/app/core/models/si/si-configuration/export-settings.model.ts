import { FormGroup } from "@angular/forms";
import { CorporateCreditCardExpensesObject, FyleField, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject } from "../../enum/enum.model";
import { DestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingPost } from "../db/expense-group-setting.model";

export type ExportSettingFormOption = {
    label: string,
    value: ExpenseState | IntacctReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExportDateType | string | FyleField;
}

export type ExportSettingGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    is_simplify_report_closure_enabled: boolean,
    reimbursable_expenses_export_type: IntacctReimbursableExpensesObject | null,
    expense_state: ExpenseState | null,
    reimbursable_expense_date: ExportDateType | null,
    reimbursable_expense_grouped_by: string[] | null,
    auto_map_employees: string,
    employeeFieldMapping: string | null,
    credit_card_expense_export_type: CorporateCreditCardExpensesObject | null,
    ccc_expense_state: ExpenseState | null,
    credit_card_entity_name_preference: FyleField | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: string[] | null,
    credit_card_expense_date: ExportDateType | null,
    default_credit_card: string | null,
    default_gl_account: DestinationAttribute,
    default_charge_card: DestinationAttribute,
    default_ccc_vendor: DestinationAttribute
    workspace: number
}

export type ExportSettingConfiguration = {
    employee_field_mapping: string,
    auto_map_employees: string,
    reimbursable_expenses_object: IntacctReimbursableExpensesObject | null,
    corporate_credit_card_expenses_object: string | null,
    is_simplify_report_closure_enabled: boolean | null;
  }

export type ExportSettingGeneralMapping = {
    default_gl_account: DestinationAttribute,
    default_credit_card: DestinationAttribute,
    default_charge_card: DestinationAttribute,
    default_ccc_expense_payment_type: DestinationAttribute,
    default_reimbursable_expense_payment_type: DestinationAttribute,
    default_ccc_vendor: DestinationAttribute
}

export type ExportSettingPost = {
    configurations: ExportSettingConfiguration,
    expense_group_settings: ExpenseGroupSettingPost,
    general_mappings: ExportSettingGeneralMapping
  }

export class ExportSettingModel {
    static constructPayload(exportSettingsForm: FormGroup): ExportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const exportSettingPayload: ExportSettingPost = {
        expense_group_settings: {
            expense_state: exportSettingsForm.get('expenseState')?.value,
            ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
            reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
            reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
            corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
            ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value
        },
        configurations: {
            reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
            corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value,
            employee_field_mapping: exportSettingsForm.get('employeeFieldMapping')?.value,
            auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value,
            is_simplify_report_closure_enabled: true
        },
        general_mappings: {
            default_gl_account: exportSettingsForm.get('glAccount')?.value ? exportSettingsForm.get('glAccount')?.value : emptyDestinationAttribute,
            default_credit_card: exportSettingsForm.get('creditCard')?.value ? exportSettingsForm.get('creditCard')?.value : emptyDestinationAttribute,
            default_charge_card: exportSettingsForm.get('chargeCard')?.value ? exportSettingsForm.get('chargeCard')?.value : emptyDestinationAttribute,
            default_ccc_expense_payment_type: exportSettingsForm.get('cccExpensePaymentType')?.value ? exportSettingsForm.get('cccExpensePaymentType')?.value : emptyDestinationAttribute,
            default_reimbursable_expense_payment_type: exportSettingsForm.get('reimbursableExpensePaymentType')?.value ? exportSettingsForm.get('reimbursableExpensePaymentType')?.value : emptyDestinationAttribute,
            default_ccc_vendor: exportSettingsForm.get('creditCardVendor')?.value ? exportSettingsForm.get('creditCardVendor')?.value : emptyDestinationAttribute
        }
    };
      return exportSettingPayload;
    }
}