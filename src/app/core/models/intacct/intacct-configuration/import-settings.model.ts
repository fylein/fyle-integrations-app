import { FormGroup } from "@angular/forms";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { FyleField } from "../../enum/enum.model";
import { brandingConfig } from "src/app/branding/branding-config";
import { ImportSettingsCustomFieldRow } from "../../common/import-settings.model";

const emptyDestinationAttribute = { id: null, name: null };

export type Configuration = {
    import_vendors_as_merchants: boolean,
    import_categories: boolean,
    import_tax_codes: boolean,
    import_code_fields: string[]
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

export type IntacctDependentImportFields = {
    options: ImportSettingsCustomFieldRow[],
    source_field: string,
    formController: string,
    isDisabled: boolean
}

export class ImportSettings {
    static constructPayload(importSettingsForm: FormGroup, existingDependentFieldSettings: DependentFieldSetting | null): ImportSettingPost{
        const expenseFieldArray = importSettingsForm.value.expenseFields;

        // First filter out objects where import_to_fyle is false
        const filteredExpenseFieldArray = expenseFieldArray.filter((field: MappingSetting) => field.destination_field && field.source_field);

        // Then map over the filtered array
        const mappingSettings = filteredExpenseFieldArray.filter((field: MappingSetting) => field.source_field !== 'CATEGORY').map((field: MappingSetting) => {
          return {
            source_field: field.source_field.toUpperCase(),
            destination_field: field.destination_field,
            import_to_fyle: field.import_to_fyle,
            is_custom: (field.source_field.toUpperCase() === 'PROJECT' || field.source_field.toUpperCase() === 'COST_CENTER') ? false : true,
            source_placeholder: field.source_placeholder
          };
        });

        let dependentFieldSetting = null;
        if (existingDependentFieldSettings || importSettingsForm.value.isDependentImportEnabled) {
            dependentFieldSetting = {
                is_import_enabled: importSettingsForm.value.isDependentImportEnabled,
                cost_code_field_name: importSettingsForm.get('costCodes')?.value?.attribute_type,
                cost_code_placeholder: importSettingsForm.get('costCodes')?.value?.source_placeholder,
                cost_type_field_name: importSettingsForm.get('costTypes')?.value?.attribute_type,
                cost_type_placeholder: importSettingsForm.get('costTypes')?.value?.source_placeholder,
                workspace: importSettingsForm.value.workspaceId
            };
        }

        let isCategoryImportEnabled = false;

        if (brandingConfig.brandId === 'fyle') {
            isCategoryImportEnabled = importSettingsForm.value.importCategories ? importSettingsForm.value.importCategories : false;
        } else {
            isCategoryImportEnabled = filteredExpenseFieldArray.filter((field: MappingSetting) => field.source_field === 'CATEGORY' && field.import_to_fyle).length > 0 ? true : false;
        }

        // Import_code_field value construction
        const importCodeFields = importSettingsForm.value.importCodeFields;

        const importCodeFieldArray = importCodeFields.filter((field: { import_code: any; }) => field.import_code).map((value: { source_field: any; }) => {
            return value.source_field;
        });

        const finalimportCodeFieldArray: string[] = importSettingsForm.value.importCodeField.filter((value: string) => value!=='COST_CODE' && value !== 'COST_TYPE').concat(importCodeFieldArray);

        // Actual Payload
        const importSettingPayload: ImportSettingPost = {
                configurations: {
                    import_categories: isCategoryImportEnabled,
                    import_tax_codes: importSettingsForm.value.importTaxCodes ? importSettingsForm.value.importTaxCodes : false,
                    import_vendors_as_merchants: importSettingsForm.value.importVendorAsMerchant ? importSettingsForm.value.importVendorAsMerchant : false,
                    import_code_fields: finalimportCodeFieldArray
                },
                general_mappings: {
                    default_tax_code: importSettingsForm.value.importTaxCodes ? {
                        name: importSettingsForm.value.sageIntacctTaxCodes.value,
                        id: importSettingsForm.value.sageIntacctTaxCodes.destination_id
                    } : emptyDestinationAttribute
                },
                mapping_settings: mappingSettings,
                dependent_field_settings: dependentFieldSetting
            };

        return importSettingPayload;
    }
}