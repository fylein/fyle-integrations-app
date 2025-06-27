import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import { QBOExportSettingGet, QBOExportSettingModel, QBOExportSettingPost } from "./qbo-export-setting.model";
import { QBOImportSettingGet, QBOImportSettingModel, QBOImportSettingPost } from "./qbo-import-setting.model";
import { QBOAdvancedSettingGet, QBOAdvancedSettingPost } from "./qbo-advanced-setting.model";
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from "./qbo-employee-setting.model";
import { QboAdvancedSettingsService } from "src/app/core/services/qbo/qbo-configuration/qbo-advanced-settings.service";
import { QboEmployeeSettingsService } from "src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service";

export type QBOCloneSetting = {
    workspace_id: number,
    export_settings: QBOExportSettingGet,
    import_settings: QBOImportSettingGet,
    advanced_configurations: QBOAdvancedSettingGet,
    employee_mappings: QBOEmployeeSettingGet
}

export type QBOCloneSettingPost = {
    export_settings: QBOExportSettingPost,
    import_settings: QBOImportSettingPost,
    advanced_configurations: QBOAdvancedSettingPost,
    employee_mappings: QBOEmployeeSettingPost
}

export class QBOCloneSettingModel {
    static constructPayload(employeeSettingForm: FormGroup, exportSettingForm: FormGroup, importSettingForm: FormGroup, advancedSettingForm: FormGroup, isTaxGroupSyncAllowed: boolean): QBOCloneSettingPost {
        const employeeSettingPayload = QboEmployeeSettingsService.constructPayload(employeeSettingForm);
        const exportSettingPayload = QBOExportSettingModel.constructPayload(exportSettingForm);
        const importSettingPayload = QBOImportSettingModel.constructPayload(importSettingForm);
        const advancedSettingPayload = QboAdvancedSettingsService.constructPayload(advancedSettingForm);

        if (!isTaxGroupSyncAllowed) {
            importSettingPayload.workspace_general_settings.import_tax_codes = false;
        }

        return {
            export_settings: exportSettingPayload,
            import_settings: importSettingPayload,
            advanced_configurations: advancedSettingPayload,
            employee_mappings: employeeSettingPayload
        };
    }
}
