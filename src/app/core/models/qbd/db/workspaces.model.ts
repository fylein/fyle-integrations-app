import { QBDOnboardingState } from "../../enum/enum.model";

export type Workspace = {
  id: number;
  name: string;
  user: number[];
  org_id: string;
  currency: string;
  reimbursable_last_synced_at: Date | null;
  ccc_last_synced_at: Date | null;
//   Onboarding_state: QBDOnboardingState;
  created_at: Date;
  updated_at: Date;
}