import { FormGroup } from "@angular/forms";
import { QBDCorporateCreditCardExpensesObject, QBDEntity, QBDExpenseGroupedBy, ExpenseState, CCCExpenseState, QBDExportDateType, QBDFyleField, QBDReimbursableExpensesObject, QBDScheduleFrequency, QbdDirectCCCPurchasedFromField } from "../../enum/enum.model";

export type QBDExportSettingFormOption = {
    label: string,
    value: ExpenseState | QBDReimbursableExpensesObject | QBDCorporateCreditCardExpensesObject | QBDExportDateType | QBDExpenseGroupedBy | QBDScheduleFrequency | QBDFyleField | string | QBDEntity | QbdDirectCCCPurchasedFromField;
}

export type QBDExportSettingGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    reimbursable_expenses_export_type: QBDReimbursableExpensesObject | null,
    bank_account_name: string | null,
    mileage_account_name : string | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: QBDExportDateType | null,
    reimbursable_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject | null,
    credit_card_expense_state: CCCExpenseState | null,
    credit_card_entity_name_preference: QBDEntity | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_date: QBDExportDateType | null,
    workspace: number
}

export type QBDExportSettingPost = {
    reimbursable_expenses_export_type: QBDReimbursableExpensesObject | null,
    bank_account_name: string | null,
    mileage_account_name : string | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: QBDExportDateType | null,
    reimbursable_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject | null,
    credit_card_expense_state: CCCExpenseState | null,
    credit_card_entity_name_preference: QBDEntity | null,
    credit_card_account_name: string | null,
    credit_card_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_date: QBDExportDateType | null,
}

export class QBDExportSettingModel {
    static constructPayload(exportSettingsForm: FormGroup): QBDExportSettingPost {
      const exportSettingPayload: QBDExportSettingPost = {
            reimbursable_expenses_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
            bank_account_name: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : null,
            mileage_account_name: exportSettingsForm.get('mileageAccountName')?.value ? exportSettingsForm.get('mileageAccountName')?.value : null,
            reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
            reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
            reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExpense')?.value && exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
            credit_card_expense_export_type: exportSettingsForm.get('cccExportType')?.value ? exportSettingsForm.get('cccExportType')?.value : null,
            credit_card_expense_state: exportSettingsForm.get('cccExpenseState')?.value ? exportSettingsForm.get('cccExpenseState')?.value : null,
            credit_card_entity_name_preference: exportSettingsForm.get('cccEntityName')?.value ? exportSettingsForm.get('cccEntityName')?.value : null,
            credit_card_account_name: exportSettingsForm.get('cccAccountName')?.value ? exportSettingsForm.get('cccAccountName')?.value : null,
            credit_card_expense_grouped_by: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('cccExportGroup')?.value ? exportSettingsForm.get('cccExportGroup')?.value : null,
            credit_card_expense_date: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value : null
      };
      return exportSettingPayload;
    }
    }