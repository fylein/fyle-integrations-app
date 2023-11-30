import { Workspace } from "../../db/workspaces.model";
import { BusinessCentralOnboardingState } from "../../enum/enum.model";

export interface BusinessCentralWorkspace extends Workspace {
    business_central_currency: string,
    last_synced_at: Date,
    ccc_last_synced_at: Date,
    source_synced_at: Date,
    destination_synced_at: Date,
    business_central_accounts_last_synced_at: Date,
    onboarding_state: BusinessCentralOnboardingState
}