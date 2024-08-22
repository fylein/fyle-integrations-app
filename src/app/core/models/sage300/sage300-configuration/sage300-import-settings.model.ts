import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ExpenseField, ImportSettingMappingRow, ImportSettingsCustomFieldRow, ImportSettingsModel } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";

export type Sage300DefaultFields = {
    destination_field: string,
    source_field: string,
    formController: string,
    import_code: string
}

export type Sage300DependentImportFields = {
    options: ImportSettingsCustomFieldRow[],
    source_field: string,
    formController: string,
    isDisabled: boolean
}

export type Sage300ImportSettingsDependentFieldSetting = {
    cost_code_field_name: string,
    cost_code_placeholder: string,
    cost_category_field_name: string,
    cost_category_placeholder: string,
    is_import_enabled: boolean
}

export type Sage300ImportSetting = {
    import_settings: {
        import_categories: boolean,
        import_vendors_as_merchants: boolean,
        add_commitment_details: boolean,
        import_code_fields: string[] | [],
    },
    mapping_settings: ImportSettingMappingRow[] | [],
    dependent_field_settings: Sage300ImportSettingsDependentFieldSetting | null,
}

export interface  Sage300ImportSettingGet extends Sage300ImportSetting {
    workspaceId: number
}

export interface  Sage300ImportSettingPost extends Sage300ImportSetting {}

export class Sage300ImportSettingModel extends ImportSettingsModel {

    static generateDependentFieldValue(attribute_type: string, source_placeholder: string): ExpenseField {
        return {
          attribute_type: attribute_type,
          display_name: attribute_type,
          source_placeholder: source_placeholder,
          is_dependent: true
        };
    }

    static mapAPIResponseToFormGroup(importSettings: Sage300ImportSettingGet | null, sage300Fields: IntegrationField[]): FormGroup {
        const importCode = importSettings?.import_settings?.import_code_fields ? importSettings?.import_settings?.import_code_fields : [];
        const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, sage300Fields, false, importCode) : [] ;
        return new FormGroup({
            importCodeFields: new FormControl(importSettings?.import_settings?.import_code_fields ? importSettings?.import_settings.import_code_fields : []),
            importCategories: new FormControl(importSettings?.import_settings?.import_categories ?? false),
            importCategoryCode: new FormControl(importSettings?.import_settings?.import_categories ? this.getImportCodeField(importCode, 'ACCOUNT') : null),
            importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ?? false),
            importVendorCode: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ? this.getImportCodeField(importCode, 'VENDOR') : null),
            expenseFields: new FormArray(expenseFieldsArray),
            isDependentImportEnabled: new FormControl(importSettings?.dependent_field_settings?.is_import_enabled ? importSettings.dependent_field_settings.is_import_enabled : false),
            costCodes: new FormControl(importSettings?.dependent_field_settings?.cost_code_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_code_field_name, importSettings.dependent_field_settings.cost_code_placeholder) : null),
            costCategory: new FormControl(importSettings?.dependent_field_settings?.cost_category_field_name ? this.generateDependentFieldValue(importSettings.dependent_field_settings.cost_category_field_name, importSettings.dependent_field_settings.cost_category_placeholder) : null),
            addCommitmentDetails: new FormControl(importSettings?.import_settings?.add_commitment_details ?? false),
            dependentFieldImportToggle: new FormControl(true)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup, importSettings: Sage300ImportSettingGet): Sage300ImportSettingPost {
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

        return {
            import_settings: {
                import_categories: importSettingsForm.get('importCategories')?.value,
                import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value,
                add_commitment_details: importSettingsForm.get('addCommitmentDetails')?.value,
                import_code_fields: importSettingsForm.get('importCodeFields')?.value
            },
            mapping_settings: mappingSettings,
            dependent_field_settings: importSettingsForm.get('isDependentImportEnabled')?.value && (importSettingsForm.get('costCodes')?.value && importSettingsForm.get('costCategory')?.value) ? {
                cost_code_field_name: importSettingsForm.get('costCodes')?.value ? importSettingsForm.get('costCodes')?.value.attribute_type : (importSettings?.dependent_field_settings?.cost_code_field_name ? importSettings.dependent_field_settings?.cost_code_field_name : null),
                cost_code_placeholder: importSettingsForm.get('costCodes')?.value ? importSettingsForm.get('costCodes')?.value.source_placeholder : (importSettings?.dependent_field_settings?.cost_code_placeholder ? importSettings.dependent_field_settings?.cost_code_placeholder : null),
                cost_category_field_name: importSettingsForm.get('costCategory')?.value ? importSettingsForm.get('costCategory')?.value.attribute_type : (importSettings?.dependent_field_settings?.cost_category_field_name ? importSettings.dependent_field_settings?.cost_category_field_name : null),
                cost_category_placeholder: importSettingsForm.get('costCategory')?.value ? importSettingsForm.get('costCategory')?.value.source_placeholder : (importSettings?.dependent_field_settings?.cost_category_placeholder ? importSettings.dependent_field_settings?.cost_category_placeholder : null),
                is_import_enabled: importSettingsForm.get('isDependentImportEnabled')?.value
            } : null
        };
    }

}