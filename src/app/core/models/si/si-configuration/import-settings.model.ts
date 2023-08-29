import { FormGroup } from "@angular/forms";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";

export type Configuration = {
    import_vendors_as_merchants: boolean,
    import_categories: boolean,
    import_tax_codes: boolean
}

export type ImportSettingGeneralMapping = {
    default_tax_code: DefaultDestinationAttribute | null
}

export type MappingSetting = {
    source_field: string,
    destination_field: string,
    import_to_fyle: boolean,
    is_custom: boolean,
    source_placeholder: null
}

export type DependentFieldSetting = {
    is_import_enabled: boolean,
    cost_code_field_name: string,
    cost_code_placeholder: string,
    cost_type_field_name: string,
    cost_type_placeholder: string,
    workspace: number
}

export type ImportSettingGet = {
    configurations: Configuration,
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependentFieldSetting
    workspace_id: number
}

export type ImportSettingPost = {
    configurations: Configuration,
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    dependent_field_settings: DependentFieldSetting
  }
export class ImportSettings {
    static constructPayload(importSettingsForm: FormGroup): ImportSettingPost{
        const expenseFieldArray = importSettingsForm.value.expenseFields;

        // First filter out objects where import_to_fyle is false
        const filteredExpenseFieldArray = expenseFieldArray.filter((field: MappingSetting) => field.import_to_fyle);

        // Then map over the filtered array
        const mappingSettings = filteredExpenseFieldArray.map((field: MappingSetting) => {
          return {
            source_field: field.source_field,
            destination_field: field.destination_field,
            import_to_fyle: field.import_to_fyle,
            is_custom: field.is_custom,
            source_placeholder: field.source_placeholder
          };
        });

        const importSettingPayload: ImportSettingPost = {
                configurations: {
                    import_categories: importSettingsForm.value.importCategories,
                    import_tax_codes: importSettingsForm.value.importTaxCodes,
                    import_vendors_as_merchants: importSettingsForm.value.importVendorAsMerchant
                },
                general_mappings: {
                    default_tax_code: {
                        name: importSettingsForm.value.sageIntacctTaxCodes.attribute_type,
                        id: importSettingsForm.value.sageIntacctTaxCodes.id
                    }
                },
                mapping_settings: mappingSettings,
                dependent_field_settings: {
                    is_import_enabled: importSettingsForm.value.isDependentImportEnabled,
                    cost_code_field_name: importSettingsForm.value.costCodes.attribute_type,
                    cost_code_placeholder: importSettingsForm.value.costCodes.source_placeholder,
                    cost_type_field_name: importSettingsForm.value.costTypes.attribute_type,
                    cost_type_placeholder: importSettingsForm.value.costTypes.source_placeholder,
                    workspace: importSettingsForm.value.workspaceId
                  }
            };

        return importSettingPayload;
    }
}