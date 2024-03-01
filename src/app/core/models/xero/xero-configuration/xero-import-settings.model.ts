import { FormGroup } from "@angular/forms";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { MappingDestinationField, MappingSourceField } from "../../enum/enum.model";
import { GeneralMapping } from "../../intacct/db/mappings.model";
import { ImportSettingGeneralMapping } from "../../intacct/intacct-configuration/import-settings.model";
import { XeroWorkspaceGeneralSetting } from "../db/xero-workspace-general-setting.model";


export type XeroImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean,
  import_customers: boolean,
  import_suppliers_as_merchants: boolean
}

export type XeroImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type XeroImportSettingMappingSetting = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  is_custom: boolean,
  source_placeholder: string | null
}

export type XeroImportSettingPost = {
  workspace_general_settings: XeroImportSettingWorkspaceGeneralSetting,
  general_mappings: ImportSettingGeneralMapping,
  mapping_settings: XeroImportSettingMappingSetting[]
}

export type ExpenseFieldsFormOption = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  disable_import_to_fyle: boolean,
  source_placeholder: string | null
}

export type XeroImportSettingGet = {
  workspace_general_settings: XeroWorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  mapping_settings: MappingSetting[],
  workspace_id:number
}

export interface XeroImportSettingFormOption extends SelectFormOption {
  value: string;
}


export class XeroImportSettingModel {
  static constructPayload(importSettingsForm: FormGroup, customMappingSettings: MappingSetting[]): XeroImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const chartOfAccounts = XeroImportSettingModel.formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value);
    const importSettingPayload: XeroImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('chartOfAccount')?.value,
        charts_of_accounts: importSettingsForm.get('chartOfAccount')?.value ? chartOfAccounts : ['Expense'],
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_suppliers_as_merchants: importSettingsForm.get('importSuppliersAsMerchants')?.value,
        import_customers: importSettingsForm.get('importCustomers')?.value ? importSettingsForm.get('importCustomers')?.value : false
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? importSettingsForm.get('defaultTaxCode')?.value : emptyDestinationAttribute
      },
      mapping_settings: XeroImportSettingModel.formatMappingSettings(importSettingsForm.get('expenseFields')?.value, customMappingSettings)
    };
    return importSettingPayload;
  }

  static formatChartOfAccounts(chartOfAccounts: {enabled: boolean, name: string}[]): string[] {
    return chartOfAccounts.filter(chartOfAccount => chartOfAccount.enabled).map(chartOfAccount => chartOfAccount.name.toUpperCase());
  }

  static formatMappingSettings(expenseFields: ExpenseFieldsFormOption[], existingMappingSettings: MappingSetting[]): XeroImportSettingMappingSetting[] {
    const mappingSettings: XeroImportSettingMappingSetting[] = [];
    expenseFields.forEach((expenseField: ExpenseFieldsFormOption) => {
      if (expenseField.source_field) {
        mappingSettings.push({
          source_field: expenseField.source_field,
          destination_field: expenseField.destination_field,
          import_to_fyle: expenseField.import_to_fyle,
          is_custom: expenseField.source_field === MappingSourceField.COST_CENTER || expenseField.source_field === MappingSourceField.PROJECT ? false : true,
          source_placeholder: expenseField.source_placeholder ? expenseField.source_placeholder : null
        });
      }
    });

    // Add custom mapping payload to preserve them
    existingMappingSettings.forEach((existingMappingSetting: MappingSetting) => {
      if (!mappingSettings.find(mappingSetting => mappingSetting.source_field === existingMappingSetting.source_field && !existingMappingSetting.import_to_fyle)) {
        mappingSettings.push({
          source_field: existingMappingSetting.source_field,
          destination_field: existingMappingSetting.destination_field,
          import_to_fyle: existingMappingSetting.import_to_fyle,
          is_custom: existingMappingSetting.is_custom,
          source_placeholder: existingMappingSetting.source_placeholder
        });
      }
    });

    return mappingSettings;
  }
}
