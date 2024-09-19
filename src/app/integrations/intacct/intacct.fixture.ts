import { IntacctOnboardingState } from "src/app/core/models/enum/enum.model";
import type { IntacctWorkspace } from "src/app/core/models/intacct/db/workspaces.model";

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