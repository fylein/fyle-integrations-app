import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { IntegrationField } from "../../db/mapping.model";

export type BusinessCentralImportSettings = {
    import_settings: {
        import_categories: boolean,
        import_vendors_as_merchants: boolean,
        charts_of_accounts: string[]
    }
    mapping_settings: ImportSettingMappingRow[] | []
}

export interface BusinessCentralImportSettingsGet extends BusinessCentralImportSettings {
    id: number,
    workspace_id: number,
    created_at: Date,
    updated_at: Date
}

export interface BusinessCentralImportSettingsPost extends BusinessCentralImportSettings {}

export class BusinessCentralImportSettingsModel extends ImportSettingsModel {

    static mapAPIResponseToFormGroup(importSettings: BusinessCentralImportSettingsGet | null, businessCentralFields: IntegrationField[]): FormGroup {
        const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, businessCentralFields) : [] ;
        return new FormGroup({
            importCategories: new FormControl(importSettings?.import_settings?.import_categories ?? false),
            chartOfAccountTypes: new FormControl(importSettings?.import_settings.charts_of_accounts ? importSettings?.import_settings.charts_of_accounts : ['Expense']),
            importVendorAsMerchant: new FormControl(importSettings?.import_settings?.import_vendors_as_merchants ?? false ),
            expenseFields: new FormArray(expenseFieldsArray)
        });
    }

    static createImportSettingPayload(importSettingsForm: FormGroup): BusinessCentralImportSettingsPost {
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
        return {
            import_settings: {
                import_categories: importSettingsForm.get('importCategories')?.value,
                import_vendors_as_merchants: importSettingsForm.get('importVendorAsMerchant')?.value,
                charts_of_accounts: importSettingsForm.get('chartOfAccountTypes')?.value
            },
            mapping_settings: mappingSettings
        };
    }

    static getChartOfAccountTypesList() {
        return ['Expense', 'Assets', 'Income', 'Equity', 'Liabilities', 'Others', 'Cost of Goods Sold'];
    }
}

