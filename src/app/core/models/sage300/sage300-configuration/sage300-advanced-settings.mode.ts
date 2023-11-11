import { FormControl, FormGroup } from "@angular/forms";
import { ConditionField, EmailOption, ExpenseFilter, ExpenseFilterGetResponse, ExpenseFilterPayload, JoinOption, Operator } from "../../common/advanced-settings.model";

export type AdvancedSettingValidatorRule = {
    condition1: string[];
    condition2: string[];
    operator1: string[];
    operator2: string[];
  };

export type Sage300AdvancedSetting = {
    auto_create_merchant_destination_entity: boolean,
    sync_sage_300_to_fyle_payments: boolean,
    auto_create_destination_entity: boolean,
    memo_structure: string[],
    default_job_name: string,
    default_job_id: number
    schedule_enabled: boolean,
    emails_selected: EmailOption[],
    emails_added: EmailOption[],
    auto_map_vendor: boolean,
    skipExport: boolean
}

export interface Sage300AdvancedSettingGet extends Sage300AdvancedSetting {
    id: number,
    created_at: Date,
    update_at: Date,
    workspace: number
}

export interface Sage300AdvancedSettingPost extends Sage300AdvancedSetting {}

export class Sage300AdvancedSettingModel {

    static getSelectedOperator(operator: string, value: any) {
        switch (operator) {
            case 'isnull':
                return value === 'True' ? 'is_empty' : 'is_not_empty';
            case 'in':
                return 'iexact';
            case 'iexact':
                return operator;
            default:
                return operator;
        }
    }

    static getFieldValue(value: any, condition: ConditionField, rank: number) {
        if (condition.type === 'DATE') {
          return new Date(value[0]);
        } else if (condition.field_name === 'report_title') {
          return value[0];
        }
        if (rank === 1) {
            return value;
        } else if (rank === 2) {
            return value;
        }
        return '';

      }

    static setupSkipExportForm(response: ExpenseFilterGetResponse, conditionArray: ConditionField[]) {
        let [selectedOperator1, valueFC1, customFieldTypeFC1] = ['', '', ''];
        let [selectedOperator2, valueFC2] = ['', ''];
        let joinByFC = '';
        let isDisabledChip2: boolean = false;
        let isDisabledChip1: boolean = false;

        response.results.forEach((result: ExpenseFilter, index: number) => {
            if (index === 0) {
                selectedOperator1 = this.getSelectedOperator(result.operator, result.values[0]);
                if (!(selectedOperator1 === 'is_empty' || selectedOperator1 === 'is_not_empty')) {
                    valueFC1 = this.getFieldValue(result.values, conditionArray[0], result.rank);
                } else {
                    isDisabledChip1 = true;
                }
                customFieldTypeFC1 = result?.custom_field_type ? result.custom_field_type : '';
            } else if (index === 1 && response.results[0].join_by !== null) {
                selectedOperator2 = this.getSelectedOperator(result.operator, result.values[0]);
                joinByFC = response.results[0].join_by;
                if (!(selectedOperator2 === 'is_empty' || selectedOperator2 === 'is_not_empty')) {
                    valueFC2 = this.getFieldValue(result.values, conditionArray[1], result.rank);
                } else {
                    isDisabledChip2 = true;
                }
            }
        });

        return new FormGroup({
          condition1: new FormControl(conditionArray.length > 0 ? conditionArray[0] : ''),
          operator1: new FormControl(selectedOperator1),
          value1: new FormControl(valueFC1),
          customFieldType1: new FormControl(customFieldTypeFC1),
          join_by: new FormControl(joinByFC),
          condition2: new FormControl(joinByFC ? conditionArray[1] : ''),
          operator2: new FormControl(joinByFC && selectedOperator2 ? selectedOperator2 : ''),
          value2: new FormControl(valueFC2),
          customFieldType2: new FormControl(joinByFC ? response.results[1].custom_field_type : ''),
          isDisabledChip1: new FormControl(isDisabledChip1),
          isDisabledChip2: new FormControl(isDisabledChip2)
        });
    }


    static constructSkipExportPayload(valueField: ExpenseFilterPayload, valueOption1: any[]): ExpenseFilter {
        const op:string = (valueField.operator) as string;
        return {
          condition: valueField.condition.field_name,
          operator: valueField.operator,
          values:
            valueField.condition.type === 'DATE' ||
            valueField.operator === 'isnull' || valueField.condition.field_name === 'report_title' ? valueField.value : valueOption1,
          rank: valueField.rank,
          join_by: valueField?.join_by ? JoinOption[valueField.join_by as JoinOption] : null,
          is_custom: valueField.condition.is_custom,
          custom_field_type: valueField.condition?.is_custom ? valueField.condition.type : null
        };
      }

    static mapAPIResponseToFormGroup(advancedSettings: Sage300AdvancedSettingGet | null): FormGroup {
        return new FormGroup({
            autoCreateMerchantDestinationEntity: new FormControl(advancedSettings?.auto_create_merchant_destination_entity ? true : false),
            syncSage300ToFylePayments: new FormControl(advancedSettings?.sync_sage_300_to_fyle_payments ? true : false),
            autoCreateDestinationEntity: new FormControl(advancedSettings?.auto_create_destination_entity ? true : false),
            skipExport: new FormControl(false),
            memoStructure: new FormControl(advancedSettings?.memo_structure ? advancedSettings?.memo_structure : null ),
            defaultJobName: new FormControl(advancedSettings?.default_job_name ? advancedSettings?.default_job_name : null ),
            defaultJobId: new FormControl(advancedSettings?.default_job_id ? advancedSettings?.default_job_id : null ),
            scheduleEnabled: new FormControl(advancedSettings?.schedule_enabled ? true : false),
            email: new FormControl(advancedSettings?.emails_selected ? advancedSettings?.emails_selected : []),
            emailsAdded: new FormControl(advancedSettings?.emails_added ? advancedSettings?.emails_added : null),
            autoMapVendor: new FormControl(advancedSettings?.auto_map_vendor ? true : false),
            scheduleAutoExportFrequency: new FormControl(1),
            topLevelMemo: new FormControl(null)
        });
    }

    static createAdvancedSettingPayload(advancedSettingsForm: FormGroup): Sage300AdvancedSettingPost {
        return {
            skipExport: advancedSettingsForm.get('skipExport')?.value ? advancedSettingsForm.get('skipExport')?.value : false,
            auto_create_merchant_destination_entity: advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value ? advancedSettingsForm.get('auto_create_merchant_destination_entity')?.value : false,
            sync_sage_300_to_fyle_payments: advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value ? advancedSettingsForm.get('sync_sage_300_to_fyle_payments')?.value : false,
            auto_create_destination_entity: advancedSettingsForm.get('auto_create_destination_entity')?.value ? advancedSettingsForm.get('auto_create_destination_entity')?.value : false,
            memo_structure: advancedSettingsForm.get('memo_structure')?.value ? advancedSettingsForm.get('memo_structure')?.value : null,
            default_job_name: advancedSettingsForm.get('default_job_name')?.value ? advancedSettingsForm.get('default_job_name')?.value : null,
            default_job_id: advancedSettingsForm.get('default_job_id')?.value ? advancedSettingsForm.get('default_job_id')?.value : null,
            schedule_enabled: advancedSettingsForm.get('schedule_enabled')?.value ? advancedSettingsForm.get('schedule_enabled')?.value : false,
            emails_selected: advancedSettingsForm.get('emails_selected')?.value ? advancedSettingsForm.get('emails_selected')?.value : null,
            emails_added: advancedSettingsForm.get('emails_added')?.value ? advancedSettingsForm.get('emails_added')?.value : false,
            auto_map_vendor: advancedSettingsForm.get('auto_map_vendor')?.value ? advancedSettingsForm.get('auto_map_vendor')?.value : false
        };
    }
}


