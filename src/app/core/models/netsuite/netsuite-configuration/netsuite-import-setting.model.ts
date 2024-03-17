import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { IntegrationField } from "../../db/mapping.model";


export type NetsuiteImportSettingConfiguration = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    import_tax_items: boolean,
    import_items: boolean,
    import_netsuite_employees: boolean,
    auto_create_merchants: boolean
  }

  export type NetsuiteImportSettingPost = {
    configuration: NetsuiteImportSettingConfiguration,
    mapping_settings: ImportSettingMappingRow[] | []
  }


  export type NetsuiteImportSettingGet = {
    configuration: NetsuiteImportSettingConfiguration,
    mapping_settings: MappingSetting[],
    workspace_id: number
  }

export class NetsuiteImportSettingModel extends ImportSettingsModel {
    static mapAPIResponseToFormGroup(importSettings: NetsuiteImportSettingGet | null, netsuiteFields: IntegrationField[]): FormGroup {
      const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, netsuiteFields) : [];
      return new FormGroup({
          importCategories: new FormControl(importSettings?.configuration.import_categories ?? false),
          expenseFields: new FormArray(expenseFieldsArray),
          import_items: new FormControl(importSettings?.configuration.import_items ?? false),
          taxCode: new FormControl(importSettings?.configuration.import_tax_items ?? false),
          importVendorsAsMerchants: new FormControl(importSettings?.configuration.import_vendors_as_merchants ?? false),
          importNetsuiteEmployees: new FormControl(importSettings?.configuration.import_netsuite_employees ?? false),
          searchOption: new FormControl('')
        });
      }

      static constructPayload(importSettingsForm: FormGroup): NetsuiteImportSettingPost {
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);

        return {
          configuration: {
            import_categories: importSettingsForm.get('importCategories')?.value,
            import_tax_items: importSettingsForm.get('taxCode')?.value,
            import_items: importSettingsForm.get('importItems')?.value ? importSettingsForm.get('importItems')?.value : false,
            import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
            import_netsuite_employees: importSettingsForm.get('importNetsuiteEmployees')?.value,
            auto_create_merchants: importSettingsForm.get('autoCreateMerchants')?.value ? importSettingsForm.get('autoCreateMerchants')?.value : false
          },
          mapping_settings: mappingSettings
        };
      }

}
