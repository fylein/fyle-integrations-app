import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from '../../common/workspace.service';
import { ApiService } from '../../common/api.service';
import { QBOExportSettingGet, QBOExportSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { ExportModuleRule, ExportSettingValidatorRule } from 'src/app/core/models/common/export-settings.model';
import { AbstractControl, FormGroup } from '@angular/forms';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { ExportSettingsService } from '../../common/export-settings.service';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { SplitExpenseGrouping } from 'src/app/core/models/enum/enum.model';
import { FormControl, Validators } from '@angular/forms';
import { DefaultDestinationAttribute } from "../../../models/db/destination-attribute.model";
import { CCCExpenseState, ExpenseState, ExportDateType, NameInJournalEntry, ExpenseGroupingFieldOption, EmployeeFieldMapping, QBOReimbursableExpensesObject, QBOCorporateCreditCardExpensesObject } from 'src/app/core/models/enum/enum.model';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class QboExportSettingsService extends ExportSettingsService {

  private mandatoryFormController: string[] = [];

  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  getReimbursableExportTypeOptions(employeeFieldMapping: EmployeeFieldMapping): SelectFormOption[] {
    return {
      EMPLOYEE: [
        {
          label: this.translocoService.translate('services.qboExportSettings.check'),
          value: QBOReimbursableExpensesObject.CHECK
        },
        {
          label: this.translocoService.translate('services.qboExportSettings.expense'),
          value: QBOReimbursableExpensesObject.EXPENSE
        },
        {
          label: this.translocoService.translate('services.qboExportSettings.journalEntry'),
          value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ],
      VENDOR: [
        {
          label: this.translocoService.translate('services.qboExportSettings.bill'),
          value: QBOReimbursableExpensesObject.BILL
        },
        {
          label: this.translocoService.translate('services.qboExportSettings.expense'),
          value: QBOReimbursableExpensesObject.EXPENSE
        },
        {
          label: this.translocoService.translate('services.qboExportSettings.journalEntry'),
          value: QBOReimbursableExpensesObject.JOURNAL_ENTRY
        }
      ]
    }[employeeFieldMapping];
  }

  getCreditCardExportTypes(): SelectFormOption[] {
    const creditCardExportTypes = [
      {
        label: this.translocoService.translate('services.qboExportSettings.bill'),
        value: QBOCorporateCreditCardExpensesObject.BILL
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.creditCardPurchase'),
        value: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.journalEntry'),
        value: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      }
    ];

    if (brandingConfig.brandId !== 'co') {
      creditCardExportTypes.push({
        label: this.translocoService.translate('services.qboExportSettings.debitCreditCardExpense'),
        value: QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      });
    }

    return creditCardExportTypes;
  }

  override getCCCExpenseStateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboExportSettings.approved'),
        value: CCCExpenseState.APPROVED
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.closed'),
        value: CCCExpenseState.PAID
      }
    ];
  }

  override getReimbursableExpenseStateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboExportSettings.processing'),
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.closed'),
        value: ExpenseState.PAID
      }
    ];
  }

  getExpenseGroupByOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboExportSettings.expense'),
        value: ExpenseGroupingFieldOption.EXPENSE_ID
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.expenseReport'),
        value: ExpenseGroupingFieldOption.CLAIM_NUMBER
      }
    ];
  }

  getNameInJournalOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboExportSettings.merchantName'),
        value: NameInJournalEntry.MERCHANT
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.employeeName'),
        value: NameInJournalEntry.EMPLOYEE
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('common.currentDate'),
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.verificationDate'),
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.spendDate'),
        value: ExportDateType.SPENT_AT
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.approvalDate'),
        value: ExportDateType.APPROVED_AT
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.lastSpendDate'),
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  getAdditionalCreditCardExpenseGroupingDateOptions(): SelectFormOption[] {
    return [
      {
        label: this.translocoService.translate('services.qboExportSettings.cardTransactionPostDate'),
        value: ExportDateType.POSTED_AT
      },
      {
        label: this.translocoService.translate('services.qboExportSettings.spendDate'),
        value: ExportDateType.SPENT_AT
      }
    ];
  }

  static getMandatoryField(form: FormGroup, employeeMappingValue: EmployeeFieldMapping, controllerName: string): boolean {
    switch (controllerName) {
      case 'bankAccount':
        return employeeMappingValue === EmployeeFieldMapping.EMPLOYEE && form.controls.reimbursableExportType.value && form.controls.reimbursableExportType.value !== QBOReimbursableExpensesObject.EXPENSE;
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
          [QBOReimbursableExpensesObject.BILL]: [],
          [QBOReimbursableExpensesObject.CHECK]: ['bankAccount'],
          [QBOReimbursableExpensesObject.JOURNAL_ENTRY]: ['bankAccount'],
          [QBOReimbursableExpensesObject.EXPENSE]: ['qboExpenseAccount']
        }
      },
      {
        formController: 'creditCardExportType',
        requiredValue: {
          [QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: ['defaultCCCAccount'],
          [QBOCorporateCreditCardExpensesObject.BILL]: ['defaultCreditCardVendor'],
          [QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: ['defaultCCCAccount'],
          [QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE]: ['defaultDebitCardAccount']
        }
      }
    ];

    return [exportSettingValidatorRule, exportModuleRule];
  }

  mapAPIResponseToFormGroup(exportSettings: QBOExportSettingGet | null, employeeFieldMapping: EmployeeFieldMapping): FormGroup {
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
      CCCAccountsPayable: new FormControl(exportSettings?.general_mappings?.accounts_payable?.id ? exportSettings.general_mappings.accounts_payable : null),
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

    // Primary: CCC accounts payable; Fallback: reimbursable accounts payable
    // (since CCC accounts payable always has the latest value of reimbursable accounts payable, but not vice versa)
    const accountsPayable = exportSettingsForm.get('CCCAccountsPayable')?.value ?
      exportSettingsForm.get('CCCAccountsPayable')?.value :
      exportSettingsForm.get('accountsPayable')?.value;

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
        accounts_payable: accountsPayable,
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

  getExportSettings(): Observable<QBOExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: QBOExportSettingPost): Observable<QBOExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  setupDynamicValidators(form: FormGroup, employeeMappingControl: AbstractControl | null, values: ExportModuleRule, selectedValue: string): void {
    Object.entries(values.requiredValue).forEach(([key, value]) => {
      if (key === selectedValue) {
        value.forEach((formController: string) => {
          if (values.formController === 'creditCardExportType') {
            this.creditCardExportTypeChange.emit(selectedValue);
          }

          const isFieldMandatory = QboExportSettingsService.getMandatoryField(form, employeeMappingControl?.value, formController);
          if (isFieldMandatory) {
            this.mandatoryFormController.push(formController);
            HelperUtility.markControllerAsRequired(form, formController);
          } else {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      } else {
        value.forEach((formController: string) => {
          if (!this.mandatoryFormController.includes(formController)) {
            HelperUtility.clearValidatorAndResetValue(form, formController);
          }
        });
      }
    });
  }

  setExportTypeValidatorsAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup, employeeMappingControl: AbstractControl | null): void {
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((selectedValue) => {
        this.mandatoryFormController = [];
        this.setupDynamicValidators(form, employeeMappingControl, values, selectedValue);
      });
    });
  }
}
