import { FormArray, FormControl, FormGroup } from "@angular/forms";
import type { SelectFormOption } from "../../common/select-form-option.model";
import type { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import type { MappingSetting } from "../../db/mapping-setting.model";
import type { MappingDestinationField, MappingSourceField } from "../../enum/enum.model";
import { XeroFyleField } from "../../enum/enum.model";
import type { ImportSettingGeneralMapping } from "../../intacct/intacct-configuration/import-settings.model";
import type { XeroWorkspaceGeneralSetting } from "../db/xero-workspace-general-setting.model";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import type { IntegrationField } from "../../db/mapping.model";
import { brandingConfig } from "src/app/branding/branding-config";
import { ExportSettingModel } from "../../common/export-settings.model";


export interface XeroImportSettingWorkspaceGeneralSetting {
  import_categories: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean,
  import_customers: boolean,
  import_suppliers_as_merchants: boolean
}

export interface XeroImportSettingGeneralMapping {
  default_tax_code: DefaultDestinationAttribute
}

export interface XeroImportSettingMappingSetting {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  is_custom: boolean,
  source_placeholder: string | null
}

export interface XeroImportSettingPost {
  workspace_general_settings: XeroImportSettingWorkspaceGeneralSetting,
  general_mappings: ImportSettingGeneralMapping,
  mapping_settings: XeroImportSettingMappingSetting[]
}

export interface ExpenseFieldsFormOption {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  disable_import_to_fyle: boolean,
  source_placeholder: string | null
}

export interface XeroImportSettingGet {
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

  static mapAPIResponseToFormGroup(importSettings: XeroImportSettingGet | null, xeroFields: IntegrationField[], isCustomerPresent:boolean, destinationAttribute: DestinationAttribute[]): FormGroup {
    let additionalOption: any[] = [];
    if (brandingConfig.brandId === 'co' && isCustomerPresent) {
      const additionalMappingSetting = {
        source_field: 'DISABLED_XERO_SOURCE_FIELD',
        destination_field: XeroFyleField.CUSTOMER,
        import_to_fyle: importSettings?.workspace_general_settings.import_customers || false,
        is_custom: false,
        source_placeholder: null
      };
      additionalOption = [ImportSettingsModel.createFormGroup(additionalMappingSetting)];
    }
    const expenseFieldsArray = importSettings?.mapping_settings ? additionalOption.concat(this.constructFormArray(importSettings.mapping_settings, xeroFields)) : [];
    const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
    return new FormGroup({
      importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts.map((account) => account.toUpperCase()) : ['EXPENSE']),
      importCustomers: new FormControl(importSettings?.workspace_general_settings.import_customers ?? false),
      taxCode: new FormControl(importSettings?.workspace_general_settings.import_tax_codes ?? false),
      importSuppliersAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_suppliers_as_merchants ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? findObjectByDestinationId(destinationAttribute, importSettings.general_mappings.default_tax_code.id) : null),
      searchOption: new FormControl('')
    });
  }

  static constructPayload(importSettingsForm: FormGroup): XeroImportSettingPost {

    const emptyDestinationAttribute = { id: null, name: null };
    const COA = importSettingsForm.get('chartOfAccountTypes')?.value.map((name: string) => name.toUpperCase());
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields.filter(((data:any) => data.destination_field !== XeroFyleField.CUSTOMER));
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

    const importSettingPayload: XeroImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('importCategories')?.value ?? false,
        charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value ? COA : ['EXPENSE'],
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_suppliers_as_merchants: importSettingsForm.get('importSuppliersAsMerchants')?.value,
        import_customers: importSettingsForm.get('importCustomers')?.value ? importSettingsForm.get('importCustomers')?.value : false
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? ExportSettingModel.formatGeneralMappingPayload(importSettingsForm.get('defaultTaxCode')?.value) : emptyDestinationAttribute
      },
      mapping_settings: mappingSettings
    };
    return importSettingPayload;
  }
}
