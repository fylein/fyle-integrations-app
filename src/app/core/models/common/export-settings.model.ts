import { DefaultDestinationAttribute, DestinationAttribute } from "../db/destination-attribute.model";
import { DestinationAccountType, DestinationOptionKey, ExpenseGroupingFieldOption, ExportDateType, IntacctCorporateCreditCardExpensesObject, IntacctExportSettingDestinationOptionKey, IntacctReimbursableExpensesObject, NetsuiteExportSettingDestinationOptionKey, QboExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../enum/enum.model";
import { SelectFormOption } from "./select-form-option.model";

export type ExportSettingValidatorRule = {
    reimbursableExpense: string[];
    creditCardExpense: string[];
};

export type ExportModuleRule = {
    formController: string,
    requiredValue: Record<string, string[]>
};

export type ExportSettingOptionSearch = {
  searchTerm: string,
  destinationAttributes: any[],
  destinationOptionKey: DestinationOptionKey,
  formControllerName: string,
};

export class ExportSettingModel {
    static getSplitExpenseGroupingOptions(): SelectFormOption[] {
      return [
        {
          label: 'Single line item',
          value: SplitExpenseGrouping.SINGLE_LINE_ITEM
        },
        {
          label: 'Multiple line item',
          value: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
        }
      ];
    }

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
                  label: 'Expense report',
                  value: IntacctReimbursableExpensesObject.EXPENSE_REPORT
                },
                {
                  label: 'Journal entry',
                  value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
                },
                {
                  label: 'Charge card transaction',
                  value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
                }
              ];
        }
            return [
                {
                  label: 'Charge card transaction',
                  value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
                },
                {
                  label: 'Journal entry',
                  value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
                },
                {
                  label: 'Bill',
                  value: IntacctReimbursableExpensesObject.BILL
                }
              ];

    }

    static filterDateOptions(exportDateType: ExportDateType, dateOptions: SelectFormOption[]){
      const dateOptionToRemove = exportDateType;
      const filteredOptions = dateOptions.filter(option => option.value !== dateOptionToRemove);
      return filteredOptions;
    }

    static constructGroupingDateOptions(exportGroupType: ExpenseGroupingFieldOption, dateOptions: SelectFormOption[]) {
      if (exportGroupType === ExpenseGroupingFieldOption.EXPENSE_ID) {
        return ExportSettingModel.filterDateOptions(ExportDateType.LAST_SPENT_AT, dateOptions);
      } else if (exportGroupType===ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroupType===ExpenseGroupingFieldOption.REPORT_ID) {
        return ExportSettingModel.filterDateOptions(ExportDateType.SPENT_AT, dateOptions);
      }
      return dateOptions;
    }
}
