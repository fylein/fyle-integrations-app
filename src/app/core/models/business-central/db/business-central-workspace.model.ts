import type { Workspace } from "../../db/workspaces.model";
import type { BusinessCentralOnboardingState } from "../../enum/enum.model";

export interface BusinessCentralWorkspace extends Workspace {
    business_central_currency: string,
    last_synced_at: Date,
    ccc_last_synced_at: Date,
    source_synced_at: Date,
    destination_synced_at: Date,
    business_central_accounts_last_synced_at: Date,
    onboarding_state: BusinessCentralOnboardingState,
    business_central_company_name: string,
    business_central_company_id: string
}

export interface BusinessCentralCompanyPost {
    company_id: string,
    company_name: string
}
