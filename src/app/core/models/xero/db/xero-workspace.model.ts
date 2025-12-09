import { Workspace } from '../../db/workspaces.model';
import { XeroOnboardingState } from '../../enum/enum.model';

export interface XeroWorkspace extends Workspace {
  onboarding_state: XeroOnboardingState;
  fyle_currency: string;
  xero_currency: string;
  fyle_org_id: string;
  xero_short_code: string;
  last_synced_at?: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
}
