export type Workspace = {
  id: number;
  name: string;
  user: number[];
  org_id: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface IntacctWorkspace extends Workspace {
  last_synced_at: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  cluster_domain: string;
  destination_synced_at: Date;
}
