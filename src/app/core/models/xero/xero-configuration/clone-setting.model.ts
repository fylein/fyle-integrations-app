import { FormGroup } from "@angular/forms";
import { XeroAdvancedSettingGet, XeroAdvancedSettingPost } from "./xero-advanced-settings.model";
import { XeroExportSettingGet, XeroExportSettingPost } from "./xero-export-settings.model";
import { XeroImportSettingGet, XeroImportSettingPost } from "./xero-import-settings.model";
import { XeroAdvancedSettingsService } from "src/app/core/services/xero/xero-configuration/xero-advanced-settings.service";
import { XeroExportSettingsService } from "src/app/core/services/xero/xero-configuration/xero-export-settings.service";
import { XeroImportSettingsService } from "src/app/core/services/xero/xero-configuration/xero-import-settings.service";


export type XeroCloneSetting = {
    workspace_id: number,
    export_settings: XeroExportSettingGet,
    import_settings: XeroImportSettingGet,
    advanced_settings: XeroAdvancedSettingGet
}

export type XeroCloneSettingPost = {
    export_settings: XeroExportSettingPost,
    import_settings: XeroImportSettingPost,
    advanced_settings: XeroAdvancedSettingPost
}

export class XeroCloneSettingModel {
    static constructPayload(exportSettingForm: FormGroup, importSettingForm: FormGroup, advancedSettingForm: FormGroup, isTaxGroupSyncAllowed: boolean): XeroCloneSettingPost {
        const exportSettingPayload = XeroExportSettingsService.constructPayload(exportSettingForm, true);
        const importSettingPayload = XeroImportSettingsService.constructPayload(importSettingForm, true);
        const advancedSettingPayload = XeroAdvancedSettingsService.constructPayload(advancedSettingForm, true);

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
