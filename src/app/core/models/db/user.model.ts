export interface MinimalUser {
  email: string;
  access_token: string;
  refresh_token: string;
  full_name: string;
  user_id: string;
  org_id: string;
  org_name: string;
}

export interface User extends MinimalUser {
  active: boolean;
  admin: boolean;
  id: number;
  last_login: null;
  password: '';
  staff: boolean;
}
