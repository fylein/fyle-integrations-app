import { User } from '../db/user.model';

export type Token = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: User;
};

export type ClusterDomainWithToken = {
  cluster_domain: string;
  tokens: Token;
};
