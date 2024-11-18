import { FormGroup } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import { XeroAdvancedSettingGet, XeroAdvancedSettingModel, XeroAdvancedSettingPost } from "./xero-advanced-settings.model";
import { XeroExportSettingGet, XeroExportSettingModel, XeroExportSettingPost } from "./xero-export-settings.model";
import { XeroImportSettingGet, XeroImportSettingModel, XeroImportSettingPost } from "./xero-import-settings.model";


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
        const exportSettingPayload = XeroExportSettingModel.constructPayload(exportSettingForm);
        const importSettingPayload = XeroImportSettingModel.constructPayload(importSettingForm);
        const advancedSettingPayload = XeroAdvancedSettingModel.constructPayload(advancedSettingForm);

        // Set the bank_account in the payload to the selected field value without formatting it
        // Since we format them on component init (clone settings only)
        exportSettingPayload.general_mappings.bank_account = exportSettingForm.get('bankAccount')?.value;
        importSettingPayload.general_mappings.default_tax_code = importSettingForm.get('defaultTaxCode')?.value;
        advancedSettingPayload.general_mappings.payment_account = advancedSettingForm.get('billPaymentAccount')?.value;

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
