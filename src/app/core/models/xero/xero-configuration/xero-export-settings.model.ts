import { FormControl, FormGroup } from "@angular/forms";
import type { SelectFormOption } from "../../common/select-form-option.model";
import type { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { AutoMapEmployeeOptions, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, XeroCCCExpenseState, XeroCorporateCreditCardExpensesObject, XeroReimbursableExpensesObject } from "../../enum/enum.model";
import type { ExportModuleRule, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { ExportSettingModel } from "../../common/export-settings.model";
import { brandingContent } from "src/app/branding/branding-config";

export interface XeroExpenseGroupSettingPost {
  ccc_expense_state: XeroCCCExpenseState;
  reimbursable_expense_group_fields?: string[] | null;
  reimbursable_export_date_type: ExportDateType | null;
  corporate_credit_card_expense_group_fields?: string[] | null;
  ccc_export_date_type: ExportDateType | null;
  reimbursable_expense_state: ExpenseState
}

export interface XeroExpenseGroupSettingGet extends XeroExpenseGroupSettingPost {}

export interface XeroExportSettingWorkspaceGeneralSettingPost {
  reimbursable_expenses_object: XeroReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: XeroCorporateCreditCardExpensesObject | null,
  auto_map_employees: AutoMapEmployeeOptions | null,
}

export interface XeroExportSettingWorkspaceGeneralSetting extends XeroExportSettingWorkspaceGeneralSettingPost {
  is_simplify_report_closure_enabled: boolean
}

export interface XeroExportSettingGeneralMapping {
  bank_account: DefaultDestinationAttribute
}

export interface XeroExportSettingPost {
  expense_group_settings: XeroExpenseGroupSettingPost,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSettingPost,
  general_mappings: XeroExportSettingGeneralMapping
}

export interface XeroExportSettingGet {
  expense_group_settings: XeroExpenseGroupSettingGet,
  workspace_general_settings: XeroExportSettingWorkspaceGeneralSetting,
  general_mappings: XeroExportSettingGeneralMapping,
  workspace_id: number
}

export interface XeroSelectFormOption extends SelectFormOption {
  value: ExpenseState | XeroCCCExpenseState | XeroReimbursableExpensesObject | XeroCorporateCreditCardExpensesObject | ExpenseGroupingFieldOption | ExportDateType | AutoMapEmployeeOptions | null;
}

export class XeroExportSettingModel {

  static getReimbursableExportTypes() {
    return [
      {
        label: 'Purchase Bill',
        value: XeroReimbursableExpensesObject.PURCHASE_BILL
      }
    ];
  }

  static getCreditCardExportTypes() {
    return [
      {
        label: 'Bank Transactions',
        value: XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION
      }
    ];
  }

  static getReimbursableExpenseGroupingOptions(): SelectFormOption[] {
    return [
      {
        label: 'Report',
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];
  }

  static getCCCExpenseGroupingOptions(): SelectFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      }
    ];
  }

  static getAutoMapEmployeeOptions(): SelectFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Employee name on Fyle to contact name on Xero',
        value: AutoMapEmployeeOptions.NAME
      },
      {
        label: 'Employee email on Fyle to contact email on Xero',
        value: AutoMapEmployeeOptions.EMAIL
      }
    ];
  }

  static getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
     return [
      {
        label: brandingContent.common.currentDate,
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Verification Date',
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: 'Spend Date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval Date',
        value: ExportDateType.APPROVED_AT
      },
      {
        label: 'Last Spend Date',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  static getCCCExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
     {
       label: 'Spend Date',
       value: ExportDateType.SPENT_AT
     },
     {
       label: 'Card Transaction Post date',
       value: ExportDateType.POSTED_AT
     }
   ];
 }

  static getReimbursableExpenseStateOptions(): SelectFormOption[] {
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

  static getCCCExpenseStateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Approved',
        value: XeroCCCExpenseState.APPROVED
      },
      {
        label: 'Closed',
        value: XeroCCCExpenseState.PAID
      }
    ];
  }

  static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
      creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState', 'bankAccount']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        formController: 'reimbursableExportType',
        requiredValue: {
        }
      },
      {
        formController: 'creditCardExportType',
        requiredValue: {
        }
      }
    ];

    return [exportSettingValidatorRule, exportModuleRule];
  }

  static mapAPIResponseToFormGroup(exportSettings: XeroExportSettingGet | null, destinationAttribute: DestinationAttribute[]): FormGroup {
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      expenseState: new FormControl(exportSettings?.expense_group_settings?.reimbursable_expense_state),
      reimbursableExpense: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object ? true : false),
      reimbursableExportType: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object ? exportSettings?.workspace_general_settings?.reimbursable_expenses_object : XeroReimbursableExpensesObject.PURCHASE_BILL),
      reimbursableExportGroup: new FormControl(ExpenseGroupingFieldOption.CLAIM_NUMBER),
      reimbursableExportDate: new FormControl(exportSettings?.expense_group_settings?.reimbursable_export_date_type),
      cccExpenseState: new FormControl(exportSettings?.expense_group_settings?.ccc_expense_state),
      creditCardExpense: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false),
      creditCardExportType: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object : XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION),
      creditCardExportGroup: new FormControl(ExpenseGroupingFieldOption.EXPENSE_ID),
      creditCardExportDate: new FormControl(exportSettings?.expense_group_settings?.ccc_export_date_type),
      bankAccount: new FormControl(exportSettings?.general_mappings?.bank_account?.id ? findObjectByDestinationId(destinationAttribute, exportSettings.general_mappings.bank_account.id) : null),
      autoMapEmployees: new FormControl(exportSettings?.workspace_general_settings?.auto_map_employees),
      searchOption: new FormControl('')
    });
  }

  static constructPayload(exportSettingsForm: FormGroup): XeroExportSettingPost {
    const emptyDestinationAttribute = { id: null, name: null };
    const exportSettingPayload: XeroExportSettingPost = {
      expense_group_settings: {
        reimbursable_expense_state: exportSettingsForm.get('expenseState')?.value,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : ExportDateType.CURRENT_DATE,
        ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
        ccc_export_date_type: exportSettingsForm.get('cccExportDate')?.value ? exportSettingsForm.get('cccExportDate')?.value : ExportDateType.SPENT_AT
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExpense')?.value ? XeroReimbursableExpensesObject.PURCHASE_BILL : null,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExpense')?.value ? XeroCorporateCreditCardExpensesObject.BANK_TRANSACTION : null,
        auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ? ExportSettingModel.formatGeneralMappingPayload(exportSettingsForm.get('bankAccount')?.value) : emptyDestinationAttribute
      }
    };
    return exportSettingPayload;
  }
}
