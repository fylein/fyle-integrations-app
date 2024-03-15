import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { DefaultDestinationAttribute } from "../../db/destination-attribute.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { IntegrationField } from "../../db/mapping.model";


export type NetsuiteImportSettingWorkspaceGeneralSetting = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    import_tax_codes: boolean,
    import_netsuite_employees: boolean
  }
  
  export type NetsuiteImportSettingPost = {
    workspace_general_settings: NetsuiteImportSettingWorkspaceGeneralSetting,
    mapping_settings: ImportSettingMappingRow[] | []
  }
  
  
  export type NetsuiteImportSettingGet = {
    configuration: NetsuiteImportSettingWorkspaceGeneralSetting,
    mapping_settings: MappingSetting[],
    workspace_id: number
  }

export class NetsuiteImportSettingModel extends ImportSettingsModel {
    static mapAPIResponseToFormGroup(importSettings: NetsuiteImportSettingGet | null, NetsuiteFields: IntegrationField[]): FormGroup {
        console.log('ijb', importSettings)
        return new FormGroup({
          importCategories: new FormControl(importSettings?.configuration.import_categories ?? false),
          taxCode: new FormControl(importSettings?.configuration.import_tax_codes ?? false),
          importVendorsAsMerchants: new FormControl(importSettings?.configuration.import_vendors_as_merchants ?? false),
          searchOption: new FormControl('')
        });
      }
    
      static constructPayload(importSettingsForm: FormGroup): NetsuiteImportSettingPost {
        const emptyDestinationAttribute = {id: null, name: null};
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
    
        return {
          workspace_general_settings: {
            import_categories: importSettingsForm.get('importCategories')?.value,
            import_tax_codes: importSettingsForm.get('taxCode')?.value,
            import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
            import_netsuite_employees: importSettingsForm.get('importNetsuiteEmployees')?.value
          },
          mapping_settings: mappingSettings,
        };
      }
    
}
