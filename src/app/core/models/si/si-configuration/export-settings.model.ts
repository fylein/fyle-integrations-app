import { AbstractControl, FormGroup } from "@angular/forms";
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
    default_credit_card: DefaultDestinationAttribute,
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
        const emptyDestinationAttribute = { id: null, name: null };

        const getFieldValueOrDefault = (field: AbstractControl | null): any => {
            return field?.value ? field.value : null;
        };

        const getValueWithIdAndName = (field: AbstractControl | null): any => {
            return field?.value ? { id: field.value.id, name: field.value.value } : emptyDestinationAttribute;
        };

        const exportSettingPayload: ExportSettingPost = {
            expense_group_settings: {
                expense_state: getFieldValueOrDefault(exportSettingsForm.get('reimbursableExpenseState')),
                ccc_expense_state: getFieldValueOrDefault(exportSettingsForm.get('cccExpenseState')),
                reimbursable_expense_group_fields: getFieldValueOrDefault(exportSettingsForm.get('reimbursableExportGroup')),
                reimbursable_export_date_type: getFieldValueOrDefault(exportSettingsForm.get('reimbursableExportDate')),
                corporate_credit_card_expense_group_fields: getFieldValueOrDefault(exportSettingsForm.get('creditCardExportGroup')),
                ccc_export_date_type: getFieldValueOrDefault(exportSettingsForm.get('creditCardExportDate'))
            },
            configurations: {
                reimbursable_expenses_object: getFieldValueOrDefault(exportSettingsForm.get('reimbursableExportType')),
                corporate_credit_card_expenses_object: getFieldValueOrDefault(exportSettingsForm.get('creditCardExportType')),
                employee_field_mapping: getFieldValueOrDefault(exportSettingsForm.get('reimbursableExportType')) || getFieldValueOrDefault(exportSettingsForm.get('cccEntityName')),
                auto_map_employees: getFieldValueOrDefault(exportSettingsForm.get('autoMapEmployees'))
            },
            general_mappings: {
                default_gl_account: getValueWithIdAndName(exportSettingsForm.get('glAccount')),
                default_credit_card: getValueWithIdAndName(exportSettingsForm.get('creditCard')),
                default_charge_card: getFieldValueOrDefault(exportSettingsForm.get('chargeCard')) || emptyDestinationAttribute,
                default_ccc_expense_payment_type: getFieldValueOrDefault(exportSettingsForm.get('cccExpensePaymentType')) || emptyDestinationAttribute,
                default_reimbursable_expense_payment_type: getValueWithIdAndName(exportSettingsForm.get('reimbursableExpensePaymentType')),
                default_ccc_vendor: getValueWithIdAndName(exportSettingsForm.get('creditCardVendor'))
            }
        };

        return exportSettingPayload;
    }
}
