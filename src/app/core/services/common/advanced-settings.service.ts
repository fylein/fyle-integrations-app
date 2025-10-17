import { Injectable } from "@angular/core";
import { SelectFormOption } from "../../models/common/select-form-option.model";
import { brandingFeatureConfig } from "src/app/branding/branding-config";
import { IntacctConfiguration } from "../../models/db/configuration.model";
import { ExportSettingGet } from "../../models/intacct/intacct-configuration/export-settings.model";
import { NetSuiteExportSettingGet } from "../../models/netsuite/netsuite-configuration/netsuite-export-setting.model";
import { QBOExportSettingGet } from "../../models/qbo/qbo-configuration/qbo-export-setting.model";
import { AppName } from "../../models/enum/enum.model";
import { ExpenseGroupingFieldOption } from "../../models/enum/enum.model";
import { environment } from "src/environments/environment";
import { EmailOption } from "../../models/common/advanced-settings.model";

@Injectable({
  providedIn: 'root'
})
export class AdvancedSettingsService {
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
      card_merchant: 'Amazon',
      report_number: 'C/2021/12/R/1',
      spent_on: today.toLocaleDateString(),
      spent_at: today.toLocaleDateString(),
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

  getExportFrequency(isRealTimeExportEnabled: boolean | undefined, isOnboarding: boolean, autoImportExportEnabled: boolean | undefined, intervalHours: number | undefined): number | undefined {
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
