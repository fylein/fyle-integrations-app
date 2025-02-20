import { brandingContent } from "src/app/branding/branding-config";
import { DefaultDestinationAttribute, DestinationAttribute } from "../db/destination-attribute.model";
import { DestinationOptionKey, ExpenseGroupingFieldOption, ExportDateType, FundSource, IntacctCorporateCreditCardExpensesObject, IntacctExportSettingDestinationOptionKey, IntacctReimbursableExpensesObject, NetsuiteExportSettingDestinationOptionKey, QboExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../enum/enum.model";
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
  destinationOptionKey: DestinationOptionKey;
};

export class ExportSettingModel {
    static getSplitExpenseGroupingOptions(): SelectFormOption[] {
      return [
        {
          label: 'Single Line Item',
          value: SplitExpenseGrouping.SINGLE_LINE_ITEM
        },
        {
          label: 'Multiple Line Item',
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
        }
            return [
                {
                  label: 'Charge Card Transaction',
                  value: IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION
                },
                {
                  label: 'Journal Entry',
                  value: IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY
                },
                {
                  label: 'Bill',
                  value: IntacctReimbursableExpensesObject.BILL
                }
              ];

    }

    static getExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: 'Export date',
          value: ExportDateType.CURRENT_DATE
        },
        {
          label: 'Verification date',
          value: ExportDateType.VERIFIED_AT
        },
        {
          label: 'Spend date',
          value: ExportDateType.SPENT_AT
        },
        {
          label: 'Approval date',
          value: ExportDateType.APPROVED_AT
        },
        {
          label: 'Last spend date',
          value: ExportDateType.LAST_SPENT_AT
        },
        {
          label: 'Card transaction post date',
          value: ExportDateType.POSTED_AT
        }
      ];
    }

    static constructExportDateOptions(isCoreCCCModule: boolean, expenseGrouping: ExpenseGroupingFieldOption, exportDateType: ExportDateType): SelectFormOption[] {

      // Determine the excluded date based on expenseGrouping
      const excludedSpendDateOption = expenseGrouping === ExpenseGroupingFieldOption.EXPENSE_ID
        ? ExportDateType.LAST_SPENT_AT
        : ExportDateType.SPENT_AT;

      // Determine the excluded date based on customer choose
      const excludedApprovedOrVerifiedOption = exportDateType === ExportDateType.APPROVED_AT ? [ExportDateType.VERIFIED_AT] : (exportDateType === ExportDateType.VERIFIED_AT ? [ExportDateType.APPROVED_AT] : [ExportDateType.APPROVED_AT, ExportDateType.VERIFIED_AT]);

      // Determine the excluded date based on export Type
      const excludedPostedAtOption = !isCoreCCCModule ? ExportDateType.POSTED_AT : null;

      // Array of unwanted dates
      const dateOptionsToBeExcluded = [excludedSpendDateOption, excludedPostedAtOption].concat(excludedApprovedOrVerifiedOption);

      // Get base date options
      const unfilteredDateOptions = this.getExpenseGroupingDateOptions();

      // Filter out excluded and unwanted dates
      return unfilteredDateOptions.filter(option =>
        option.value !== null && !dateOptionsToBeExcluded.includes(option.value as ExportDateType)
      );
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
