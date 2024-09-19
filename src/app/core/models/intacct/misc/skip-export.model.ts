import type { ConditionField, JoinOption, Operator } from "../intacct-configuration/advanced-settings.model";


export interface SkipExport {
  id?: number;
  condition: string;
  custom_field_type: any;
  operator: Operator.IsNull | Operator.IExact | Operator.IContains | Operator.LessThan | Operator.LessThanOrEqual;
  values: string[];
  rank: number;
  join_by: JoinOption.AND | JoinOption.OR | null;
  is_custom: boolean;
}

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
      valueField.operator1 === 'isnull' || valueField.condition1.field_name === 'report_title' || valueField.condition1.type === 'BOOLEAN'
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
      valueField.operator2 === 'isnull' || valueField.condition2.field_name === 'report_title' || valueField.condition2.type === 'BOOLEAN'
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