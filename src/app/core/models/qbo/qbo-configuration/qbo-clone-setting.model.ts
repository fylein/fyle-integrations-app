import type { FormGroup } from "@angular/forms";
import { FormControl, Validators } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import type { QBOExportSettingGet, QBOExportSettingPost } from "./qbo-export-setting.model";
import { QBOExportSettingModel } from "./qbo-export-setting.model";
import type { QBOImportSettingGet, QBOImportSettingPost } from "./qbo-import-setting.model";
import { QBOImportSettingModel } from "./qbo-import-setting.model";
import type { QBOAdvancedSettingGet, QBOAdvancedSettingPost } from "./qbo-advanced-setting.model";
import { QBOAdvancedSettingModel } from "./qbo-advanced-setting.model";
import type { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from "./qbo-employee-setting.model";
import { QBOEmployeeSettingModel } from "./qbo-employee-setting.model";

export interface QBOCloneSetting {
    workspace_id: number,
    export_settings: QBOExportSettingGet,
    import_settings: QBOImportSettingGet,
    advanced_configurations: QBOAdvancedSettingGet,
    employee_mappings: QBOEmployeeSettingGet
}

export interface QBOCloneSettingPost {
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
