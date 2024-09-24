import { minimalUser } from "src/app/core/interceptor/jwt.fixture";
import { MinimalUser } from "src/app/core/models/db/user.model";
import { IntacctOnboardingState, TaskLogState, TaskLogType } from "src/app/core/models/enum/enum.model";
import { IntacctWorkspace } from "src/app/core/models/intacct/db/workspaces.model";

export const workspaceResponse: IntacctWorkspace[] = [{
    "id": 1,
    "name": "Halo Org",
    "org_id": "orHVw3iaexgg",
    "currency": "EUR",
    "destination_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "ccc_last_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "onboarding_state": IntacctOnboardingState.CONNECTION,
    "created_at": new Date("2023-06-23T05:37:56.907997Z"),
    "updated_at": new Date("2023-06-23T05:37:56.907997Z"),
    "user": [1],
    "last_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "source_synced_at": new Date("2023-06-23T05:37:56.907997Z"),
    "cluster_domain": 'string'
  }];

  export const errorResponse = {
    status: 404,
    statusText: "Not Found",
    error: {
      id: 1,
      is_expired: true,
      company_name: 'Halo MasterChief'
    }
};

export const mockUser: MinimalUser = {
  ...minimalUser,
  org_id: 'mock org id'
};

export const testOnboardingState: {[k in IntacctOnboardingState]: string} =  {
  [IntacctOnboardingState.CONNECTION]: '/integrations/intacct/onboarding/landing',
  [IntacctOnboardingState.LOCATION_ENTITY]: '/integrations/intacct/onboarding/connector',
  [IntacctOnboardingState.EXPORT_SETTINGS]: '/integrations/intacct/onboarding/export_settings',
  [IntacctOnboardingState.IMPORT_SETTINGS]: '/integrations/intacct/onboarding/import_settings',
  [IntacctOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/intacct/onboarding/advanced_settings',
  [IntacctOnboardingState.COMPLETE]: '/integrations/intacct/main/dashboard'
};

export const mockTasksInProgress = {
  results: [
    { status: TaskLogState.COMPLETE, type: TaskLogType.CREATING_BILLS, expense_group: 1 },
    { status: TaskLogState.IN_PROGRESS, type: TaskLogType.CREATING_BILLS, expense_group: 2 }
  ]
};


export const mockCompletedTasks = {
  results: [
    { status: TaskLogState.COMPLETE, type: TaskLogType.CREATING_BILLS, expense_group: 1 },
    { status: TaskLogState.COMPLETE, type: TaskLogType.CREATING_BILLS, expense_group: 2 }
  ]
};
