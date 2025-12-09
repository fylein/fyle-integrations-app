export type NetsuiteCredential = {
  id: number;
  ns_account_id: string;
  ns_consumer_key: string;
  ns_consumer_secret: string;
  ns_token_id: string;
  ns_token_secret: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
