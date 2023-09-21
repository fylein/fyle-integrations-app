import { FormGroup } from "@angular/forms";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";

const emptyDestinationAttribute = { id: null, name: null };

export type Configuration = {
    import_vendors_as_merchants: boolean,
    import_categories: boolean,
    import_tax_codes: boolean
}

export type ImportSettingGeneralMapping = {
    default_tax_code: DefaultDestinationAttribute
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
  };

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
    dependent_field_settings: DependentFieldSetting | null
  }
export class ImportSettings {
    static constructPayload(importSettingsForm: FormGroup, dependentFieldSettings: DependentFieldSetting | null): ImportSettingPost{
        const expenseFieldArray = importSettingsForm.value.expenseFields;

        // First filter out objects where import_to_fyle is false
        const filteredExpenseFieldArray = expenseFieldArray.filter((field: MappingSetting) => field.destination_field && field.source_field);

        // Then map over the filtered array
        const mappingSettings = filteredExpenseFieldArray.map((field: MappingSetting) => {
          return {
            source_field: field.source_field.toUpperCase(),
            destination_field: field.destination_field,
            import_to_fyle: field.import_to_fyle,
            is_custom: field.is_custom,
            source_placeholder: field.source_placeholder
          };
        });

        const dependentFieldSetting = dependentFieldSettings ? {
            is_import_enabled: importSettingsForm.value.isDependentImportEnabled,
            cost_code_field_name: importSettingsForm.get('costCodes')?.value?.attribute_type,
            cost_code_placeholder: importSettingsForm.get('costCodes')?.value?.source_placeholder,
            cost_type_field_name: importSettingsForm.get('costTypes')?.value?.attribute_type,
            cost_type_placeholder: importSettingsForm.get('costTypes')?.value?.source_placeholder,
            workspace: importSettingsForm.value.workspaceId
        } : null;
        const importSettingPayload: ImportSettingPost = {
                configurations: {
                    import_categories: importSettingsForm.value.importCategories ? importSettingsForm.value.importCategories : false,
                    import_tax_codes: importSettingsForm.value.importTaxCodes ? importSettingsForm.value.importTaxCodes : false,
                    import_vendors_as_merchants: importSettingsForm.value.importVendorAsMerchant ? importSettingsForm.value.importVendorAsMerchant : false
                },
                general_mappings: {
                    default_tax_code: importSettingsForm.value.importTaxCodes ? {
                        name: importSettingsForm.value.sageIntacctTaxCodes.value,
                        id: importSettingsForm.value.sageIntacctTaxCodes.id
                    } : emptyDestinationAttribute
                },
                mapping_settings: mappingSettings,
                dependent_field_settings: dependentFieldSetting
            };

        return importSettingPayload;
    }
}