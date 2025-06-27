import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { IntacctCorporateCreditCardExpensesObject, ExportDateType, IntacctReimbursableExpensesObject, CCCExpenseState, ExpenseGroupingFieldOption, IntacctExportSettingDestinationOptionKey, SplitExpenseGrouping } from "../../../models/enum/enum.model";
import { SelectFormOption } from "../../../models/common/select-form-option.model";
import { ExportSettingPost } from "../../../models/intacct/intacct-configuration/export-settings.model"
import { TranslocoService } from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class ExportSettingsService {
  private translocoService: TranslocoService = inject(TranslocoService);

  static constructPayload(exportSettingsForm: FormGroup): ExportSettingPost {
      const getValueOrDefault = (control: AbstractControl | null, defaultValue: any = null) => {
          return control?.value ? control.value : defaultValue;
      };

      const getExpenseGroupFields = (exportGroupValue: ExpenseGroupingFieldOption) => {
        // "Expense"
        if (exportGroupValue === ExpenseGroupingFieldOption.EXPENSE_ID) {
          return ['expense_id', 'expense_number'];

        // "Report"
        } else if (exportGroupValue === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroupValue === ExpenseGroupingFieldOption.REPORT_ID) {
          return ['report_id', 'claim_number'];
        }
        return null;
      };

      const emptyDestinationAttribute = { id: null, name: null };

      const cccExportType = getValueOrDefault(exportSettingsForm.get('cccExportType'));
      const cccExportGroup = exportSettingsForm.get('cccExportGroup')?.value;
      let corporateCreditCardExpenseGroupFields = getExpenseGroupFields(cccExportGroup);

      if (cccExportType === IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
        corporateCreditCardExpenseGroupFields = [ExpenseGroupingFieldOption.EXPENSE_ID];
      }

      const reimbursableExportGroup = exportSettingsForm.get('reimbursableExportGroup')?.value;
      const reimbursableExpenseGroupFields = getExpenseGroupFields(reimbursableExportGroup);


      const exportSettingPayload: ExportSettingPost = {
          expense_group_settings: {
              expense_state: getValueOrDefault(exportSettingsForm.get('reimbursableExpenseState')),
              ccc_expense_state: getValueOrDefault(exportSettingsForm.get('cccExpenseState')),
              reimbursable_expense_group_fields: reimbursableExpenseGroupFields,
              reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
              corporate_credit_card_expense_group_fields: corporateCreditCardExpenseGroupFields,
              ccc_export_date_type: getValueOrDefault(exportSettingsForm.get('cccExportDate')) === 'Spend date' ? 'spent_at' : getValueOrDefault(exportSettingsForm.get('cccExportDate')),
              split_expense_grouping: exportSettingsForm.get('splitExpenseGrouping')?.value ? exportSettingsForm.get('splitExpenseGrouping')?.value : SplitExpenseGrouping.MULTIPLE_LINE_ITEM
          },
          configurations: {
              reimbursable_expenses_object: getValueOrDefault(exportSettingsForm.get('reimbursableExportType')),
              corporate_credit_card_expenses_object: cccExportType,
              employee_field_mapping: exportSettingsForm.get('employeeFieldMapping')?.value ? exportSettingsForm.get('employeeFieldMapping')?.value.toUpperCase() : 'VENDOR',
              auto_map_employees: getValueOrDefault(exportSettingsForm.get('autoMapEmployees')),
              use_merchant_in_journal_line: exportSettingsForm.get('useMerchantInJournalLine')?.value ? exportSettingsForm.get('useMerchantInJournalLine')?.value : false
          },
          general_mappings: {
              default_gl_account: exportSettingsForm.get('glAccount')?.value?.value ? {id: exportSettingsForm.get('glAccount')?.value.destination_id, name: exportSettingsForm.get('glAccount')?.value.value} : emptyDestinationAttribute,
              default_credit_card: exportSettingsForm.get('creditCard')?.value?.value ? {id: exportSettingsForm.get('creditCard')?.value.destination_id, name: exportSettingsForm.get('creditCard')?.value.value} : emptyDestinationAttribute,
              default_charge_card: exportSettingsForm.get('chargeCard')?.value?.value ? {id: exportSettingsForm.get('chargeCard')?.value.destination_id, name: exportSettingsForm.get('chargeCard')?.value.value} : emptyDestinationAttribute,
              default_ccc_expense_payment_type: exportSettingsForm.get('cccExpensePaymentType')?.value?.value ? {id: exportSettingsForm.get('cccExpensePaymentType')?.value.destination_id, name: exportSettingsForm.get('cccExpensePaymentType')?.value.value} : emptyDestinationAttribute,
              default_reimbursable_expense_payment_type: exportSettingsForm.get('reimbursableExpensePaymentType')?.value?.value ? {id: exportSettingsForm.get('reimbursableExpensePaymentType')?.value.destination_id, name: exportSettingsForm.get('reimbursableExpensePaymentType')?.value.value} : emptyDestinationAttribute,
              default_ccc_vendor: exportSettingsForm.get('creditCardVendor')?.value?.value ? {id: exportSettingsForm.get('creditCardVendor')?.value.destination_id, name: exportSettingsForm.get('creditCardVendor')?.value.value} : emptyDestinationAttribute
          }
      };
      return exportSettingPayload;
  }

  getExpenseGroupingDateOptions(): SelectFormOption[] {
      return [
        {
          label: this.translocoService.translate('common.currentDate'),
          value: ExportDateType.CURRENT_DATE
        },
        {
          label: 'Verification date',
          value: ExportDateType.VERIFIED_DATE
        },
        {
          label: 'Spend date',
          value: ExportDateType.SPENT_AT
        },
        {
          label: 'Approval date',
          value: ExportDateType.APPROVAL_DATE
        },
        {
          label: 'Last spend date',
          value: ExportDateType.LAST_SPENT_AT
        }
      ];
    }
}
