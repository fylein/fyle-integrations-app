import { FormGroup } from "@angular/forms";
import { MappingSetting } from "../../db/mapping-setting.model";
import { QBOExportSettingGet, QBOExportSettingPost } from "./qbo-export-setting.model";
import { QBOImportSettingGet, QBOImportSettingPost } from "./qbo-import-setting.model";
import { QBOAdvancedSettingGet, QBOAdvancedSettingPost } from "./qbo-advanced-setting.model";
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from "./qbo-employee-setting.model";

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
    // static constructPayload(cloneSettingsForm: FormGroup, customMappingSettings: MappingSetting[]): QBOCloneSettingPost {

        // const exportSettingPayload = QBOExportSettingModel.constructPayload(cloneSettingsForm);
        // const importSettingPayload = QBOImportSettingModel.constructPayload(cloneSettingsForm, customMappingSettings);
        // const advancedSettingPayload = QBOAdvancedSettingModel.constructPayload(cloneSettingsForm);
        // const employeeMappingPayload = QBOEmployeeSettingModel.constructPayload(cloneSettingsForm);

        // const cloneSettingPayload: QBOCloneSettingPost = {
        //     export_settings: exportSettingPayload,
        //     import_settings: importSettingPayload,
        //     advanced_configurations: advancedSettingPayload,
        //     employee_mappings: employeeMappingPayload
        // };

        // return cloneSettingPayload;
    // }
}
