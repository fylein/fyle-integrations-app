import { FormControl, FormGroup } from "@angular/forms";
import { ExpenseState, CCCExpenseState, Sage300ExpenseDate, Sage300ExportType, FyleField, ExpenseGroupingFieldOption } from "../../enum/enum.model";

export type Sage300ExportSettingFormOption = {
    label: string,
    value: ExpenseState | CCCExpenseState | Sage300ExportType | Sage300ExpenseDate | ExpenseGroupingFieldOption | FyleField
}

export type ValidatorRule = {
  [expenseType: string]: string[];
};

type Sage300ExportSetting = {
  reimbursable_expenses_export_type: Sage300ExportType,
  reimbursable_expense_state: ExpenseState,
  reimbursable_expense_date: Sage300ExpenseDate,
  reimbursable_expense_grouped_by: string[],
  credit_card_expense_export_type: Sage300ExportType,
  credit_card_expense_state:  CCCExpenseState,
  credit_card_expense_grouped_by: string[],
  credit_card_expense_date: Sage300ExpenseDate,
  default_ccc_credit_card_account_name: string,
  default_ccc_credit_card_account_id: string,
  default_reimbursable_credit_card_account_name: string,
  default_reimbursable_credit_card_account_id: string,
  default_vendor_name: string,
  default_vendor_id: string
};

export interface Sage300ExportSettingGet extends Sage300ExportSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface Sage300ExportSettingPost extends Sage300ExportSetting {}

export class ExportSettingModel {
  static getExportGroup(exportGroups: string[] | null): string {
    if (exportGroups) {
      const exportGroup = exportGroups.find((exportGroup) => {
        return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER;
      });
      return exportGroup ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
    }
    return '';
  }

  static mapAPIResponseToFormGroup(exportSettings: Sage300ExportSettingGet | void): FormGroup {
    return new FormGroup({
      reimbursableExpense: new FormControl(exportSettings?.reimbursable_expenses_export_type ? true : false),
      reimbursableExportType: new FormControl(exportSettings?.reimbursable_expenses_export_type ? exportSettings.reimbursable_expenses_export_type : null),
      reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
      reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date : null),
      reimbursableExportGroup: new FormControl(this.getExportGroup(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by: null)),
      defaultReimbursableCCCAccountName: new FormControl(exportSettings?.default_reimbursable_credit_card_account_name? exportSettings?.default_reimbursable_credit_card_account_name : null),
      defaultReimbursablCCCAccountId: new FormControl(exportSettings?.default_reimbursable_credit_card_account_id ? exportSettings?.default_reimbursable_credit_card_account_id : null),
      creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
      cccExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings.credit_card_expense_export_type : null),
      cccState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
      cccDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date : null),
      cccExportGroup: new FormControl(this.getExportGroup(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by: null)),
      defaultCreditCardCCCAccountName: new FormControl(exportSettings?.default_ccc_credit_card_account_name ? exportSettings?.default_ccc_credit_card_account_name : null),
      defaultCreditCardCCCAccountId: new FormControl(exportSettings?.default_ccc_credit_card_account_id ? exportSettings?.default_ccc_credit_card_account_id : null),
      defaultVendorName: new FormControl(exportSettings?.default_vendor_name ? exportSettings?.default_vendor_name : null),
      defaultVendorId: new FormControl(exportSettings?.default_vendor_id ? exportSettings?.default_vendor_id : null)
    });
  }
}
