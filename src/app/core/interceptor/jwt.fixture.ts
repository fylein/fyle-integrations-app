import { MinimalUser } from '../models/db/user.model';
import { Token } from '../models/misc/token.model';

export const tokenResponse = {
  access_token: 'fylee',
  expires_in: 3600,
  refresh_token: 'ffff',
  token_type: 'Bearer',
};

export const loginResponse: Token = {
  access_token: '',
  expires_in: 3600,
  refresh_token: 'ffff',
  token_type: 'Bearer',
  user: {
    access_token: '',
    email: 'ashwin.t@fyle.in',
    full_name: 'Joanna',
    org_id: 'orHVw3ikkCxJ',
    org_name: 'Anagha Org',
    refresh_token: 'y.y.y',
    user_id: 'usqywo0f3nBY',
    active: true,
    admin: true,
    id: 1,
    last_login: null,
    password: '',
    staff: true,
  },
};

export const dummyErrorResponse = {
  status: 401,
  statusText: 'Login Failed',
  error: {
    message: 'Reason for failure . . .',
  },
};

export const minimalUser: MinimalUser = {
  access_token: 'x.x.x',
  email: 'ashwin.t@fyle.in',
  full_name: 'Joanna',
  org_id: 'orHVw3ikkCxJ',
  org_name: 'Anagha Org',
  refresh_token: 'y.y.y',
  user_id: 'usqywo0f3nBY',
};
