import { DefaultDestinationAttribute, DestinationAttribute } from "../db/destination-attribute.model";
import { ExpenseGroupingFieldOption, IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject } from "../enum/enum.model";

export type ExportSettingValidatorRule = {
    reimbursableExpense: string[];
    creditCardExpense: string[];
};

export type ExportModuleRule = {
    formController: string,
    requiredValue: Record<string, string[]>
};

export class ExportSettingModel {
    static getExportGroup(exportGroups: string[] | null | undefined): string {
        if (exportGroups) {
            const exportGroup = exportGroups.find((exportGroup) => {
                return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.REPORT_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
            });
            return exportGroup && exportGroup !== ExpenseGroupingFieldOption.REPORT_ID ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
        }
        return '';
    }

    static formatGeneralMappingPayload(destinationAttribute: DestinationAttribute): DefaultDestinationAttribute {
        return {
            name: destinationAttribute.value,
            id: destinationAttribute.destination_id
        };
    }

    static constructCCCOptions(brandId: string) {
        if (brandId === 'fyle') {
            return [
                {
                  label: 'Bill',
                  value: IntacctReimbursableExpensesObject.BILL
                },
                {
                  label: 'Expense Report',
                  value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
                },
                {
                  label: 'Journal Entry',
                  value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
                },
                {
                  label: 'Charge Card Transaction',
                  value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
                }
              ];
        } else {
            return [
                {
                  label: 'Bill',
                  value: IntacctReimbursableExpensesObject.BILL
                },
                {
                  label: 'Journal Entry',
                  value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
                },
                {
                  label: 'Charge Card Transaction',
                  value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
                }
              ];
        }
    }
}
