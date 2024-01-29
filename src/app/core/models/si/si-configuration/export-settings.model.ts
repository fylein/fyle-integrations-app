import { AbstractControl, FormGroup } from "@angular/forms";
import { CorporateCreditCardExpensesObject, FyleField, ExpenseState, ExportDateType, IntacctReimbursableExpensesObject, CCCExpenseState, ExpenseGroupingFieldOption, IntacctExportSettingDestinationOptionKey } from "../../enum/enum.model";
import { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { IntacctDestinationAttribute } from "../db/destination-attribute.model";

export type ExportSettingFormOption = {
    label: string,
    value: ExpenseState | IntacctReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExportDateType | string | FyleField | null;
}

export type ExportSettingConfiguration = {
    employee_field_mapping: string,
    auto_map_employees: string,
    reimbursable_expenses_object: IntacctReimbursableExpensesObject | null,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject | null,
    use_merchant_in_journal_line: boolean
  }

export type ExportSettingGeneralMapping = {
    default_gl_account: DefaultDestinationAttribute,
    default_credit_card: DefaultDestinationAttribute,
    default_charge_card: DefaultDestinationAttribute,
    default_ccc_expense_payment_type: DefaultDestinationAttribute,
    default_reimbursable_expense_payment_type: DefaultDestinationAttribute,
    default_ccc_vendor: DefaultDestinationAttribute
}

export type ExpenseGroupSettingPost = {
    expense_state: ExpenseState;
    ccc_expense_state: CCCExpenseState;
    reimbursable_expense_group_fields: string[] | null;
    reimbursable_export_date_type: ExportDateType | null;
    corporate_credit_card_expense_group_fields: string[] | null;
    ccc_export_date_type: ExportDateType | null;
  };

export type ExportSettingGet = {
    configurations: ExportSettingConfiguration,
    expense_group_settings: ExpenseGroupSettingPost,
    general_mappings: ExportSettingGeneralMapping,
    workspace_id: number
}

export type ExportSettingPost = {
    configurations: ExportSettingConfiguration,
    expense_group_settings: ExpenseGroupSettingPost,
    general_mappings: ExportSettingGeneralMapping
  }

export type ExportSettingOptionSearch = {
    searchTerm: string,
    destinationAttributes: any[],
    destinationOptionKey: IntacctExportSettingDestinationOptionKey
}

  export class ExportSettingModel {
    static constructPayload(exportSettingsForm: FormGroup): ExportSettingPost {
        const getValueOrDefault = (control: AbstractControl | null, defaultValue: any = null) => {
            return control?.value ? control.value : defaultValue;
        };
        const emptyDestinationAttribute = { id: null, name: null };

        const cccExportType = getValueOrDefault(exportSettingsForm.get('cccExportType'));
        let cccExportGroup = exportSettingsForm.get('cccExportGroup')?.value ? [exportSettingsForm.value.cccExportGroup] : null;

        if (cccExportType === CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION) {
            cccExportGroup = [ExpenseGroupingFieldOption.EXPENSE_ID];
        }

        const exportSettingPayload: ExportSettingPost = {
            expense_group_settings: {
                expense_state: getValueOrDefault(exportSettingsForm.get('reimbursableExpenseState')),
                ccc_expense_state: getValueOrDefault(exportSettingsForm.get('cccExpenseState')),
                reimbursable_expense_group_fields: exportSettingsForm.get('reimbursableExportGroup')?.value ? [exportSettingsForm.value.reimbursableExportGroup] : null,
                reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value ? exportSettingsForm.get('reimbursableExportDate')?.value : null,
                corporate_credit_card_expense_group_fields: cccExportGroup,
                ccc_export_date_type: getValueOrDefault(exportSettingsForm.get('cccExportDate')) === 'Spend Date' ? 'spent_at' : getValueOrDefault(exportSettingsForm.get('cccExportDate'))
            },
            configurations: {
                reimbursable_expenses_object: getValueOrDefault(exportSettingsForm.get('reimbursableExportType')),
                corporate_credit_card_expenses_object: cccExportType,
                employee_field_mapping: exportSettingsForm.get('employeeFieldMapping')?.value ? exportSettingsForm.get('employeeFieldMapping')?.value.toUpperCase() : null,
                auto_map_employees: getValueOrDefault(exportSettingsForm.get('autoMapEmployees')),
                use_merchant_in_journal_line: exportSettingsForm.get('useMerchantInJournalEntry')?.value
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
}
