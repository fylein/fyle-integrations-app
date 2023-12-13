import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject } from "../../enum/enum.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";

export type QBOExportSettingWorkspaceGeneralSettingPost = {
  reimbursable_expenses_object: QBOReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject | null
  name_in_journal_entry: NameInJournalEntry;
}

export type QBOExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute,
  default_ccc_account: DefaultDestinationAttribute,
  accounts_payable: DefaultDestinationAttribute,
  default_ccc_vendor: DefaultDestinationAttribute,
  qbo_expense_account: DefaultDestinationAttribute,
  default_debit_card_account: DefaultDestinationAttribute
}

export type QBOExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping
}

export type QBOExportSettingGet = {
  expense_group_settings: ExpenseGroupSettingGet,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping,
  workspace_id: number
}


export class QBOExportSettingModel {
  static markControllerAsRequired(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].setValidators(Validators.required);
  }

  static clearValidatorAndResetValue(form: FormGroup, controllerName: string): void {
    form.controls[controllerName].clearValidators();
    form.controls[controllerName].setValue(null);
  }

  static getReimbursableExportTypeOptions(employeeFieldMapping: EmployeeFieldMapping): SelectFormOption[] {
    return {
      EMPLOYEE: [
        {
          label: 'Check',
          value: QBOReimbursableExpensesObject.CHECK
        },
        {
          label: 'Expense',
          value: QBOReimbursableExpensesObject.EXPENSE
        },
        {
          label: 'Journal Entry',
          value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: QBOReimbursableExpensesObject.BILL
        },
        {
          label: 'Expense',
          value: QBOReimbursableExpensesObject.EXPENSE
        },
        {
          label: 'Journal Entry',
          value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ]
    }[employeeFieldMapping];
  }

  static getCreditCardExportTypes(): SelectFormOption[] {
    return [
      {
        label: 'Bill',
        value: QBOCorporateCreditCardExpensesObject.BILL
      },
      {
        label: 'Credit Card Purchase',
        value: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      },
      {
        label: 'Journal Entry',
        value: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      },
      {
        label: 'Debit Card Expense',
        value: QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      }
    ];
  }

  static getCCCExpenseStateOptions(): SelectFormOption[] {
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

  static getExpenseGroupByOptions(): SelectFormOption[] {
    return [
      {
        label: 'Expense',
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      },
      {
        label: 'Expense Report',
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];
  }

  static getNameInJournalOptions(): SelectFormOption[] {
    return [
      {
        label: 'Merchant Name',
        value: NameInJournalEntry.MERCHANT
      },
      {
        label: 'Employee Name',
        value: NameInJournalEntry.EMPLOYEE
      }
    ];
  }

  static getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Current Date',
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

  static getAdditionalCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Card Transaction Post date',
        value: ExportDateType.POSTED_AT
      },
      {
        label: 'Spend Date',
        value: ExportDateType.SPENT_AT
      }
    ];
  }

  static getMandatoryField(form: FormGroup, controllerName: string): boolean {
    switch (controllerName) {
      case 'bankAccount':
        return form.value.employeeMapping === EmployeeFieldMapping.EMPLOYEE && form.controls.reimbursableExportType.value && form.controls.reimbursableExportType.value !== QBOReimbursableExpensesObject.EXPENSE;
      case 'accountsPayable':
        return (form.controls.reimbursableExportType.value === QBOReimbursableExpensesObject.BILL || (form.controls.reimbursableExportType.value === QBOReimbursableExpensesObject.JOURNAL_ENTRY && form.value.employeeMapping === EmployeeFieldMapping.VENDOR)) || (form.controls.creditCardExportType.value === QBOCorporateCreditCardExpensesObject.BILL);
      case 'defaultCCCAccount':
        return form.controls.creditCardExportType.value && form.controls.creditCardExportType.value !== QBOCorporateCreditCardExpensesObject.BILL && form.controls.creditCardExportType.value !== QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
      case 'defaultCreditCardVendor':
        return form.controls.creditCardExportType.value === QBOCorporateCreditCardExpensesObject.BILL;
      case 'qboExpenseAccount':
        return form.controls.reimbursableExportType.value === QBOReimbursableExpensesObject.EXPENSE || form.controls.creditCardExportType.value === QBOCorporateCreditCardExpensesObject.EXPENSE;
      case 'defaultDebitCardAccount':
        return form.controls.creditCardExportType.value === QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE;
      default:
        return false;
    }
  }

  static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {
    const exportSettingValidatorRule: ExportSettingValidatorRule = {
      'reimbursableExpense': ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
      'creditCardExpense': ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState']
    };

    // TODO: use enum
    const exportModuleRule: ExportModuleRule[] = [
      {
        'formController': 'reimbursableExportType',
        'requiredValue': {
          'BILL': ['accountsPayable'],
          'CHECK': ['bankAccount'],
          'JOURNAL ENTRY': ['accountsPayable'],
          'EXPENSE': ['qboExpenseAccount']
        }
      },
      {
        'formController': 'creditCardExportType',
        'requiredValue': {
          'CREDIT CARD PURCHASE': ['defaultCCCAccount'],
          'BILL': ['defaultCreditCardVendor', 'accountsPayable'],
          'JOURNAL ENTRY': ['accountsPayable'],
          'EXPENSE': ['qboExpenseAccount'],
          'DEBIT CARD EXPENSE': ['defaultDebitCardAccount']
        }
      }
    ];

    return [exportSettingValidatorRule, exportModuleRule];
  }

  static mapAPIResponseToFormGroup(exportSettings: QBOExportSettingGet | null, employeeFieldMapping: EmployeeFieldMapping): FormGroup {
    return new FormGroup({
      employeeMapping: new FormControl(employeeFieldMapping),
      expenseState: new FormControl(exportSettings?.expense_group_settings?.expense_state),
      reimbursableExpense: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object ? true : false),
      reimbursableExportType: new FormControl(exportSettings?.workspace_general_settings?.reimbursable_expenses_object),
      reimbursableExportGroup: new FormControl(ExportSettingModel.getExportGroup(exportSettings?.expense_group_settings?.reimbursable_expense_group_fields)),
      reimbursableExportDate: new FormControl(exportSettings?.expense_group_settings?.reimbursable_export_date_type),
      cccExpenseState: new FormControl(exportSettings?.expense_group_settings?.ccc_expense_state),
      creditCardExpense: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false),
      creditCardExportType: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object),
      creditCardExportGroup: new FormControl(ExportSettingModel.getExportGroup(exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields)),
      creditCardExportDate: new FormControl(exportSettings?.expense_group_settings?.ccc_export_date_type),
      bankAccount: new FormControl(exportSettings?.general_mappings?.bank_account?.id ? exportSettings?.general_mappings.bank_account : null),
      defaultCCCAccount: new FormControl(exportSettings?.general_mappings?.default_ccc_account?.id ? exportSettings?.general_mappings.default_ccc_account : null),
      accountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings?.general_mappings.accounts_payable : null),
      defaultCreditCardVendor: new FormControl(exportSettings?.general_mappings?.default_ccc_vendor?.id ? exportSettings?.general_mappings.default_ccc_vendor : null),
      qboExpenseAccount: new FormControl(exportSettings?.general_mappings?.qbo_expense_account?.id ? exportSettings?.general_mappings.qbo_expense_account : null),
      defaultDebitCardAccount: new FormControl(exportSettings?.general_mappings?.default_debit_card_account?.id ? exportSettings?.general_mappings.default_debit_card_account : null),
      nameInJournalEntry: new FormControl(exportSettings?.workspace_general_settings.name_in_journal_entry ? exportSettings?.workspace_general_settings.name_in_journal_entry : NameInJournalEntry.EMPLOYEE )
    });
  }
}
