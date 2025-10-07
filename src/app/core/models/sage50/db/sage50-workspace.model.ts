import { Sage50OnboardingState } from "../../enum/enum.model";
import { Workspace } from "../../db/workspaces.model";

export interface Sage50Workspace extends Workspace {
    onboarding_state: Sage50OnboardingState
    org_settings: {
        enabled_payment_modes: ("CREDIT_CARD" | "REIMBURSABLE")[]
    }
}
