import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseState, FyleField, NameInJEField, NameInJournalEntry, QBDCorporateCreditCardExpensesObject, QbdDirectReimbursableExpensesObject, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { QBDExportSettingFormOption } from "../../qbd/qbd-configuration/qbd-export-setting.model";

export type QbdDirectExportSettingsPost = {
    reimbursable_expense_export_type: QBDReimbursableExpensesObject | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: QBDExportDateType | null,
    reimbursable_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject | null,
    credit_card_expense_state: CCCExpenseState | null,
    credit_card_expense_grouped_by: QBDExpenseGroupedBy | null,
    credit_card_expense_date: QBDExportDateType | null,
    split_expense_grouping?: SplitExpenseGrouping,
    employee_field_mapping: EmployeeFieldMapping,
    auto_map_employees: boolean,
    name_in_journal_entry: NameInJournalEntry;
}

export interface QbdDirectExportSettingGet extends QbdDirectExportSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number;
}

export class QbdDirectExportSettingModel extends ExportSettingModel {

    static nameInJEOptions(): QBDExportSettingFormOption[] {
        return [
            {
              label: 'Employee',
              value: FyleField.EMPLOYEE
            },
            {
              label: 'Merchant',
              value: NameInJEField.MERCHANT
            }
        ];
    }

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
                value: QbdDirectReimbursableExpensesObject.BILL
            },
            {
                label: 'Journal Entry',
                value: QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY
            }
            // {
            //     Label: 'Check',
            //     Value: QbdDirectReimbursableExpensesObject.CHECK
            // }
        ];
    }

    static cccExpenseStateOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Approved',
                value: CCCExpenseState.APPROVED
            },
            {
                label: 'Closed',
                value: CCCExpenseState.PAID
            }
        ];
    }

    static expenseStateOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Processing',
                value: ExpenseState.PAYMENT_PROCESSING
            },
            {
                label: 'Closed',
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
          reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
          creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'creditCardExpenseState']
        };

        const exportModuleRule: ExportModuleRule[] = [];

        return [exportSettingValidatorRule, exportModuleRule];
    }

    static mapAPIResponseToFormGroup(exportSettings: QbdDirectExportSettingGet | null): FormGroup {
        return new FormGroup({
            reimbursableExportType: new FormControl(exportSettings?.reimbursable_expense_export_type),
            reimbursableExpense: new FormControl(exportSettings?.reimbursable_expense_export_type ? true : false),
            reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by : null),
            reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date : null),
            creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
            creditCardExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings?.credit_card_expense_export_type : null),
            creditCardExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions()[1].value),
            creditCardExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date : this.expenseGroupingFieldOptions()[0].value),
            reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
            creditCardExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
            employeeMapping: new FormControl(exportSettings?.employee_field_mapping ? exportSettings?.employee_field_mapping : null),
            autoMapEmployees: new FormControl(exportSettings?.auto_map_employees ? exportSettings?.auto_map_employees : null),
            nameInJE: new FormControl(exportSettings?.name_in_journal_entry ? exportSettings?.name_in_journal_entry : null),
            searchOption: new FormControl([])
        });
    }

    static constructPayload(exportSettingsForm: FormGroup): QbdDirectExportSettingsPost {
        const exportSettingPayload: QbdDirectExportSettingsPost = {
            reimbursable_expense_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
            reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
            reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
            reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExpense')?.value && exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
            credit_card_expense_export_type: exportSettingsForm.get('creditCardExportType')?.value ? exportSettingsForm.get('creditCardExportType')?.value : null,
            credit_card_expense_state: exportSettingsForm.get('creditCardExpenseState')?.value ? exportSettingsForm.get('creditCardExpenseState')?.value : null,
            credit_card_expense_grouped_by: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportGroup')?.value ? exportSettingsForm.get('creditCardExportGroup')?.value : null,
            credit_card_expense_date: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportDate')?.value ? exportSettingsForm.get('creditCardExportDate')?.value : null,
            employee_field_mapping: exportSettingsForm.get('employeeMapping')?.value ? exportSettingsForm.get('employeeMapping')?.value : null,
            auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value ? exportSettingsForm.get('autoMapEmployees')?.value : false,
            name_in_journal_entry: exportSettingsForm.get('nameInJE')?.value ? exportSettingsForm.get('nameInJE')?.value : null
        };

        return exportSettingPayload;
    }
}