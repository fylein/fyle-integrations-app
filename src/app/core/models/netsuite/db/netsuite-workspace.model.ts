import { NetsuiteOnboardingState } from '../../enum/enum.model';
import { Workspace } from '../../db/workspaces.model';

export interface NetsuiteWorkspace extends Workspace {
  fyle_org_id: string;
  fyle_currency: string;
  cluster_domain: string;
  onboarding_state: NetsuiteOnboardingState;
  last_synced_at: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
}
