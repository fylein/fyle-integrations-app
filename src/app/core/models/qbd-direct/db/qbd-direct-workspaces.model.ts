import { Workspace } from '../../db/workspaces.model';
import { QbdDirectOnboardingState } from '../../enum/enum.model';

export interface QbdDirectWorkspace extends Workspace {
  ticket_id: string;
  reimbursable_last_synced_at: Date;
  credit_card_last_synced_at: Date;
  source_synced_at: Date;
  onboarding_state: QbdDirectOnboardingState;
  fyle_currency: string;
}
