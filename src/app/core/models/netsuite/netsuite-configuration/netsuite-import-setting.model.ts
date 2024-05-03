import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ImportSettingMappingRow, ImportSettingsModel } from "../../common/import-settings.model";
import { MappingSetting } from "../../db/mapping-setting.model";
import { IntegrationField } from "../../db/mapping.model";
import { ImportSettingGeneralMapping } from "../../intacct/intacct-configuration/import-settings.model";
import { DestinationAttribute } from "../../db/destination-attribute.model";
import { NetSuiteExportSettingModel } from "./netsuite-export-setting.model";
import { SelectFormOption } from "../../common/select-form-option.model";
import { NetsuiteCustomeSegmentOption } from "../../enum/enum.model";


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
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: ImportSettingMappingRow[] | []
  }


  export type NetsuiteImportSettingGet = {
    configuration: NetsuiteImportSettingConfiguration,
    general_mappings: ImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    workspace_id: number
  }

  export type CustomSegment = {
    id?: number;
    name?: string;
    segment_type: string;
    script_id: string;
    internal_id: string;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
  };

export class NetsuiteImportSettingModel extends ImportSettingsModel {

  static getCustomeSegmentOptions(): SelectFormOption[] {
    return [
      {
        label: 'Custom List',
        value: NetsuiteCustomeSegmentOption.CUSTOM_LIST
      },
      {
        label: 'Custom Record',
        value: NetsuiteCustomeSegmentOption.CUSTOM_RECORD
      },
      {
        label: 'Custom Segment',
        value: NetsuiteCustomeSegmentOption.CUSTOM_SEGMENT
      }
    ];
  }

  static constructCustomSegmentPayload(customeSegmentForm: FormGroup): CustomSegment {
    return {
      segment_type: customeSegmentForm.get('custom_field_type')?.value,
      script_id: customeSegmentForm.get('script_id')?.value,
      internal_id: customeSegmentForm.get('internal_id')?.value
    };
  }

    static mapAPIResponseToFormGroup(importSettings: NetsuiteImportSettingGet | null, netsuiteFields: IntegrationField[], destinationAttribute: DestinationAttribute[]): FormGroup {
      const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, netsuiteFields) : [];
      const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
      return new FormGroup({
          importCategories: new FormControl(importSettings?.configuration.import_categories ?? false),
          expenseFields: new FormArray(expenseFieldsArray),
          import_items: new FormControl(importSettings?.configuration.import_items ?? false),
          taxCode: new FormControl(importSettings?.configuration.import_tax_items ?? false),
          importVendorsAsMerchants: new FormControl(importSettings?.configuration.import_vendors_as_merchants ?? false),
          importNetsuiteEmployees: new FormControl(importSettings?.configuration.import_netsuite_employees ?? false),
          defaultTaxCode: new FormControl(importSettings?.general_mappings?.default_tax_code?.id ? findObjectByDestinationId(destinationAttribute, importSettings.general_mappings.default_tax_code.id) : null),
          searchOption: new FormControl('')
        });
      }

      static constructPayload(importSettingsForm: FormGroup): NetsuiteImportSettingPost {
        const expenseFieldArray = importSettingsForm.getRawValue().expenseFields;
        const mappingSettings = this.constructMappingSettingPayload(expenseFieldArray);
        const emptyDestinationAttribute = {id: null, name: null};

        return {
          configuration: {
            import_categories: importSettingsForm.get('importCategories')?.value,
            import_tax_items: importSettingsForm.get('taxCode')?.value,
            import_items: importSettingsForm.get('importItems')?.value ? importSettingsForm.get('importItems')?.value : false,
            import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
            import_netsuite_employees: importSettingsForm.get('importNetsuiteEmployees')?.value,
            auto_create_merchants: importSettingsForm.get('autoCreateMerchants')?.value ? importSettingsForm.get('autoCreateMerchants')?.value : false
          },
          general_mappings: {
            default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? NetSuiteExportSettingModel.formatGeneralMappingPayload(importSettingsForm.get('defaultTaxCode')?.value) : emptyDestinationAttribute
          },
          mapping_settings: mappingSettings
        };
      }

}
