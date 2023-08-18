import { FormGroup } from "@angular/forms";
import { CorporateCreditCardExpensesObject, FyleField, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject } from "../../enum/enum.model";
import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
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
    default_credit_card: DefaultDestinationAttribute | null,
    default_gl_account: DefaultDestinationAttribute,
    default_charge_card: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute,
    workspace: number
}

export type ExportSettingConfiguration = {
    employee_field_mapping: string,
    auto_map_employees: string,
    reimbursable_expenses_object: IntacctReimbursableExpensesObject | null,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject | null
  }

export type ExportSettingGeneralMapping = {
    default_gl_account: DefaultDestinationAttribute,
    default_credit_card: DefaultDestinationAttribute,
    default_charge_card: DefaultDestinationAttribute,
    default_ccc_expense_payment_type: DefaultDestinationAttribute,
    default_reimbursable_expense_payment_type: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
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
            expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
            ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value ? exportSettingsForm.get('cccExpenseState')?.value : null,
            reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
            reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
            corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
            ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value ? exportSettingsForm.get('creditCardExportDate')?.value : null
        },
        configurations: {
            reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
            corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value ? exportSettingsForm.get('creditCardExportType')?.value : null,
            employee_field_mapping: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('employeeFieldMapping')?.value : exportSettingsForm.get('cccEntityName')?.value,
            auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value ? exportSettingsForm.get('autoMapEmployees')?.value : null,
        },
        general_mappings: {
            default_gl_account: exportSettingsForm.get('glAccount')?.value ? {id : exportSettingsForm.get('glAccount')?.value.id, name: exportSettingsForm.get('glAccount')?.value.value} : emptyDestinationAttribute,
            default_credit_card: exportSettingsForm.get('creditCard')?.value ? {id : exportSettingsForm.get('creditCard')?.value.id, name: exportSettingsForm.get('creditCard')?.value.value} : emptyDestinationAttribute,
            default_charge_card: exportSettingsForm.get('chargeCard')?.value ? exportSettingsForm.get('chargeCard')?.value : emptyDestinationAttribute,
            default_ccc_expense_payment_type: exportSettingsForm.get('cccExpensePaymentType')?.value ? exportSettingsForm.get('cccExpensePaymentType')?.value : emptyDestinationAttribute,
            default_reimbursable_expense_payment_type: exportSettingsForm.get('reimbursableExpensePaymentType')?.value ? {id : exportSettingsForm.get('reimbursableExpensePaymentType')?.value.id, name: exportSettingsForm.get('reimbursableExpensePaymentType')?.value.value} : emptyDestinationAttribute,
            default_ccc_vendor: exportSettingsForm.get('creditCardVendor')?.value ? {id : exportSettingsForm.get('creditCardVendor')?.value.id, name: exportSettingsForm.get('creditCardVendor')?.value.value} : emptyDestinationAttribute
        }
    };
    console.log(exportSettingsForm.get('reimbursableExpensePaymentType')?.value);
      return exportSettingPayload;
    }
}