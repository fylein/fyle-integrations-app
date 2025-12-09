import { QBOOnboardingState } from '../../enum/enum.model';
import { Workspace } from '../../db/workspaces.model';

export interface QBOWorkspace extends Workspace {
  fyle_org_id: string;
  fyle_currency: string;
  qbo_realm_id: string;
  cluster_domain: string;
  onboarding_state: QBOOnboardingState;
  last_synced_at: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
}
