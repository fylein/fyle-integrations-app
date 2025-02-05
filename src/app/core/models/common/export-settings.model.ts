import { brandingContent } from "src/app/branding/branding-config";
import { DefaultDestinationAttribute, DestinationAttribute } from "../db/destination-attribute.model";
import { DestinationOptionKey, ExpenseGroupingFieldOption, ExportDateType, IntacctCorporateCreditCardExpensesObject, IntacctExportSettingDestinationOptionKey, IntacctReimbursableExpensesObject, NetsuiteExportSettingDestinationOptionKey, QboExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../enum/enum.model";
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

    static getCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: 'Card Transaction Post Date',
          value: ExportDateType.POSTED_AT
        },
        {
          label: 'Spend date',
          value: ExportDateType.SPENT_AT
        },
        {
          label: 'Last Spend date',
          value: ExportDateType.LAST_SPENT_AT
        },
        {
          label: brandingContent.common.currentDate,
          value: ExportDateType.CURRENT_DATE
        }
      ];
    }

    static getReimbursableExpenseGroupingDateOption(): SelectFormOption[] {
      return [
        {
          label: brandingContent.common.currentDate,
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
          label: 'Last Spend date',
          value: ExportDateType.LAST_SPENT_AT
        }
      ];
    }

    static dateGrouping(exportType:string, expenseGrouping: string, showApprovedDate: boolean, showVerificationDate: boolean): SelectFormOption[] {
      
      const excludedDate = expenseGrouping === 'expense' 
      ? ExportDateType.LAST_SPENT_AT 
      : ExportDateType.SPENT_AT;
      
      if (exportType === 'CCC') {
        return this.getCreditCardExpenseGroupingDateOptions().filter(option => option.value !== excludedDate);
      }

      let dateOptions = this.getReimbursableExpenseGroupingDateOption();
      let filterOptions: ExportDateType[] = [];

      if (showApprovedDate) {
        filterOptions.push(ExportDateType.VERIFIED_AT);
      } else if (showVerificationDate) {
        filterOptions.push(ExportDateType.APPROVED_AT);
      }

      filterOptions.push(excludedDate);
      
      return dateOptions.filter((item): item is { label: string; value: ExportDateType } =>
        item.value !== null && !filterOptions.includes(item.value as ExportDateType))

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
