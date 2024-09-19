import { FormArray, FormControl, FormGroup } from "@angular/forms";
import type { ImportSettingMappingRow } from "../../common/import-settings.model";
import { ImportSettingsModel } from "../../common/import-settings.model";
import type { MappingSetting } from "../../db/mapping-setting.model";
import type { IntegrationField } from "../../db/mapping.model";
import type { DefaultDestinationAttribute, DestinationAttribute } from "../../db/destination-attribute.model";
import { NetSuiteExportSettingModel } from "./netsuite-export-setting.model";
import type { SelectFormOption } from "../../common/select-form-option.model";
import { NetsuiteCustomSegmentOption } from "../../enum/enum.model";


export interface NetsuiteImportSettingConfiguration {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    import_tax_items: boolean,
    import_items: boolean,
    import_netsuite_employees: boolean
  }

  export interface NetsuiteImportSettingGeneralMapping {
    default_tax_code: DefaultDestinationAttribute
  }

  export interface NetsuiteImportSettingPost {
    configuration: NetsuiteImportSettingConfiguration,
    general_mappings: NetsuiteImportSettingGeneralMapping,
    mapping_settings: ImportSettingMappingRow[] | []
  }


  export interface NetsuiteImportSettingGet {
    configuration: NetsuiteImportSettingConfiguration,
    general_mappings: NetsuiteImportSettingGeneralMapping,
    mapping_settings: MappingSetting[],
    workspace_id: number
  }

  export interface CustomSegment {
    id?: number;
    name?: string;
    segment_type: string;
    script_id: string;
    internal_id: string;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
  }

export class NetsuiteImportSettingModel extends ImportSettingsModel {

  static getCustomSegmentOptions(): SelectFormOption[] {
    return [
      {
        label: 'Custom List',
        value: NetsuiteCustomSegmentOption.CUSTOM_LIST
      },
      {
        label: 'Custom Record',
        value: NetsuiteCustomSegmentOption.CUSTOM_RECORD
      },
      {
        label: 'Custom Segment',
        value: NetsuiteCustomSegmentOption.CUSTOM_SEGMENT
      }
    ];
  }

  static constructCustomSegmentPayload(customSegmentForm: FormGroup, workspaceId: number): CustomSegment {
    return {
      segment_type: customSegmentForm.get('customFieldType')?.value,
      script_id: customSegmentForm.get('scriptId')?.value,
      internal_id: customSegmentForm.get('internalId')?.value,
      workspace: workspaceId
    };
  }

    static mapAPIResponseToFormGroup(importSettings: NetsuiteImportSettingGet | null, netsuiteFields: IntegrationField[], destinationAttribute: DestinationAttribute[]): FormGroup {
      const expenseFieldsArray = importSettings?.mapping_settings ? this.constructFormArray(importSettings.mapping_settings, netsuiteFields) : [];
      const findObjectByDestinationId = (array: DestinationAttribute[], id: string) => array?.find(item => item.destination_id === id) || null;
      return new FormGroup({
          importCategories: new FormControl(importSettings?.configuration.import_categories ?? false),
          expenseFields: new FormArray(expenseFieldsArray),
          importItems: new FormControl(importSettings?.configuration.import_items ?? false),
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
        const emptyDestinationAttribute = { id: null, name: null };

        return {
          configuration: {
            import_categories: importSettingsForm.get('importCategories')?.value,
            import_tax_items: importSettingsForm.get('taxCode')?.value,
            import_items: importSettingsForm.get('importItems')?.value ? importSettingsForm.get('importItems')?.value : false,
            import_vendors_as_merchants: importSettingsForm.get('importVendorsAsMerchants')?.value,
            import_netsuite_employees: importSettingsForm.get('importNetsuiteEmployees')?.value
          },
          general_mappings: {
            default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? NetSuiteExportSettingModel.formatGeneralMappingPayload(importSettingsForm.get('defaultTaxCode')?.value) : emptyDestinationAttribute
          },
          mapping_settings: mappingSettings
        };
      }

}
