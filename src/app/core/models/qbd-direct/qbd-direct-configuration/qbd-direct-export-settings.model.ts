import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { CCCExpenseState, ExpenseState, QBDCorporateCreditCardExpensesObject, QBDEntity, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject } from "../../enum/enum.model";
import { QBDExportSettingFormOption } from "../../qbd/qbd-configuration/qbd-export-setting.model";

export type QbdDirectExportSettingsPost = {
    is_simplify_report_closure_enabled: boolean,
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

export interface QbdDirectExportSettingGet extends QbdDirectExportSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number;
}

export class QbdDirectExportSettingModel extends ExportSettingModel {

    static expenseGroupingFieldOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Report',
                value: QBDExpenseGroupedBy.REPORT
            },
            {
                label: 'Expense',
                value: QBDExpenseGroupedBy.EXPENSE
            }
        ];
    }

    static reimbursableExpenseGroupingDateOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Spend Date',
                value: QBDExportDateType.SPENT_AT
            },
            {
                label: 'Date of export',
                value: QBDExportDateType.LAST_SPENT_AT
            }
        ];
    }

    static creditCardExportTypes(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Credit Card Purchase',
                value: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
            },
            {
                label: 'Journal Entry',
                value: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
            }
        ];
    }

    static reimbursableExportTypes(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Bill',
                value: QBDReimbursableExpensesObject.BILL
            },
            {
                label: 'Journal Entry',
                value: QBDReimbursableExpensesObject.JOURNAL_ENTRY
            }
        ];
    }

    static cccEntityNameOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Employee',
                value: QBDEntity.EMPLOYEE
            },
            {
                label: 'Vendor',
                value: QBDEntity.VENDOR
            }
        ];
    }

    static cccExpenseStateOptions(is_simplify_report_closure_enabled: boolean): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Approved',
                value: CCCExpenseState.APPROVED
            },
            {
                label: is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
                value: CCCExpenseState.PAID
            }
        ];
    }

    static expenseStateOptions(is_simplify_report_closure_enabled: boolean): QBDExportSettingFormOption[] {
        return [
            {
                label: is_simplify_report_closure_enabled ? 'Processing' : 'Payment Processing',
                value: ExpenseState.PAYMENT_PROCESSING
            },
            {
                label: is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
                value: ExpenseState.PAID
            }
        ];
    }

    static setCreditCardExpenseGroupingDateOptions(cccExportType: QBDCorporateCreditCardExpensesObject, cccExportGroup: QBDExpenseGroupedBy):QBDExportSettingFormOption[] {
        if (cccExportType === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE){
          return [
            {
                label: 'Card Transaction Post date',
                value: QBDExportDateType.POSTED_AT
            },
            {
                label: 'Spend Date',
                value: QBDExportDateType.SPENT_AT
            }
          ];
        } else if (cccExportType === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && cccExportGroup === QBDExpenseGroupedBy.EXPENSE) {
          return this.reimbursableExpenseGroupingDateOptions().concat([{
                label: 'Card Transaction Post date',
                value: QBDExportDateType.POSTED_AT
          }]);
        }
        return [this.reimbursableExpenseGroupingDateOptions()[1]];
    }

    static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {

        const exportSettingValidatorRule: ExportSettingValidatorRule = {
          reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'bankAccount', 'mileageAccountName'],
          creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'creditCardExpenseState', 'creditCardEntityName', 'creditCardAccount']
        };

        const exportModuleRule: ExportModuleRule[] = [];

        return [exportSettingValidatorRule, exportModuleRule];
    }

    static mapAPIResponseToFormGroup(exportSettings: QbdDirectExportSettingGet | null): FormGroup {
        return new FormGroup({
            reimbursableExportType: new FormControl(exportSettings?.reimbursable_expenses_export_type),
            reimbursableExpense: new FormControl(exportSettings?.reimbursable_expenses_export_type ? true : false),
            reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by : null),
            reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date : null),
            creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
            creditCardExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings?.credit_card_expense_export_type : null),
            creditCardExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions()[1].value),
            creditCardExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date : this.expenseGroupingFieldOptions()[0].value),
            bankAccount: new FormControl(exportSettings?.bank_account_name ? exportSettings?.bank_account_name : null),
            mileageAccountName: new FormControl(exportSettings?.mileage_account_name ? exportSettings?.mileage_account_name : null),
            creditCardEntityName: new FormControl(exportSettings?.credit_card_entity_name_preference ? exportSettings?.credit_card_entity_name_preference : null),
            creditCardAccount: new FormControl(exportSettings?.credit_card_account_name ? exportSettings?.credit_card_account_name : null),
            reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
            creditCardExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
            searchOption: new FormControl([])
        });
    }

    static constructPayload(exportSettingsForm: FormGroup): QbdDirectExportSettingsPost {
        const exportSettingPayload: QbdDirectExportSettingsPost = {
            reimbursable_expenses_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
            bank_account_name: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : null,
            mileage_account_name: exportSettingsForm.get('mileageAccountName')?.value ? exportSettingsForm.get('mileageAccountName')?.value : null,
            reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
            reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
            reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExpense')?.value && exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
            credit_card_expense_export_type: exportSettingsForm.get('creditCardExportType')?.value ? exportSettingsForm.get('creditCardExportType')?.value : null,
            credit_card_expense_state: exportSettingsForm.get('creditCardExpenseState')?.value ? exportSettingsForm.get('creditCardExpenseState')?.value : null,
            credit_card_entity_name_preference: exportSettingsForm.get('creditCardEntityName')?.value ? exportSettingsForm.get('creditCardEntityName')?.value : null,
            credit_card_account_name: exportSettingsForm.get('creditCardAccount')?.value ? exportSettingsForm.get('creditCardAccount')?.value : null,
            credit_card_expense_grouped_by: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportGroup')?.value ? exportSettingsForm.get('creditCardExportGroup')?.value : null,
            credit_card_expense_date: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportDate')?.value ? exportSettingsForm.get('creditCardExportDate')?.value : null,
            is_simplify_report_closure_enabled: false
        };

        return exportSettingPayload;
    }
}