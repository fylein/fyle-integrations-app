import type { Workspace } from "../../db/workspaces.model";
import type { IntacctOnboardingState } from "../../enum/enum.model";

export interface IntacctWorkspace extends Workspace {
    last_synced_at: Date;
    ccc_last_synced_at: Date;
    source_synced_at: Date;
    cluster_domain: string;
    destination_synced_at: Date;
    onboarding_state: IntacctOnboardingState;
  }