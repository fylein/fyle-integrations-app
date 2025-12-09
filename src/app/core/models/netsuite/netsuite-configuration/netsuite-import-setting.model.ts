import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ImportSettingMappingRow } from '../../common/import-settings.model';
import { MappingSetting } from '../../db/mapping-setting.model';
import { IntegrationField } from '../../db/mapping.model';
import { DefaultDestinationAttribute, DestinationAttribute } from '../../db/destination-attribute.model';
import { SelectFormOption } from '../../common/select-form-option.model';
import { NetsuiteCustomSegmentOption } from '../../enum/enum.model';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';

export type NetsuiteImportSettingConfiguration = {
  import_categories: boolean;
  import_vendors_as_merchants: boolean;
  import_tax_items: boolean;
  import_items: boolean;
  import_netsuite_employees: boolean;
};

export type NetsuiteImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute;
};

export type NetsuiteImportSettingPost = {
  configuration: NetsuiteImportSettingConfiguration;
  general_mappings: NetsuiteImportSettingGeneralMapping;
  mapping_settings: ImportSettingMappingRow[] | [];
};

export type NetsuiteImportSettingGet = {
  configuration: NetsuiteImportSettingConfiguration;
  general_mappings: NetsuiteImportSettingGeneralMapping;
  mapping_settings: MappingSetting[];
  workspace_id: number;
};

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
