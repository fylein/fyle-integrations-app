import { Sage300OnboardingState } from '../../enum/enum.model';
import { Workspace } from '../../db/workspaces.model';

export interface Sage300Workspace extends Workspace {
  cluster_domain: string;
  last_synced_at: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  onboarding_state: Sage300OnboardingState;
}
