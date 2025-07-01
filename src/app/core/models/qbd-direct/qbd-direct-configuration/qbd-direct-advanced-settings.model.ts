import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EmailOption } from "../../common/advanced-settings.model";
import { brandingFeatureConfig } from "src/app/branding/branding-config";
import { AdvancedSettingsService } from "src/app/core/services/common/advanced-settings.service";

export type QbdDirectAdvancedSettingsPost = {
    line_level_memo_structure: string[],
    top_level_memo_structure: string[] | null,
    schedule_is_enabled: boolean,
    emails_selected: EmailOption[],
    emails_added: EmailOption[],
    interval_hours: number,
    auto_create_merchant_as_vendor: boolean
    auto_create_reimbursable_entity: boolean,
    is_real_time_export_enabled: boolean
}

export interface QbdDirectAdvancedSettingsGet extends QbdDirectAdvancedSettingsPost {
    id: number,
    created_at: Date,
    updated_at: Date,
    workspace_id: number
}

