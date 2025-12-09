export type NetsuiteConnector = {
  ns_account_id: string;
  ns_token_id: string;
  ns_token_secret: string;
};

export interface NetsuiteConnectorGet extends NetsuiteConnector {
  workspace_id: number;
  created_at: Date;
  updated_at: Date;
  id: number;
}

export interface NetsuiteConnectorPost extends NetsuiteConnector {}

export type NetsuiteSubsidiaryMappingPost = {
  country_name: string | null;
  internal_id: string;
  subsidiary_name: string;
  workspace: number;
};
