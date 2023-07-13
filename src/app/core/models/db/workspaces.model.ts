import { IntacctOnboardingState } from "../enum/enum.model";


export type Workspace = {
  id: number;
  name: string;
  user: number[];
  org_id: string;
  currency: string;
  reimbursable_last_synced_at: Date | null;
  ccc_last_synced_at: Date | null;
  onboarding_state: IntacctOnboardingState;
  created_at: Date;
  updated_at: Date;
}