import type { User } from "../db/user.model";

export interface Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ClusterDomainWithToken {
  cluster_domain: string;
  tokens: Token;
}
