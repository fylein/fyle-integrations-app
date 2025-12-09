import {
  BambooHr,
  BambooHRConfiguration,
  BambooHRConfigurationPost,
  BambooHrConnection,
} from '../../models/bamboo-hr/bamboo-hr.model';

export const bambooHrMockData: BambooHr = {
  id: 1,
  org: 1,
  folder_id: '1',
  package_id: '1',
  api_token: 'xyz',
  sub_domain: 'fyle',
  created_at: new Date(),
  updated_at: new Date(),
};

export const bambooHrMockWithoutToken: BambooHr = {
  id: 1,
  org: 1,
  folder_id: '',
  package_id: '',
  api_token: '',
  sub_domain: '',
  created_at: new Date(),
  updated_at: new Date(),
};

export const bambooHRMockConnectionPayload: BambooHrConnection = {
  input: {
    api_token: 'xyz',
    subdomain: 'fyle',
  },
};

export const bambooHRMockConfiguration: BambooHRConfiguration = {
  id: 1,
  org: 1,
  recipe_id: '1',
  recipe_data: 'xyz',
  recipe_status: true,
  additional_email_options: [
    {
      email: 'ashwin.t+lolooi@fyle.in',
      name: 'Ashwin',
    },
  ],
  emails_selected: [
    {
      email: 'ashwin.t+lolooi@fyle.in',
      name: 'Ashwin',
    },
  ],
};

export const bambooHRMockConfigurationPayload: BambooHRConfigurationPost = {
  org: 1,
  additional_email_options: [
    {
      email: 'ashwin.t+lolooi@fyle.in',
      name: 'Ashwin',
    },
  ],
  emails_selected: [
    {
      email: 'ashwin.t+lolooi@fyle.in',
      name: 'Ashwin',
    },
  ],
};
