import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportCodeFieldConfigType, ImportSettingMappingRow } from "../../common/import-settings.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { IntegrationField } from "../../db/mapping.model";
import { ImportSettingsService } from "src/app/core/services/common/import-settings.service";

export type QBOImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  import_items: boolean,
  import_vendors_as_merchants: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean,
  import_code_fields: string[]
}

export type QBOImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type QBOImportSettingPost = {
  workspace_general_settings: QBOImportSettingWorkspaceGeneralSetting,
  general_mappings: QBOImportSettingGeneralMapping,
  mapping_settings: ImportSettingMappingRow[] | []
}


export type QBOImportSettingGet = {
  workspace_general_settings: QBOImportSettingWorkspaceGeneralSetting,
  general_mappings: QBOImportSettingGeneralMapping,
  mapping_settings: MappingSetting[],
  workspace_id: number
}



export class QBOImportSettingModel extends ImportSettingsService {
  static getChartOfAccountTypesList(): string[] {
    return [
      'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
      'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset', 'Income', 'Other Income'
    ];
  }

  static mapAPIResponseToFormGroup(importSettings: QBOImportSettingGet | null, qboFields: IntegrationField[], qboImportCodeFieldCodeConfig: ImportCodeFieldConfigType): FormGroup {
    const importCode = importSettings?.workspace_general_settings?.import_code_fields ? importSettings?.workspace_general_settings?.import_code_fields : [];
    const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, qboFields, qboImportCodeFieldCodeConfig) : [];
    return new FormGroup({
      importCategories: new FormControl(importSettings?.workspace_general_settings.import_categories ?? false),
      expenseFields: new FormArray(expenseFieldsArray),
      chartOfAccountTypes: new FormControl(importSettings?.workspace_general_settings.charts_of_accounts ? importSettings.workspace_general_settings.charts_of_accounts : ['Expense']),
      importItems: new FormControl(importSettings?.workspace_general_settings.import_items ?? false),
      taxCode: new FormControl(importSettings?.workspace_general_settings.import_tax_codes ?? false),
      importVendorsAsMerchants: new FormControl(importSettings?.workspace_general_settings.import_vendors_as_merchants ?? false),
      defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? importSettings.general_mappings.default_tax_code : null),
      searchOption: new FormControl(''),
      importCodeFields: new FormControl( importSettings?.workspace_general_settings?.import_code_fields ? importSettings.workspace_general_settings.import_code_fields : null),
      importCategoryCode: new FormControl(this.getImportCodeField(importCode, 'ACCOUNT', qboImportCodeFieldCodeConfig))
    });
  }

  static constructPayload(importSettingsForm: FormGroup): QBOImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
    const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

    return {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('importCategories')?.value,
        import_items: importSettingsForm.get('importItems')?.value,
        charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value,
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
        import_code_fields: importSettingsForm.get('importCodeFields')?.value
      },
      mapping_settings: mappingSettings,
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? importSettingsForm.get('defaultTaxCode')?.value : emptyDestinationAttribute
      }
    };
  }
}
