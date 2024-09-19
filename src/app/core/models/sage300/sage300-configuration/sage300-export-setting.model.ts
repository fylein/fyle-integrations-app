import { FormControl, FormGroup } from "@angular/forms";
import type { ExpenseState, CCCExpenseState, Sage300ExpenseDate, Sage300ExportType, FyleField, ExpenseGroupingFieldOption, IntacctCorporateCreditCardExpensesObject } from "../../enum/enum.model";
import { Sage300DestinationAttributes } from "../db/sage300-destination-attribuite.model";
import type { DestinationAttribute } from "../../db/destination-attribute.model";
import { GroupedDestinationAttribute } from "../../db/destination-attribute.model";

export interface Sage300ExportSettingFormOption {
    label: string,
    value: ExpenseState | CCCExpenseState | IntacctCorporateCreditCardExpensesObject | Sage300ExportType | Sage300ExpenseDate | ExpenseGroupingFieldOption | FyleField
}

export interface ExportSettingValidatorRule {
  reimbursableExpense: string[];
  creditCardExpense: string[];
}

export interface ExportModuleRule {
  formController: string,
  requiredValue: Record<string, string[]>
}

interface Sage300ExportSetting {
  reimbursable_expenses_export_type: Sage300ExportType,
  reimbursable_expense_state: ExpenseState,
  reimbursable_expense_date: Sage300ExpenseDate,
  reimbursable_expense_grouped_by: string,
  credit_card_expense_export_type: Sage300ExportType,
  credit_card_expense_state:  CCCExpenseState,
  credit_card_expense_grouped_by: string,
  credit_card_expense_date: Sage300ExpenseDate,
  default_ccc_credit_card_account_name: string,
  default_ccc_credit_card_account_id: string,
  default_ccc_account_payable_name: string,
  default_ccc_account_payable_id: string,
  default_reimbursable_credit_card_account_name: string,
  default_reimbursable_credit_card_account_id: string,
  default_reimbursable_account_payable_name: string,
  default_reimbursable_account_payable_id: string,
  default_debit_card_account_name: string,
  default_debit_card_account_id: string,
  default_vendor_name: string,
  default_vendor_id: string,
  default_job_name: string,
  default_job_id: string
}

export interface Sage300ExportSettingGet extends Sage300ExportSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface Sage300ExportSettingPost extends Sage300ExportSetting {}

export class ExportSettingModel {

  static mapAPIResponseToFormGroup(exportSettings: Sage300ExportSettingGet | null, vendors: DestinationAttribute[], accounts: DestinationAttribute[], jobs: DestinationAttribute[]): FormGroup {
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      reimbursableExpense: new FormControl(exportSettings?.reimbursable_expenses_export_type ? true : false),
      reimbursableExportType: new FormControl(exportSettings?.reimbursable_expenses_export_type ? exportSettings.reimbursable_expenses_export_type : null),
      reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
      reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date : null),
      reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by: null),
      defaultReimbursableCCCAccountName: new FormControl(exportSettings?.default_reimbursable_credit_card_account_name? exportSettings?.default_reimbursable_credit_card_account_name : null),
      defaultReimbursableAP: new FormControl(exportSettings?.default_reimbursable_account_payable_name ? findObjectByDestinationId(accounts, exportSettings?.default_reimbursable_account_payable_id) : null),
      creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
      cccExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings.credit_card_expense_export_type : null),
      cccExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
      cccExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date : null),
      cccExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by: null),
      defaultCreditCardCCCAccountName: new FormControl(exportSettings?.default_ccc_credit_card_account_name ? findObjectByDestinationId(accounts, exportSettings?.default_ccc_credit_card_account_id) : null),
      defaultCCCAP: new FormControl(exportSettings?.default_ccc_account_payable_name ? findObjectByDestinationId(accounts, exportSettings?.default_ccc_account_payable_id) : null),
      defaultVendorName: new FormControl(exportSettings?.default_vendor_name ? findObjectByDestinationId(vendors, exportSettings?.default_vendor_id) : null),
      defaultDebitCardAccountName: new FormControl(exportSettings?.default_debit_card_account_name ? findObjectByDestinationId(accounts, exportSettings?.default_debit_card_account_id) : null),
      defaultJobName: new FormControl(exportSettings?.default_job_name ? findObjectByDestinationId(jobs, exportSettings?.default_job_id) : null),
      searchOption: new FormControl('')
    });
  }

  /* eslint-disable */
  static createExportSettingPayload(exportSettingsForm: FormGroup): Sage300ExportSettingPost {
    return {
      reimbursable_expenses_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
      reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
      reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
      reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
      credit_card_expense_export_type: exportSettingsForm.get('cccExportType')?.value ? exportSettingsForm.get('cccExportType')?.value : null,
      credit_card_expense_state: exportSettingsForm.get('cccExpenseState')?.value ? exportSettingsForm.get('cccExpenseState')?.value : null,
      credit_card_expense_grouped_by: exportSettingsForm.get('cccExportGroup')?.value ? exportSettingsForm.get('cccExportGroup')?.value : null,
      credit_card_expense_date: exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value : null,
      default_ccc_credit_card_account_name: exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value ? exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value.value : null,
      default_ccc_credit_card_account_id: exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value ? exportSettingsForm.get('defaultCreditCardCCCAccountName')?.value.destination_id : null,
      default_ccc_account_payable_name: exportSettingsForm.get('defaultCCCAP')?.value ? exportSettingsForm.get('defaultCCCAP')?.value.value : null,
      default_ccc_account_payable_id: exportSettingsForm.get('defaultCCCAP')?.value ? exportSettingsForm.get('defaultCCCAP')?.value.destination_id : null,
      default_reimbursable_credit_card_account_name: exportSettingsForm.get('defaultReimbursableCCCAccountName')?.value ? exportSettingsForm.get('defaultReimbursableCCCAccountName')?.value.value : null,
      default_reimbursable_credit_card_account_id: exportSettingsForm.get('defaultReimbursableCCCAccountName')?.value ? exportSettingsForm.get('defaultReimbursableCCCAccountName')?.value.destination_id : null,
      default_reimbursable_account_payable_name: exportSettingsForm.get('defaultReimbursableAP')?.value ? exportSettingsForm.get('defaultReimbursableAP')?.value.value : null,
      default_reimbursable_account_payable_id: exportSettingsForm.get('defaultReimbursableAP')?.value ? exportSettingsForm.get('defaultReimbursableAP')?.value.destination_id : null,
      default_vendor_name: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.value : null,
      default_vendor_id: exportSettingsForm.get('defaultVendorName')?.value ? exportSettingsForm.get('defaultVendorName')?.value.destination_id : null,
      default_debit_card_account_name: exportSettingsForm.get('defaultDebitCardAccountName')?.value ? exportSettingsForm.get('defaultDebitCardAccountName')?.value.value : null,
      default_debit_card_account_id: exportSettingsForm.get('defaultDebitCardAccountName')?.value ? exportSettingsForm.get('defaultDebitCardAccountName')?.value.destination_id : null,
      default_job_name: exportSettingsForm.get('defaultJobName')?.value ? exportSettingsForm.get('defaultJobName')?.value.value : null,
      default_job_id: exportSettingsForm.get('defaultJobName')?.value ? exportSettingsForm.get('defaultJobName')?.value.destination_id : null
    };
  }
}
