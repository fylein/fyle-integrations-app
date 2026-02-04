import { OrgSettings } from "../../common/org-settings.model";
import { Workspace } from "../../db/workspaces.model";
import { IntacctOnboardingState } from "../../enum/enum.model";

export interface IntacctWorkspace extends Workspace {
    org_settings: OrgSettings;
    last_synced_at: Date;
    ccc_last_synced_at: Date;
    source_synced_at: Date;
    cluster_domain: string;
    destination_synced_at: Date;
    onboarding_state: IntacctOnboardingState;
}