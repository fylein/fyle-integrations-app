import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { WorkspaceService } from '../../common/workspace.service';
import { Observable } from 'rxjs';
import { QbdDirectExportSettingGet, QbdDirectExportSettingsPost } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { HelperUtility } from 'src/app/core/models/common/helper.model';
import { FormControl, FormGroup } from "@angular/forms";
import { ExportModuleRule, ExportSettingValidatorRule } from "../../../models/common/export-settings.model";
import { CCCExpenseState, EmployeeFieldMapping, ExpenseState, FyleField, NameInJEField, NameInJournalEntry, QBDCorporateCreditCardExpensesObject, QbdDirectCCCExportDateType, QbdDirectExpenseGroupBy, QbdDirectReimbursableExpensesObject, QbdDirectReimbursableExportDateType, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject, SplitExpenseGrouping } from "../../../models/enum/enum.model";
import { QBDExportSettingFormOption } from "../../../models/qbd/qbd-configuration/qbd-export-setting.model";
import { DestinationAttribute } from "../../../models/db/destination-attribute.model";
import { QbdDirectDestinationAttribute } from "../../../models/qbd-direct/db/qbd-direct-destination-attribuite.model";
import { ExportSettingsService } from "src/app/core/services/common/export-settings.service";
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class QbdDirectExportSettingsService extends ExportSettingsService {

  mandatoryFormController: string[];

  @Output() creditCardExportTypeChange: EventEmitter<string> = new EventEmitter();

  private apiService: ApiService = inject(ApiService);

  private workspaceService: WorkspaceService = inject(WorkspaceService);

  private helper: HelperService = inject(HelperService);

  private translocoService: TranslocoService = inject(TranslocoService);

  constructor() {
    super();
    this.helper.setBaseApiURL();
  }

  static nameInJEOptions(): QBDExportSettingFormOption[] {
    return [
        {
          label: 'Employee',
          value: FyleField.EMPLOYEE
        },
        {
          label: 'Merchant',
          value: NameInJEField.MERCHANT
        }
    ];
  }

  static expenseGroupingFieldOptions(): QBDExportSettingFormOption[] {
      return [
          {
              label: 'Report',
              value: QbdDirectExpenseGroupBy.REPORT
          },
          {
              label: 'Expense',
              value: QbdDirectExpenseGroupBy.EXPENSE
          }
      ];
  }

  reimbursableExpenseGroupingDateOptions(): QBDExportSettingFormOption[] {
      return [
          {
              label: this.translocoService.translate('common.currentDate'),
              value: QbdDirectReimbursableExportDateType.CURRENT_DATE
          }
      ];
  }

  creditCardExpenseGroupingDateOptions(): QBDExportSettingFormOption[] {
      return [
          {
              label: this.translocoService.translate('common.currentDate'),
              value: QbdDirectCCCExportDateType.CURRENT_DATE
          },
          {
              label: 'Card transaction post date',
              value: QbdDirectCCCExportDateType.POSTED_AT
          }
      ];
  }

  static creditCardExportTypes(): QBDExportSettingFormOption[] {
      return [
          {
              label: 'Credit card purchase',
              value: QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
          },
          {
              label: 'Journal entry',
              value: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY
          }
      ];
  }

  static reimbursableExportTypes(): QBDExportSettingFormOption[] {
      return [
          {
              label: 'Bill',
              value: QbdDirectReimbursableExpensesObject.BILL
          },
          {
              label: 'Journal entry',
              value: QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY
          }
          // {
          //     Label: 'Check',
          //     Value: QbdDirectReimbursableExpensesObject.CHECK
          // }
      ];
  }

  static cccExpenseStateOptions(): QBDExportSettingFormOption[] {
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

  static expenseStateOptions(): QBDExportSettingFormOption[] {
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

  setCreditCardExpenseGroupingDateOptions(cccExportGroup: QbdDirectExpenseGroupBy):QBDExportSettingFormOption[] {
      if (cccExportGroup === QbdDirectExpenseGroupBy.REPORT) {
        return this.creditCardExpenseGroupingDateOptions().concat([{
          label: 'Last spend date',
          value: QbdDirectCCCExportDateType.LAST_SPEND_AT
      }]);
      }
      return this.creditCardExpenseGroupingDateOptions().concat([{
          label: 'Spend date',
          value: QbdDirectCCCExportDateType.SPENT_AT
      }]);
  }

  setReimbursableExpenseGroupingDateOptions(reimbursableExportGroup: QbdDirectExpenseGroupBy):QBDExportSettingFormOption[] {
      if (reimbursableExportGroup === QbdDirectExpenseGroupBy.REPORT) {
        return this.reimbursableExpenseGroupingDateOptions().concat([{
          label: 'Last spend date',
          value: QbdDirectReimbursableExportDateType.LAST_SPENT_AT
      }]);
      }
      return this.reimbursableExpenseGroupingDateOptions().concat([{
          label: 'Spend date',
          value: QbdDirectReimbursableExportDateType.SPENT_AT
      }]);
  }

  static getMandatoryField(form: FormGroup, controllerName: string): boolean {
      switch (controllerName) {
        case 'defaultCCCAccountsPayableAccountName':
          return form.controls.creditCardExportType.value === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
        case 'defaultReimbursableAccountsPayableAccountName':
          return form.controls.reimbursableExportType.value === QBDReimbursableExpensesObject.JOURNAL_ENTRY;
        case 'nameInJE':
          return form.controls.creditCardExportType.value === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
        case 'defaultCreditCardAccountName':
          return form.controls.creditCardExportType.value === QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE;
        case 'employeeMapping':
          return !form.get('reimbursableExportType')?.value && form.get('creditCardExportType')?.value && form.get('creditCardExportType')?.value === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY;
        default:
          return false;
      }
    }

  static getValidators(): [ExportSettingValidatorRule, ExportModuleRule[]] {

      const exportSettingValidatorRule: ExportSettingValidatorRule = {
        reimbursableExpense: ['reimbursableExportType', 'reimbursableExportGroup', 'reimbursableExportDate', 'reimbursableExpenseState'],
        creditCardExpense: ['creditCardExportType', 'creditCardExportGroup', 'creditCardExportDate', 'creditCardExpenseState']
      };

      const exportModuleRule: ExportModuleRule[] = [
          {
              formController: 'reimbursableExportType',
              requiredValue: {
                [QbdDirectReimbursableExpensesObject.BILL]: ['employeeMapping'],
                [QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY]: ['defaultReimbursableAccountsPayableAccountName', 'employeeMapping']
              }
            },
            {
              formController: 'creditCardExportType',
              requiredValue: {
                [QBDCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE]: ['defaultCreditCardAccountName'],
                [QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY]: ['defaultCCCAccountsPayableAccountName', 'nameInJE', 'employeeMapping']
              }
            }
      ];

      return [exportSettingValidatorRule, exportModuleRule];
  }

  static mapAPIResponseToFormGroup(exportSettings: QbdDirectExportSettingGet | null, destinationAccounts: QbdDirectDestinationAttribute[]): FormGroup {
      const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
      return new FormGroup({
          reimbursableExportType: new FormControl(exportSettings?.reimbursable_expense_export_type),
          reimbursableExpense: new FormControl(exportSettings?.reimbursable_expense_export_type ? true : false),
          reimbursableExportGroup: new FormControl(exportSettings?.reimbursable_expense_grouped_by ? exportSettings?.reimbursable_expense_grouped_by : null),
          reimbursableExportDate: new FormControl(exportSettings?.reimbursable_expense_date ? exportSettings?.reimbursable_expense_date : null),
          creditCardExpense: new FormControl(exportSettings?.credit_card_expense_export_type ? true : false),
          creditCardExportType: new FormControl(exportSettings?.credit_card_expense_export_type ? exportSettings?.credit_card_expense_export_type : null),
          creditCardExportGroup: new FormControl(exportSettings?.credit_card_expense_grouped_by ? exportSettings?.credit_card_expense_grouped_by : this.expenseGroupingFieldOptions()[1].value),
          creditCardExportDate: new FormControl(exportSettings?.credit_card_expense_date ? exportSettings?.credit_card_expense_date : this.expenseGroupingFieldOptions()[0].value),
          reimbursableExpenseState: new FormControl(exportSettings?.reimbursable_expense_state ? exportSettings?.reimbursable_expense_state : null),
          creditCardExpenseState: new FormControl(exportSettings?.credit_card_expense_state ? exportSettings?.credit_card_expense_state : null),
          employeeMapping: new FormControl(exportSettings?.employee_field_mapping ? exportSettings?.employee_field_mapping : EmployeeFieldMapping.VENDOR),
          nameInJE: new FormControl(exportSettings?.name_in_journal_entry ? exportSettings?.name_in_journal_entry : null),
          defaultCreditCardAccountName: new FormControl(exportSettings?.default_credit_card_account_id ? findObjectByDestinationId( destinationAccounts, exportSettings.default_credit_card_account_id) : null),
          defaultReimbursableAccountsPayableAccountName: new FormControl(exportSettings?.default_reimbursable_accounts_payable_account_id ? findObjectByDestinationId( destinationAccounts, exportSettings.default_reimbursable_accounts_payable_account_id) : null),
          defaultCCCAccountsPayableAccountName: new FormControl(exportSettings?.default_ccc_accounts_payable_account_id ? findObjectByDestinationId( destinationAccounts, exportSettings.default_ccc_accounts_payable_account_id) : null),
          searchOption: new FormControl([])
      });
  }

  static constructPayload(exportSettingsForm: FormGroup): QbdDirectExportSettingsPost {
    const exportSettingPayload: QbdDirectExportSettingsPost = {
        reimbursable_expense_export_type: exportSettingsForm.get('reimbursableExportType')?.value ? exportSettingsForm.get('reimbursableExportType')?.value : null,
        reimbursable_expense_state: exportSettingsForm.get('reimbursableExpenseState')?.value ? exportSettingsForm.get('reimbursableExpenseState')?.value : null,
        reimbursable_expense_date: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
        reimbursable_expense_grouped_by: exportSettingsForm.get('reimbursableExpense')?.value && exportSettingsForm.get('reimbursableExportGroup')?.value ? exportSettingsForm.get('reimbursableExportGroup')?.value : null,
        credit_card_expense_export_type: exportSettingsForm.get('creditCardExportType')?.value ? exportSettingsForm.get('creditCardExportType')?.value : null,
        credit_card_expense_state: exportSettingsForm.get('creditCardExpenseState')?.value ? exportSettingsForm.get('creditCardExpenseState')?.value : null,
        credit_card_expense_grouped_by: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportGroup')?.value ? exportSettingsForm.get('creditCardExportGroup')?.value : null,
        credit_card_expense_date: exportSettingsForm.get('creditCardExpense')?.value && exportSettingsForm.get('creditCardExportDate')?.value ? exportSettingsForm.get('creditCardExportDate')?.value : null,
        employee_field_mapping: exportSettingsForm.get('employeeMapping')?.value ? exportSettingsForm.get('employeeMapping')?.value : null,
        name_in_journal_entry: exportSettingsForm.get('nameInJE')?.value ? exportSettingsForm.get('nameInJE')?.value : null,
        default_credit_card_account_name: exportSettingsForm.get('defaultCreditCardAccountName')?.value ? exportSettingsForm.get('defaultCreditCardAccountName')?.value.value : null,
        default_credit_card_account_id: exportSettingsForm.get('defaultCreditCardAccountName')?.value ? exportSettingsForm.get('defaultCreditCardAccountName')?.value.destination_id : null,
        default_reimbursable_accounts_payable_account_name: exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value.value : null,
        default_reimbursable_accounts_payable_account_id: exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultReimbursableAccountsPayableAccountName')?.value.destination_id : null,
        default_ccc_accounts_payable_account_name: exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value.value : null,
        default_ccc_accounts_payable_account_id: exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value ? exportSettingsForm.get('defaultCCCAccountsPayableAccountName')?.value.destination_id : null
    };

    return exportSettingPayload;
  }

  getQbdExportSettings(): Observable<QbdDirectExportSettingGet>{
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, {});
  }

  postQbdExportSettings(exportSettingsPayload: QbdDirectExportSettingsPost): Observable<QbdDirectExportSettingGet> {
    return this.apiService.post(`/workspaces/${this.workspaceService.getWorkspaceId()}/export_settings/`, exportSettingsPayload);
  }

  setupDynamicValidators(form: FormGroup, values: ExportModuleRule, selectedValue: string): void {
    Object.entries(values.requiredValue).forEach(([key, value]) => {
      if (key === selectedValue) {
        value.forEach((formController: string) => {
          if (values.formController === 'creditCardExportType') {
            this.creditCardExportTypeChange.emit(selectedValue);
          }

          const isFieldMandatory = QbdDirectExportSettingsService.getMandatoryField(form, formController);
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


  setExportTypeValidatorsAndWatchers(exportTypeValidatorRule: ExportModuleRule[], form: FormGroup): void {
    Object.values(exportTypeValidatorRule).forEach((values) => {
      form.controls[values.formController].valueChanges.subscribe((selectedValue) => {
        this.mandatoryFormController = [];
        this.setupDynamicValidators(form, values, selectedValue);
      });
    });
  }
}
