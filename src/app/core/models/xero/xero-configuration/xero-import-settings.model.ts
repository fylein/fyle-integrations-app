import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { SelectFormOption } from "../../common/select-form-option.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { MappingDestinationField, MappingSourceField } from "../../enum/enum.model";
import { ImportSettingGeneralMapping } from "../../intacct/intacct-configuration/import-settings.model";
import { XeroWorkspaceGeneralSetting } from "../db/xero-workspace-general-setting.model";
import { ImportSettingsModel } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";


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
  general_mappings: XeroImportSettingGeneralMapping,
  mapping_settings: MappingSetting[],
  workspace_id:number
}

export interface XeroImportSettingFormOption extends SelectFormOption {
  value: string;
}


export class XeroImportSettingModel extends ImportSettingsModel {

  static getChartOfAccountTypesList(): string[] {
    return ['EXPENSE', 'ASSET', 'EQUITY', 'LIABILITY', 'REVENUE'];
  }

  static mapAPIResponseToFormGroup(importSettings: XeroImportSettingGet | null, xeroFields: IntegrationField[]): FormGroup {
    const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, xeroFields) : [];
    return new FormGroup({
      importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts : ['Expense']),
      importCustomers: new FormControl(importSettings?.workspace_general_settings.import_customers ?? false),
      taxCode: new FormControl(importSettings?.workspace_general_settings.import_tax_codes ?? false),
      importSuppliersAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_suppliers_as_merchants ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? importSettings.general_mappings.default_tax_code : null),
      searchOption: new FormControl('')
    });
  }

  static constructPayload(importSettingsForm: FormGroup): XeroImportSettingPost {

    const emptyDestinationAttribute = {id: null, name: null};
    const chartOfAccounts = XeroImportSettingModel.formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value);
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

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
      mapping_settings: mappingSettings
    };
    return importSettingPayload;
  }

  static formatChartOfAccounts(chartOfAccounts: {enabled: boolean, name: string}[]): string[] {
    return chartOfAccounts.filter(chartOfAccount => chartOfAccount.enabled).map(chartOfAccount => chartOfAccount.name.toUpperCase());
  }
}
