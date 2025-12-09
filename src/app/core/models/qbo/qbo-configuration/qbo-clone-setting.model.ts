import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MappingSetting } from '../../db/mapping-setting.model';
import { QBOExportSettingGet, QBOExportSettingPost } from './qbo-export-setting.model';
import { QBOImportSettingGet, QBOImportSettingPost } from './qbo-import-setting.model';
import { QBOAdvancedSettingGet, QBOAdvancedSettingPost } from './qbo-advanced-setting.model';
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from './qbo-employee-setting.model';
import { QboAdvancedSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-advanced-settings.service';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';

export type QBOCloneSetting = {
  workspace_id: number;
  export_settings: QBOExportSettingGet;
  import_settings: QBOImportSettingGet;
  advanced_configurations: QBOAdvancedSettingGet;
  employee_mappings: QBOEmployeeSettingGet;
};

export type QBOCloneSettingPost = {
  export_settings: QBOExportSettingPost;
  import_settings: QBOImportSettingPost;
  advanced_configurations: QBOAdvancedSettingPost;
  employee_mappings: QBOEmployeeSettingPost;
};
