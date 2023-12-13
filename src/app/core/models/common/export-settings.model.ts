import { ExpenseGroupingFieldOption } from "../enum/enum.model";

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
                return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
            });
            return exportGroup ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
        }
        return '';
    }
}
