import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SelectFormOption } from '../../common/select-form-option.model';
import { DefaultDestinationAttribute, DestinationAttribute } from '../../db/destination-attribute.model';
import { MappingSetting } from '../../db/mapping-setting.model';
import { MappingDestinationField, MappingSourceField, XeroFyleField } from '../../enum/enum.model';
import { ImportSettingGeneralMapping } from '../../intacct/intacct-configuration/import-settings.model';
import { XeroWorkspaceGeneralSetting } from '../db/xero-workspace-general-setting.model';
import { IntegrationField } from '../../db/mapping.model';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ExportSettingsService } from 'src/app/core/services/common/export-settings.service';
import { ImportSettingsService } from 'src/app/core/services/common/import-settings.service';

export type XeroImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean;
  charts_of_accounts: string[];
  import_tax_codes: boolean;
  import_customers: boolean;
  import_suppliers_as_merchants: boolean;
};

export type XeroImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute;
};

export type XeroImportSettingMappingSetting = {
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null;
};

export type XeroImportSettingPost = {
  workspace_general_settings: XeroImportSettingWorkspaceGeneralSetting;
  general_mappings: ImportSettingGeneralMapping;
  mapping_settings: XeroImportSettingMappingSetting[];
};

export type ExpenseFieldsFormOption = {
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  disable_import_to_fyle: boolean;
  source_placeholder: string | null;
};

export type XeroImportSettingGet = {
  workspace_general_settings: XeroWorkspaceGeneralSetting;
  general_mappings: XeroImportSettingGeneralMapping;
  mapping_settings: MappingSetting[];
  workspace_id: number;
};

export interface XeroImportSettingFormOption extends SelectFormOption {
  value: string;
}
