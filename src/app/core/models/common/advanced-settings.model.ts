import { FormControl, FormGroup } from "@angular/forms";
import { AppName, ExpenseGroupingFieldOption, JoinOption, Operator } from "../enum/enum.model";
import { environment } from "src/environments/environment";
import { ExportSettingGet } from "../intacct/intacct-configuration/export-settings.model";
import { QBOExportSettingGet } from "../qbo/qbo-configuration/qbo-export-setting.model";
import { NetSuiteExportSettingGet } from "../netsuite/netsuite-configuration/netsuite-export-setting.model";
import { IntacctConfiguration } from "../db/configuration.model";
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { SelectFormOption } from "./select-form-option.model";

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

export class AdvancedSettingsModel {
  static getDefaultMemoOptions(): string[] {
    return ['employee_email', 'employee_name', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link', 'card_number'];
  }

  static getDefaultTopMemoOptions(): string[] {
    return ['employee_email', 'employee_name', 'report_number'];
  }

  static getHoursOptions(): SelectFormOption[] {
    return [
      ...(brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary ? [{ label: 'Real-time', value: 0 }] : []),
      ...[...Array(24).keys()].map(hour => ({
        label: `${hour + 1} hour${hour + 1 > 1 ? 's' : ''}`,
        value: hour + 1
      }))
    ];
  }

  static getMemoOptions(exportSettings: IntacctConfiguration | ExportSettingGet | NetSuiteExportSettingGet | QBOExportSettingGet, appName: string): string[] {
    const defaultOptions = this.getDefaultMemoOptions();
    let cccExportType: string | undefined;
    // Handle both configurations and configuration properties
    if (appName === AppName.INTACCT) {
      cccExportType = (exportSettings as IntacctConfiguration).corporate_credit_card_expenses_object ?? undefined;
    } else if ('configurations' in exportSettings) {
      cccExportType = exportSettings.configurations?.corporate_credit_card_expenses_object ?? undefined;
    } else if ('workspace_general_settings' in exportSettings) {
      cccExportType = exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ?? undefined;
    }

    if (brandingFeatureConfig.featureFlags.advancedSettings.excludeCardNumberAndEmployeeNameInMemo) {
      return defaultOptions.filter(option => option !== 'card_number' && option !== 'employee_name');
    }
    if (cccExportType && ['netsuite', 'quickbooks online', 'sage intacct'].includes(appName.toLowerCase()) && !brandingFeatureConfig.featureFlags.advancedSettings.excludeCardNumberAndEmployeeNameInMemo) {
      return defaultOptions;
    }
    return defaultOptions.filter(option => option !== 'card_number');

  }

  /**
   * Returns the top level memo options based on whether expenses are grouped by report
   * @returns string[]
   */
  static getTopLevelMemoOptions(reimbursableGroupedBy?: ExpenseGroupingFieldOption, cccGroupedBy?: ExpenseGroupingFieldOption): string[] {
    let options = this.getDefaultTopMemoOptions();
    // Exclude employee name from the top level memo options if the feature flag is enabled
    if (brandingFeatureConfig.featureFlags.advancedSettings.excludeCardNumberAndEmployeeNameInMemo) {
      options = options.filter(option => option !== 'employee_name');
    }

    let finalOption;
    if (reimbursableGroupedBy === cccGroupedBy) {
      // If reimbursable and ccc are grouped by the same field, then the top level memo option is the field name
      // ('Expense number' or 'Report number')
      if (reimbursableGroupedBy === ExpenseGroupingFieldOption.EXPENSE_ID) {
        finalOption = 'expense_number';
      } else {
        finalOption = 'report_number';
      }
    } else if (reimbursableGroupedBy === undefined) {
      // If reimbursable is not grouped, then the top level memo option is the ccc field name
      finalOption = cccGroupedBy === ExpenseGroupingFieldOption.EXPENSE_ID ? 'expense_number' : 'report_number';
    } else if (cccGroupedBy === undefined) {
      // If ccc is not grouped, then the top level memo option is the reimbursable field name
      finalOption = reimbursableGroupedBy === ExpenseGroupingFieldOption.EXPENSE_ID ? 'expense_number' : 'report_number';
    } else {
      // If reimbursable and ccc are grouped by different fields, then default the top level memo option to report number
      finalOption = 'report_number';
    }

    options[options.length - 1] = finalOption;
    return options;
  }

  static formatMemoPreview(memoStructure: string[], defaultMemoOptions: string[]): [string, string[]] {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: 'john.doe@acme.com',
      employee_name: 'John Doe',
      card_number: '**** 3456',
      category: 'Meals and Entertainment',
      purpose: 'Client Meeting',
      merchant: 'Pizza Hut',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      expense_key: 'E/2024/02/T/11',
      expense_number: 'E/2024/02/T/11',
      expense_link: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/`
    };
    let memoPreviewText = '';
    const memo: string[] = [];
    const originMemo: string[] = [];
    memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = defaultMemoOptions.indexOf(memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
        originMemo[defaultIndex] = field;
      }
    });
    memoStructure = originMemo.filter(item => item.trim() !== '');
    memo.forEach((field, index) => {
      memoPreviewText += field;
      if (index + 1 !== memo.length) {
        memoPreviewText = memoPreviewText + ' - ';
      }
    });
    return [memoPreviewText, memoStructure];
  }

  static filterAdminEmails = (emailToSearch: string[], adminEmails: EmailOption[]) => {
    const adminEmailsList: EmailOption[] = [];
    for (const email of emailToSearch) {
      adminEmails.find(item => (item.email === email ? adminEmailsList.push(item) : null));
    }
    return adminEmailsList;
};

  static formatSelectedEmails(emails: EmailOption[]): string[] {
    return emails.map((option: EmailOption) => option.email);
  }

  static getExportFrequency(isRealTimeExportEnabled: boolean | undefined, isOnboarding: boolean, autoImportExportEnabled: boolean | undefined, intervalHours: number | undefined): number | undefined {
    let frequency;

    // Set frequency to 0 if real time export is enabled or onboarding is true
    if (isRealTimeExportEnabled || (isOnboarding && brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary)) {
      frequency = 0;
    } else if (autoImportExportEnabled) {
      frequency = intervalHours;
    } else {
      frequency = brandingFeatureConfig.featureFlags.dashboard.useRepurposedExportSummary ? 0 : 1;
    }

    return frequency;
  }
}

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
