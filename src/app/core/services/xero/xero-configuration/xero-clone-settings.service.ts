import { Injectable } from '@angular/core';
import { XeroCloneSettingPost } from 'src/app/core/models/xero/xero-configuration/clone-setting.model';
import { XeroImportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-import-settings.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { FormGroup } from '@angular/forms';
import { XeroAdvancedSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-advanced-settings.service';

@Injectable({
  providedIn: 'root'
})

export class XeroCloneSettingService {

  constructor(
    private xeroExportSettingsService: XeroExportSettingsService,
    private xeroImportSettingsService: XeroImportSettingsService,
    private xeroAdvancedSettingsService: XeroAdvancedSettingsService
  ) { }

  constructPayload(exportSettingForm: FormGroup, importSettingForm: FormGroup, advancedSettingForm: FormGroup, isTaxGroupSyncAllowed: boolean): XeroCloneSettingPost {
    const exportSettingPayload = this.xeroExportSettingsService.constructPayload(exportSettingForm, true);
    const importSettingPayload = this.xeroImportSettingsService.constructPayload(importSettingForm, true);
    const advancedSettingPayload = this.xeroAdvancedSettingsService.constructPayload(advancedSettingForm, true);

    if (!isTaxGroupSyncAllowed) {
        importSettingPayload.workspace_general_settings.import_tax_codes = false;
    }

    return {
        export_settings: exportSettingPayload,
        import_settings: importSettingPayload,
        advanced_settings: advancedSettingPayload
    };
  }
}
