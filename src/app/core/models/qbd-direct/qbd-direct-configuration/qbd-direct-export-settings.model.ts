import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseState, FyleField, NameInJEField, NameInJournalEntry, QBDCorporateCreditCardExpensesObject, QbdDirectCCCExportDateType, QbdDirectExpenseGroupBy, QbdDirectReimbursableExpensesObject, QbdDirectReimbursableExportDateType, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { QBDExportSettingFormOption } from "../../qbd/qbd-configuration/qbd-export-setting.model";
import { DestinationAttribute } from "../../db/destination-attribute.model";

export type QbdDirectExportSettingsPost = {
    reimbursable_expense_export_type: QBDReimbursableExpensesObject | null,
    reimbursable_expense_state: ExpenseState | null,
    reimbursable_expense_date: QbdDirectReimbursableExportDateType | null,
    reimbursable_expense_grouped_by: QbdDirectExpenseGroupBy | null,
    credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject | null,
    credit_card_expense_state: CCCExpenseState | null,
    credit_card_expense_grouped_by: QbdDirectExpenseGroupBy | null,
    credit_card_expense_date: QbdDirectCCCExportDateType  | null,
    employee_field_mapping: EmployeeFieldMapping,
    auto_map_employees: boolean,
    name_in_journal_entry: NameInJournalEntry;
    je_single_credit_line: boolean;
    default_credit_card_account_name: string;
    default_credit_card_account_id: string;
    default_reimbursable_accounts_payable_account_name: string;
    default_reimbursable_accounts_payable_account_id: string;
    default_ccc_accounts_payable_account_name: string;
    default_ccc_accounts_payable_account_id: string;
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
                value: QbdDirectExpenseGroupBy.REPORT
            },
            {
                label: 'Expense',
                value: QbdDirectExpenseGroupBy.EXPENSE
            }
        ];
    }

    static reimbursableExpenseGroupingDateOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Current Date',
                value: QbdDirectReimbursableExportDateType.CURRENT_DATE
            },
            {
                label: 'Date of export',
                value: QbdDirectReimbursableExportDateType.LAST_SPENT_AT
            }
        ];
    }

    static creditCardExpenseGroupingDateOptions(): QBDExportSettingFormOption[] {
        return [
            {
                label: 'Current Date',
                value: QbdDirectCCCExportDateType.CURRENT_DATE
            },
            {
                label: 'Date of export',
                value: QbdDirectCCCExportDateType.SPENT_AT
            },
            {
                label: 'Card Transaction Post date',
                value: QbdDirectCCCExportDateType.POSTED_AT
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

    static setCreditCardExpenseGroupingDateOptions(cccExportType: QBDCorporateCreditCardExpensesObject, cccExportGroup: QbdDirectExpenseGroupBy):QBDExportSettingFormOption[] {
        if (cccExportType === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE){
          return this.creditCardExpenseGroupingDateOptions().slice(1);
        } else if (cccExportType === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY && cccExportGroup === QbdDirectExpenseGroupBy.EXPENSE) {
          return this.creditCardExpenseGroupingDateOptions();
        }
        return [this.creditCardExpenseGroupingDateOptions()[1]];
    }

    static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {

        const exportSettingValidatorRule: ExportSettingValidatorRule = {
          reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState', 'employeeMapping'],
          creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'creditCardExpenseState', 'defaultCreditCardAccountName']
        };

        const exportModuleRule: ExportModuleRule[] = [
            {
                formController: 'reimbursableExportType',
                requiredValue: {
                  [QbdDirectReimbursableExpensesObject.BILL]: [],
                  [QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY]: ['defaultReimbursableAccountsPayableAccountName']
                }
              },
              {
                formController: 'creditCardExportType',
                requiredValue: {
                  [QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: [],
                  [QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: ['defaultCCCAccountsPayableAccountName', 'nameInJE']
                }
              }
        ];

        return [exportSettingValidatorRule, exportModuleRule];
    }

    static mapAPIResponseToFormGroup(exportSettings: QbdDirectExportSettingGet | null): FormGroup {
        const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
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
            defaultCreditCardAccountName: new FormControl(exportSettings?.default_credit_card_account_id ? findObjectByDestinationId( [], exportSettings.default_credit_card_account_id) : null),
            defaultReimbursableAccountsPayableAccountName: new FormControl(exportSettings?.default_reimbursable_accounts_payable_account_id ? findObjectByDestinationId( [], exportSettings.default_reimbursable_accounts_payable_account_id) : null),
            defaultCCCAccountsPayableAccountName: new FormControl(exportSettings?.default_ccc_accounts_payable_account_id ? findObjectByDestinationId( [], exportSettings.default_ccc_accounts_payable_account_id) : null),
            jeSingleCreditLine: new FormControl(exportSettings?.je_single_credit_line ? exportSettings.je_single_credit_line : false),
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
            name_in_journal_entry: exportSettingsForm.get('nameInJE')?.value ? exportSettingsForm.get('nameInJE')?.value : null,
            je_single_credit_line: exportSettingsForm.get('jeSingleCreditLine')?.value ? exportSettingsForm.get('jeSingleCreditLine')?.value : false,
            default_credit_card_account_name: exportSettingsForm.get('defaultCreditCardAccountName')?.value ? exportSettingsForm.get('defaultCreditCardAccountName')?.value.value : null,
            default_credit_card_account_id: exportSettingsForm.get('defaultCreditCardAccountName')?.value ? exportSettingsForm.get('defaultCreditCardAccountName')?.value.destination_id : null,
            default_reimbursable_accounts_payable_account_name: exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value.value : null,
            default_reimbursable_accounts_payable_account_id: exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value.destination_id : null,
            default_ccc_accounts_payable_account_name: exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value.value : null,
            default_ccc_accounts_payable_account_id: exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value.destination_id : null
        };

        return exportSettingPayload;
    }
}