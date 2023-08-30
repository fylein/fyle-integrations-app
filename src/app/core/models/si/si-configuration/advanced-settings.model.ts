import { FormGroup } from "@angular/forms";
import { PaymentSyncDirection } from "../../enum/enum.model";

export interface GeneralMappingEntity {
    id: string;
    name: string;
  }

  export type EmailOption = {
    email: string;
    name: string;
  }

  export type AdvancedSettingFormOption = {
    label: string,
    value: string | null | PaymentSyncDirection
}

export type ConditionField = {
  field_name: string;
  type: string;
  is_custom: boolean;
};

export enum Operator {
  IsNull = "isnull",
  IExact = "iexact",
  IContains = "icontains",
  LessThan = "lt",
  LessThanOrEqual = "lte"
}

export const JoinOptions = {
  AND: { value: 'AND' },
  OR: { value: 'OR' }
};

export enum JoinOption {
  AND = "AND",
  OR = "OR"
}

export enum CustomOperatorOption {
  Is = "iexact",
  IsEmpty = "is_empty",
  IsNotEmpty = "is_not_empty"
}

export type SkipExport = {
  id?: number;
  condition: string;
  custom_field_type: any;
  operator: Operator.IsNull | Operator.IExact | Operator.IContains | Operator.LessThan | Operator.LessThanOrEqual;
  values: string[];
  rank: number;
  join_by: JoinOption.AND | JoinOption.OR | null;
  is_custom: boolean;
};

export type ExpenseFilterResponse = {
  count: number;
  results: SkipExport[];
};

export function constructPayload1(valueField: {
  condition1: ConditionField,
  operator1: SkipExport['operator'],
  value1: string[]
  join_by?: SkipExport['join_by']
}, valueOption1: any[]): SkipExport {
  return {
    condition: valueField.condition1.field_name,
    operator: valueField.operator1,
    values:
      valueField.condition1.type === 'DATE' ||
      valueField.operator1 === 'isnull' || valueField.condition1.field_name === 'report_title'
        ? valueField.value1
        : valueOption1,
    rank: 1,
    join_by: valueField.join_by ? valueField.join_by : null,
    is_custom: valueField.condition1.is_custom,
    custom_field_type: valueField.condition1.is_custom
      ? valueField.condition1.type
      : null
  };
}

export function constructPayload2(valueField: {
  condition2: ConditionField,
  operator2: SkipExport['operator'],
  value2: string[]
}, valueOption2: any[]): SkipExport {
  return {
    condition: valueField.condition2.field_name,
    operator: valueField.operator2,
    values:
      valueField.condition2.type === 'DATE' ||
      valueField.operator2 === 'isnull' || valueField.condition2.field_name === 'report_title'
        ? valueField.value2
        : valueOption2,
    rank: 2,
    join_by: null,
    is_custom: valueField.condition2.is_custom,
    custom_field_type: valueField.condition2.is_custom
      ? valueField.condition2.type
      : null
  };
}

export interface WorkspaceGeneralSettings {
    change_accounting_period: boolean;
    sync_fyle_to_sage_intacct_payments: boolean;
    sync_sage_intacct_to_fyle_payments: boolean;
    auto_create_destination_entity: boolean;
    auto_create_merchant_destination_entity: boolean;
    memo_structure: string[];
  }

  export interface GeneralMappings {
    payment_account: GeneralMappingEntity;
    default_location: GeneralMappingEntity;
    default_department: GeneralMappingEntity;
    default_class: GeneralMappingEntity;
    default_project: GeneralMappingEntity;
    default_item: GeneralMappingEntity;
    use_intacct_employee_departments: boolean;
    use_intacct_employee_locations: boolean;
  }

  export interface WorkspaceSchedules {
    enabled: boolean;
    start_datetime: string;
    interval_hours: number;
    emails_selected: string[];
    additional_email_options: EmailOption[];
  }

export type AdvancedSettingsGet = {
    workspace_general_settings: WorkspaceGeneralSettings;
    general_mappings: GeneralMappings;
    workspace_schedules: WorkspaceSchedules;
    workspace_id: number;
}

export type AdvancedSettingsPost = {
    workspace_general_settings: WorkspaceGeneralSettings;
    general_mappings: GeneralMappings;
    workspace_schedules: WorkspaceSchedules;
  }

  export class AdvancedSettingModel {
    static constructPayload(advancedSettingsForm: FormGroup): AdvancedSettingsPost {
      const emptyDestinationAttribute = {id: '', name: ''};
      const advancedSettingPayload: AdvancedSettingsPost = {
        workspace_general_settings: {
          auto_create_merchant_destination_entity: advancedSettingsForm.get('autoCreateMerchantsAsVendors')?.value,
          sync_fyle_to_sage_intacct_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.FYLE_TO_INTACCT ? true : false,
          sync_sage_intacct_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.INTACCT_TO_FYLE ? true : false,
          auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
          change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
          memo_structure: advancedSettingsForm.get('memoStructure')?.value
        },
        general_mappings: {
          payment_account: emptyDestinationAttribute,
          default_location: emptyDestinationAttribute,
          default_department: emptyDestinationAttribute,
          default_class: emptyDestinationAttribute,
          default_project: emptyDestinationAttribute,
          default_item: emptyDestinationAttribute,
          use_intacct_employee_departments: false,
          use_intacct_employee_locations: false
        },
        workspace_schedules: {
          enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
          start_datetime: '',
          interval_hours: advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null,
          emails_selected: advancedSettingsForm.get('emails')?.value ? advancedSettingsForm.get('emails')?.value : null,
          additional_email_options: advancedSettingsForm.get('addedEmail')?.value ? advancedSettingsForm.get('addedEmail')?.value : null
        }
      };
      return advancedSettingPayload;
    }
  }