import type { AbstractControl, FormGroup } from "@angular/forms";
import type { FyleField, ExpenseState, IntacctReimbursableExpensesObject, CCCExpenseState, IntacctExportSettingDestinationOptionKey } from "../../enum/enum.model";
import { IntacctCorporateCreditCardExpensesObject, ExportDateType, ExpenseGroupingFieldOption, SplitExpenseGrouping } from "../../enum/enum.model";
import type { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { DestinationAttribute } from "../../db/destination-attribute.model";
import { IntacctDestinationAttribute } from "../db/destination-attribute.model";
import type { SelectFormOption } from "../../common/select-form-option.model";
import { brandingConfig, brandingContent, brandingFeatureConfig } from "src/app/branding/branding-config";
import type { ExportSettingOptionSearch } from "../../common/export-settings.model";

export interface ExportSettingFormOption {
    label: string,
    value: ExpenseState | IntacctReimbursableExpensesObject | IntacctCorporateCreditCardExpensesObject | ExportDateType | string | FyleField | null;
}

export interface ExportSettingConfiguration {
    employee_field_mapping: string,
    auto_map_employees: string,
    reimbursable_expenses_object: IntacctReimbursableExpensesObject | null,
    corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject | null,
    use_merchant_in_journal_line: boolean
  }

export interface ExportSettingGeneralMapping {
    default_gl_account: DefaultDestinationAttribute,
    default_credit_card: DefaultDestinationAttribute,
    default_charge_card: DefaultDestinationAttribute,
    default_ccc_expense_payment_type: DefaultDestinationAttribute,
    default_reimbursable_expense_payment_type: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
}

export interface ExpenseGroupSettingPost {
    expense_state: ExpenseState;
    ccc_expense_state: CCCExpenseState;
    reimbursable_expense_group_fields: string[] | null;
    reimbursable_export_date_type: ExportDateType | null;
    corporate_credit_card_expense_group_fields: string[] | null;
    ccc_export_date_type: ExportDateType | null;
  }

export interface IntacctExpenseGroupSettingPost extends ExpenseGroupSettingPost {
    split_expense_grouping: SplitExpenseGrouping;
  }

export interface IntacctExpenseGroupSettingGet extends IntacctExpenseGroupSettingPost {}

export interface ExportSettingGet {
    configurations: ExportSettingConfiguration,
    expense_group_settings: IntacctExpenseGroupSettingGet,
    general_mappings: ExportSettingGeneralMapping,
    workspace_id: number
}

export interface ExportSettingPost {
    configurations: ExportSettingConfiguration,
    expense_group_settings: IntacctExpenseGroupSettingPost,
    general_mappings: ExportSettingGeneralMapping
  }

export interface IntacctExportSettingOptionSearch extends ExportSettingOptionSearch {
    destinationOptionKey: IntacctExportSettingDestinationOptionKey
}

  export class ExportSettingModel {
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
                ccc_export_date_type: getValueOrDefault(exportSettingsForm.get('cccExportDate')) === 'Spend Date' ? 'spent_at' : getValueOrDefault(exportSettingsForm.get('cccExportDate')),
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
                default_gl_account: exportSettingsForm.get('glAccount')?.value?.value ? { id: exportSettingsForm.get('glAccount')?.value.destination_id, name: exportSettingsForm.get('glAccount')?.value.value } : emptyDestinationAttribute,
                default_credit_card: exportSettingsForm.get('creditCard')?.value?.value ? { id: exportSettingsForm.get('creditCard')?.value.destination_id, name: exportSettingsForm.get('creditCard')?.value.value } : emptyDestinationAttribute,
                default_charge_card: exportSettingsForm.get('chargeCard')?.value?.value ? { id: exportSettingsForm.get('chargeCard')?.value.destination_id, name: exportSettingsForm.get('chargeCard')?.value.value } : emptyDestinationAttribute,
                default_ccc_expense_payment_type: exportSettingsForm.get('cccExpensePaymentType')?.value?.value ? { id: exportSettingsForm.get('cccExpensePaymentType')?.value.destination_id, name: exportSettingsForm.get('cccExpensePaymentType')?.value.value } : emptyDestinationAttribute,
                default_reimbursable_expense_payment_type: exportSettingsForm.get('reimbursableExpensePaymentType')?.value?.value ? { id: exportSettingsForm.get('reimbursableExpensePaymentType')?.value.destination_id, name: exportSettingsForm.get('reimbursableExpensePaymentType')?.value.value } : emptyDestinationAttribute,
                default_ccc_vendor: exportSettingsForm.get('creditCardVendor')?.value?.value ? { id: exportSettingsForm.get('creditCardVendor')?.value.destination_id, name: exportSettingsForm.get('creditCardVendor')?.value.value } : emptyDestinationAttribute
            }
        };
        return exportSettingPayload;
    }

    static getExpenseGroupingDateOptions(): SelectFormOption[] {
        return [
          {
            label: brandingContent.common.currentDate,
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
            label: 'Last Spend date',
            value: ExportDateType.LAST_SPENT_AT
          }
        ];
      }
}
