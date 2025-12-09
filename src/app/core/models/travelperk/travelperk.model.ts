import { Org } from 'src/app/core/models/org/org.model';
import { FyleField, TravelPerkExpenseGroup, TravelPerkOnboardingState, TravelPerkUserRole } from '../enum/enum.model';

export type Travelperk = {
  id: number;
  folder_id: string;
  package_id: string;
  is_fyle_connected: boolean;
  is_travelperk_connected: boolean;
  is_s3_connected: boolean;
  org: number;
  travelperk_connection_id: number;
  onboarding_state: TravelPerkOnboardingState;
  created_at: Date;
  updated_at: Date;
};

export type TravelperkConfiguration = {
  id: number;
  org: Org;
  recipe_id: string;
  recipe_data: string;
  is_recipe_enabled: boolean;
};

export type WorkatoConnectionStatus = {
  wk: boolean;
  type: string;
  payload: {
    id: number;
    provider: string;
    connected?: boolean;
    error?: string;
  };
};

export type TravelperkDestinationAttribuite = {
  id: number;
  attribute_type: FyleField;
  value: string;
  active: boolean;
  detail: null;
  created_at: Date;
  updated_at: Date;
  source_id: string;
  auto_created: boolean;
  org: number;
};
