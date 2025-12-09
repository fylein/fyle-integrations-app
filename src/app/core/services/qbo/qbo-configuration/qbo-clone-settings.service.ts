import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QBOCloneSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-clone-setting.model';
import { QboAdvancedSettingsService } from './qbo-advanced-settings.service';
import { QboEmployeeSettingsService } from './qbo-employee-settings.service';
import { QboExportSettingsService } from './qbo-export-settings.service';
import { QboImportSettingsService } from './qbo-import-settings.service';

@Injectable({
  providedIn: 'root',
})
export class QboCloneSettingsService {
  private qboImportSettingsService: QboImportSettingsService = inject(QboImportSettingsService);

  constructPayload(
    employeeSettingForm: FormGroup,
    exportSettingForm: FormGroup,
    importSettingForm: FormGroup,
    advancedSettingForm: FormGroup,
    isTaxGroupSyncAllowed: boolean,
  ): QBOCloneSettingPost {
    const employeeSettingPayload = QboEmployeeSettingsService.constructPayload(employeeSettingForm);
    const exportSettingPayload = QboExportSettingsService.constructPayload(exportSettingForm);
    const importSettingPayload = this.qboImportSettingsService.constructPayload(importSettingForm);
    const advancedSettingPayload = QboAdvancedSettingsService.constructPayload(advancedSettingForm);

    if (!isTaxGroupSyncAllowed) {
      importSettingPayload.workspace_general_settings.import_tax_codes = false;
    }

    return {
      export_settings: exportSettingPayload,
      import_settings: importSettingPayload,
      advanced_configurations: advancedSettingPayload,
      employee_mappings: employeeSettingPayload,
    };
  }
}
