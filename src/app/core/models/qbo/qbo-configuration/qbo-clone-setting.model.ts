import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import { QBOExportSettingGet, QBOExportSettingModel, QBOExportSettingPost } from "./qbo-export-setting.model";
import { QBOImportSettingGet, QBOImportSettingModel, QBOImportSettingPost } from "./qbo-import-setting.model";
import { QBOAdvancedSettingGet, QBOAdvancedSettingModel, QBOAdvancedSettingPost } from "./qbo-advanced-setting.model";
import { QBOEmployeeSettingGet, QBOEmployeeSettingModel, QBOEmployeeSettingPost } from "./qbo-employee-setting.model";

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
        const employeeSettingPayload = QBOEmployeeSettingModel.constructPayload(employeeSettingForm);
        const exportSettingPayload = QBOExportSettingModel.constructPayload(exportSettingForm);
        const importSettingPayload = QBOImportSettingModel.constructPayload(importSettingForm);
        const advancedSettingPayload = QBOAdvancedSettingModel.constructPayload(advancedSettingForm);

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
