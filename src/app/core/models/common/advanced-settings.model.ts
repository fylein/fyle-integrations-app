import { FormControl, FormGroup } from "@angular/forms";
import { JoinOption, Operator } from "../enum/enum.model";

export type EmailOption = {
    email: string;
    name: string;
};

export  interface HourOption {
  label: string;
  value: number;
}

export type skipExportValidator = {
  isChanged: string[];
  isNotChanged: string[];
}

export type ConditionField = {
  field_name: string;
  type: string;
  is_custom: boolean;
};

export type ExpenseFilterPost = {
    condition: string;
    operator: Operator;
    values: string | string[]
    rank: number;
    join_by:JoinOption | null;
    is_custom: boolean;
    custom_field_type: string | null;
};

export type ExpenseFilterPayload = {
    condition: ConditionField,
    operator: Operator,
    value: string[]
    join_by: string,
    rank: number
  }

export interface ExpenseFilter extends ExpenseFilterPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace: number
}

export type ExpenseFilterResponse = {
    count: number,
    next: string | null,
    previous: string | null,
    results: ExpenseFilter[]
};

export type SkipExportValidatorRule = {
  condition1: string[];
  condition2: string[];
  operator1: string[];
  operator2: string[];
};

export type AdvancedSettingValidatorRule = {
  paymentSync: string;
  exportSchedule: string;
};

export class SkipExportModel {

  static constructSkipExportValue(valueField: any) {
    if (valueField.condition1.field_name !== 'report_title' && valueField.operator1 === 'iexact') {
      valueField.operator1 = 'in';
    }
    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'is_empty') {
        valueField.value1 = ['True'];
        valueField.operator1 = 'isnull';
      } else if (valueField.operator1 === 'is_not_empty') {
        valueField.value1 = ['False'];
        valueField.operator1 = 'isnull';
      }
    }
    if (valueField.condition1.field_name === 'spent_at') {
      valueField.value1 = new Date(valueField.value1).toISOString().split('T')[0] + 'T17:00:00.000Z';
    }
    if (typeof valueField.value1 === 'string') {
      valueField.value1 = [valueField.value1];
    }

    if (valueField.condition2 && valueField.operator2) {
      if (valueField.condition2.field_name !== 'report_title' && valueField.operator2 === 'iexact') {
        valueField.operator2 = 'in';
      }
      if (valueField.condition2.field_name === 'spent_at') {
        valueField.value2 = new Date(valueField.value2).toISOString().split('T')[0] + 'T17:00:00.000Z';
      }
      if (valueField.condition2.is_custom === true) {
        if (valueField.operator2 === 'is_empty') {
          valueField.value2 = ['True'];
          valueField.operator2 = 'isnull';
        } else if (valueField.operator2 === 'is_not_empty') {
          valueField.value2 = ['False'];
          valueField.operator2 = 'isnull';
        }
      }
      if (typeof valueField.value2 === 'string') {
        valueField.value2 = [valueField.value2];
      }
    }
    return valueField;
  }

  static constructExportFilterPayload(valueField: any): ExpenseFilterPayload {
    return {
      condition: valueField['condition'+valueField.rank] as ConditionField,
      operator: valueField['operator'+valueField.rank] as Operator,
      value: valueField['value'+valueField.rank],
      join_by: valueField?.join_by && valueField.rank === 1 ? valueField?.join_by : null,
      rank: valueField.rank
    };
  }

  static constructSkipExportPayload(valueField: ExpenseFilterPayload, valueOption: any[]): ExpenseFilterPost {
    return {
      condition: valueField.condition.field_name,
      operator: valueField.operator,
      values:
        valueField.condition.type === 'DATE' ||
          valueField.operator === 'isnull' || valueField.condition.field_name === 'report_title' || valueField.condition.type === 'BOOLEAN' ? valueField.value : valueOption,
      rank: valueField.rank,
      join_by: valueField?.join_by ? JoinOption[valueField.join_by as JoinOption] : null,
      is_custom: valueField.condition.is_custom,
      custom_field_type: valueField.condition?.is_custom ? valueField.condition.type : null
    };
  }

  static setConditionFields(response: ExpenseFilterResponse, conditionArray: ConditionField[], conditionFieldOptions: ConditionField[]) {
    response.results.forEach((element) => {
      const type = conditionFieldOptions?.filter( (fieldOption) => fieldOption.field_name.toLowerCase() === element.condition.toLowerCase());
      const selectedConditionOption : ConditionField = type[0];
      conditionArray.push(selectedConditionOption);
    });
  }

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
    if (condition?.type === 'DATE') {
      return new Date(value[0]);
    } else if (condition?.field_name === 'report_title' || condition.type === 'BOOLEAN') {
      return value[0];
    }
    if (rank === 1) {
        return value;
    } else if (rank === 2) {
        return value;
    }
    return '';

  }

  static setupSkipExportForm(response: ExpenseFilterResponse, conditionArray: ConditionField[], conditionFieldOptions: ConditionField[]) {
    this.setConditionFields(response, conditionArray, conditionFieldOptions);
    let [selectedOperator1, valueFC1, customFieldTypeFC1] = ['', '', ''];
    let [selectedOperator2, valueFC2] = ['', ''];
    let joinByFC = '';
    let isDisabledChip2: boolean = false;
    let isDisabledChip1: boolean = false;

    response.results?.forEach((result: ExpenseFilterPost, index: number) => {
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
}
