import { FormGroup } from "@angular/forms";
import { PaymentSyncDirection } from "../../enum/enum.model";
import { AdvancedSettingsModel } from "../../common/advanced-settings.model";

  export interface GeneralMappingEntity {
    id: string;
    name: string;
  }

  export  interface HourOption {
    label: string;
    value: number;
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
  AND: 'AND',
  OR: 'OR'
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

export interface Configuration {
    change_accounting_period: boolean;
    sync_fyle_to_sage_intacct_payments: boolean;
    sync_sage_intacct_to_fyle_payments: boolean;
    auto_create_destination_entity: boolean;
    auto_create_merchant_destination_entity: boolean;
    memo_structure: string[];
    auto_create_merchants_as_vendors: boolean;
    je_single_credit_line: boolean;
  }

  export interface AdvancedSettingGeneralMapping {
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
    emails_selected: string[] | [];
    additional_email_options: EmailOption[];
  }

export type AdvancedSettingsGet = {
    configurations: Configuration;
    general_mappings: AdvancedSettingGeneralMapping;
    workspace_schedules: WorkspaceSchedules;
    workspace_id: number;
}

export type AdvancedSettingsPost = {
    configurations: Configuration;
    general_mappings: AdvancedSettingGeneralMapping;
    workspace_schedules: WorkspaceSchedules;
  }

  export class AdvancedSetting extends AdvancedSettingsModel {
    static constructPayload(advancedSettingsForm: FormGroup): AdvancedSettingsPost {
      const getFormValue = (key: string) => advancedSettingsForm.get(key)?.value;

      const mapAttribute = (key: string, idKey: string, valueKey: string) => {
        const value = getFormValue(key);
        return value ? { name: value[valueKey], id: value[idKey] } : { name: null, id: null };
      };

      const advancedSettingPayload: AdvancedSettingsPost = {
        configurations: {
          auto_create_merchant_destination_entity: true,
          sync_fyle_to_sage_intacct_payments: getFormValue('autoSyncPayments') === PaymentSyncDirection.FYLE_TO_INTACCT,
          sync_sage_intacct_to_fyle_payments: getFormValue('autoSyncPayments') === PaymentSyncDirection.INTACCT_TO_FYLE,
          auto_create_destination_entity: getFormValue('autoCreateEmployeeVendor'),
          change_accounting_period: !!getFormValue('postEntriesCurrentPeriod'),
          memo_structure: getFormValue('setDescriptionField'),
          auto_create_merchants_as_vendors: getFormValue('autoCreateMerchants') ? getFormValue('autoCreateMerchants') : false,
          je_single_credit_line: getFormValue('singleCreditLineJE') ? getFormValue('singleCreditLineJE') : false
        },
        general_mappings: {
          payment_account: mapAttribute('defaultPaymentAccount', 'destination_id', 'value'),
          default_location: mapAttribute('defaultLocation', 'destination_id', 'value'),
          default_department: mapAttribute('defaultDepartment', 'destination_id', 'value'),
          default_class: mapAttribute('defaultClass', 'destination_id', 'value'),
          default_project: mapAttribute('defaultProject', 'destination_id', 'value'),
          default_item: mapAttribute('defaultItems', 'destination_id', 'value'),
          use_intacct_employee_departments: !!getFormValue('useEmployeeDepartment'),
          use_intacct_employee_locations: !!getFormValue('useEmployeeLocation')
        },
        workspace_schedules: {
          start_datetime: '',
          enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
          interval_hours: advancedSettingsForm.get('exportSchedule')?.value && advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null,
          emails_selected: advancedSettingsForm.get('email')?.value ? this.formatSelectedEmails(advancedSettingsForm.get('email')?.value) : [],
          additional_email_options: advancedSettingsForm.get('additionalEmails')?.value ? advancedSettingsForm.get('additionalEmails')?.value[0] : null
        }
      };

      return advancedSettingPayload;
    }
  }