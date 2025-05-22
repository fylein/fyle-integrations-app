export type Workspace = {
  id: number;
  name: string;
  user: number[];
  org_id: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
  assisted_setup_requested_at?: Date;
}

export type WorkspaceOnboardingState = {
  onboarding_state: string;
}