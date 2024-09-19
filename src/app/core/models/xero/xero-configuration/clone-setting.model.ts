import type { FormGroup } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import type { XeroAdvancedSettingGet, XeroAdvancedSettingPost } from "./xero-advanced-settings.model";
import { XeroAdvancedSettingModel } from "./xero-advanced-settings.model";
import type { XeroExportSettingGet, XeroExportSettingPost } from "./xero-export-settings.model";
import { XeroExportSettingModel } from "./xero-export-settings.model";
import type { XeroImportSettingGet, XeroImportSettingPost } from "./xero-import-settings.model";
import { XeroImportSettingModel } from "./xero-import-settings.model";


export interface XeroCloneSetting {
    workspace_id: number,
    export_settings: XeroExportSettingGet,
    import_settings: XeroImportSettingGet,
    advanced_settings: XeroAdvancedSettingGet
}

export interface XeroCloneSettingPost {
    export_settings: XeroExportSettingPost,
    import_settings: XeroImportSettingPost,
    advanced_settings: XeroAdvancedSettingPost
}

export class XeroCloneSettingModel {
    static constructPayload(exportSettingForm: FormGroup, importSettingForm: FormGroup, advancedSettingForm: FormGroup, isTaxGroupSyncAllowed: boolean): XeroCloneSettingPost {
        const exportSettingPayload = XeroExportSettingModel.constructPayload(exportSettingForm);
        const importSettingPayload = XeroImportSettingModel.constructPayload(importSettingForm);
        const advancedSettingPayload = XeroAdvancedSettingModel.constructPayload(advancedSettingForm);

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
