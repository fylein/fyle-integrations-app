import { TravelPerkOnboardingState } from '../../models/enum/enum.model';
import { Travelperk, TravelperkConfiguration, WorkatoConnectionStatus } from '../../models/travelperk/travelperk.model';
import { orgMockData } from '../org/org.fixture';

export const travelperkMockData: Travelperk = {
  id: 1,
  folder_id: '1234',
  package_id: '467',
  is_travelperk_connected: true,
  is_fyle_connected: true,
  is_s3_connected: true,
  org: 1,
  travelperk_connection_id: 123,
  created_at: new Date(),
  updated_at: new Date(),
  onboarding_state: TravelPerkOnboardingState.CONNECTION,
};

export const connectTravelperkMockData = {
  message: {
    connection_id: '123',
  },
  managed_user_id: 234,
};

export const connectAwsS3MockData = {
  application: 'rest',
  id: 22,
  name: 'S3 Connection',
  description: null,
  authorized_at: new Date(),
  authorization_status: 'success',
  authorization_error: null,
  created_at: new Date(),
  updated_at: new Date(),
  external_id: null,
  folder_id: 12,
  parent_id: null,
};

export const travelperkErrorMockData = {
  message: 'Travelperk Not Found',
};

export const travelperkConfigurationMockData: TravelperkConfiguration = {
  id: 1,
  org: orgMockData,
  recipe_id: '123',
  recipe_data: '123',
  is_recipe_enabled: true,
};

export const workatoConnectionStatusMockData: WorkatoConnectionStatus = {
  wk: true,
  type: 'travelperk',
  payload: {
    id: 1,
    provider: 'travelperk',
    connected: false,
  },
};
