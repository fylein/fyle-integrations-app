import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QBOReimbursableExpensesObject, SplitExpenseGrouping } from "../../enum/enum.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../../db/expense-group-setting.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ExportModuleRule, ExportSettingModel, ExportSettingValidatorRule } from "../../common/export-settings.model";
import { brandingConfig, brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";

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

export interface QBOExpenseGroupSettingPost extends ExpenseGroupSettingPost {
  split_expense_grouping: SplitExpenseGrouping;
}

export interface QBOExpenseGroupSettingGet extends QBOExpenseGroupSettingPost {}

export type QBOExportSettingPost = {
  expense_group_settings: QBOExpenseGroupSettingPost,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping
}

export type QBOExportSettingGet = {
  expense_group_settings: QBOExpenseGroupSettingGet,
  workspace_general_settings: QBOExportSettingWorkspaceGeneralSettingPost,
  general_mappings: QBOExportSettingGeneralMapping,
  workspace_id: number
}

export class QBOExportSettingModel extends ExportSettingModel {
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
    const creditCardExportTypes = [
      {
        label: 'Bill',
        value: QBOCorporateCreditCardExpensesObject.BILL
      },
      {
        label: 'Credit card purchase',
        value: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      },
      {
        label: 'Journal entry',
        value: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      }
    ];

    if (brandingConfig.brandId !== 'co') {
      creditCardExportTypes.push({
        label: 'Debit Card Expense',
        value: QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      });
    }

    return creditCardExportTypes;
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
        label: 'Expense report',
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

  static getAdditionalCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: 'Card Transaction Post Date',
        value: ExportDateType.POSTED_AT
      },
      {
        label: 'Spend date',
        value: ExportDateType.SPENT_AT
      }
    ];
  }

  static getMandatoryField(form: FormGroup, controllerName: string): boolean {
    switch (controllerName) {
      case 'bankAccount':
        return form.controls.employeeMapping.value === EmployeeFieldMapping.EMPLOYEE && form.controls.reimbursableExportType.value && form.controls.reimbursableExportType.value !== QBOReimbursableExpensesObject.EXPENSE;
      case 'accountsPayable':
        return (form.controls.reimbursableExportType.value === QBOReimbursableExpensesObject.BILL || (form.controls.reimbursableExportType.value === QBOReimbursableExpensesObject.JOURNAL_ENTRY && form.controls.employeeMapping.value === EmployeeFieldMapping.VENDOR)) || (form.controls.creditCardExportType.value === QBOCorporateCreditCardExpensesObject.BILL);
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
      reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'expenseState'],
      creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'cccExpenseState']
    };

    const exportModuleRule: ExportModuleRule[] = [
      {
        formController: 'reimbursableExportType',
        requiredValue: {
          [QBOReimbursableExpensesObject.BILL]: ['accountsPayable'],
          [QBOReimbursableExpensesObject.CHECK]: ['bankAccount'],
          [QBOReimbursableExpensesObject.JOURNAL_ENTRY]: ['accountsPayable', 'bankAccount'],
          [QBOReimbursableExpensesObject.EXPENSE]: ['qboExpenseAccount']
        }
      },
      {
        formController: 'creditCardExportType',
        requiredValue: {
          [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: ['defaultCCCAccount'],
          [QBOCorporateCreditCardExpensesObject.BILL]: ['defaultCreditCardVendor', 'accountsPayable'],
          [QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: ['accountsPayable', 'defaultCCCAccount'],
          [QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE]: ['defaultDebitCardAccount']
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
      reimbursableExportGroup: new FormControl(this.getExportGroup(exportSettings?.expense_group_settings?.reimbursable_expense_group_fields)),
      reimbursableExportDate: new FormControl(exportSettings?.expense_group_settings?.reimbursable_export_date_type),
      cccExpenseState: new FormControl(exportSettings?.expense_group_settings?.ccc_expense_state),
      creditCardExpense: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false),
      creditCardExportType: new FormControl(exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object),
      creditCardExportGroup: new FormControl(this.getExportGroup(exportSettings?.expense_group_settings?.corporate_credit_card_expense_group_fields)),
      creditCardExportDate: new FormControl(exportSettings?.expense_group_settings?.ccc_export_date_type),
      bankAccount: new FormControl(exportSettings?.general_mappings?.bank_account?.id ? exportSettings.general_mappings.bank_account : null),
      defaultCCCAccount: new FormControl(exportSettings?.general_mappings?.default_ccc_account?.id ? exportSettings.general_mappings.default_ccc_account : null),
      accountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings.general_mappings.accounts_payable : null),
      defaultCreditCardVendor: new FormControl(exportSettings?.general_mappings?.default_ccc_vendor?.id ? exportSettings.general_mappings.default_ccc_vendor : null),
      qboExpenseAccount: new FormControl(exportSettings?.general_mappings?.qbo_expense_account?.id ? exportSettings.general_mappings.qbo_expense_account : null),
      defaultDebitCardAccount: new FormControl(exportSettings?.general_mappings?.default_debit_card_account?.id ? exportSettings.general_mappings.default_debit_card_account : null),
      nameInJournalEntry: new FormControl(exportSettings?.workspace_general_settings?.name_in_journal_entry ? exportSettings.workspace_general_settings?.name_in_journal_entry : NameInJournalEntry.EMPLOYEE ),
      searchOption: new FormControl(''),
      splitExpenseGrouping: new FormControl(exportSettings?.expense_group_settings?.split_expense_grouping)
    });
  }

  static constructPayload(exportSettingsForm: FormGroup): QBOExportSettingPost {
    const emptyDestinationAttribute: DefaultDestinationAttribute = {id: null, name: null};
    let nameInJournalEntry = NameInJournalEntry.EMPLOYEE;

    if (!brandingFeatureConfig.featureFlags.exportSettings.nameInJournalEntry) {
      nameInJournalEntry = NameInJournalEntry.MERCHANT;
    } else {
      nameInJournalEntry = exportSettingsForm.get('nameInJournalEntry')?.value;
    }

    const exportSettingPayload: QBOExportSettingPost = {
      expense_group_settings: {
        expense_state: exportSettingsForm.get('expenseState')?.value,
        ccc_expense_state: exportSettingsForm.get('cccExpenseState')?.value,
        reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.get('reimbursableExportGroup')?.value] : null,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
        corporate_credit_card_expense_group_fields: exportSettingsForm.get('creditCardExportGroup')?.value ? [exportSettingsForm.get('creditCardExportGroup')?.value] : null,
        ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value,
        split_expense_grouping: exportSettingsForm.get('splitExpenseGrouping')?.value ? exportSettingsForm.get('splitExpenseGrouping')?.value : SplitExpenseGrouping.MULTIPLE_LINE_ITEM
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value,
        name_in_journal_entry: nameInJournalEntry
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : emptyDestinationAttribute,
        default_ccc_account: exportSettingsForm.get('defaultCCCAccount')?.value ? exportSettingsForm.get('defaultCCCAccount')?.value : emptyDestinationAttribute,
        accounts_payable: exportSettingsForm.get('accountsPayable')?.value ? exportSettingsForm.get('accountsPayable')?.value : emptyDestinationAttribute,
        default_ccc_vendor: exportSettingsForm.get('defaultCreditCardVendor')?.value ? exportSettingsForm.get('defaultCreditCardVendor')?.value : emptyDestinationAttribute,
        qbo_expense_account: exportSettingsForm.get('qboExpenseAccount')?.value ? exportSettingsForm.get('qboExpenseAccount')?.value : emptyDestinationAttribute,
        default_debit_card_account: exportSettingsForm.get('defaultDebitCardAccount')?.value ? exportSettingsForm.get('defaultDebitCardAccount')?.value : emptyDestinationAttribute
      }
    };

    return exportSettingPayload;
  }

  static createEmployeeSettingsForm(existingEmployeeFieldMapping: EmployeeFieldMapping, autoMapEmployees: boolean): FormGroup {
    return new FormGroup({
      employeeMapping: new FormControl(existingEmployeeFieldMapping, Validators.required),
      autoMapEmployee: new FormControl(autoMapEmployees),
      searchOption: new FormControl('')
    });
  }
}
