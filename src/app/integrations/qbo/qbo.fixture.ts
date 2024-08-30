import { MinimalUser } from "src/app/core/models/db/user.model";
import { QBOOnboardingState } from "src/app/core/models/enum/enum.model";

export const mockUser: MinimalUser = {
    org_id: '123',
    email: 'test@example.com',
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    full_name: 'Test User',
    user_id: 'user123',
    org_name: 'Test Org'
  };
  
export const mockWorkspace = {
id: '1',
onboarding_state: QBOOnboardingState.CONNECTION
};

export const mockWorkspaces = [mockWorkspace];