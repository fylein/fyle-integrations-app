import { Workspace } from "../../db/workspaces.model";
import { QBDOnboardingState } from "../../enum/enum.model";

export interface QBDWorkspace extends Workspace {
  reimbursable_last_synced_at: Date | null;
  ccc_last_synced_at: Date | null;
  onboarding_state: QBDOnboardingState;
}