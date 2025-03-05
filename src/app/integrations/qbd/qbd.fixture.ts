import { QBDOnboardingState } from "src/app/core/models/enum/enum.model";

export const workspaceResponse = {
    "id": 1,
    "name": "Anagha Org",
    "org_id": "orHVw3ikkCxJ",
    "currency": "EUR",
    "reimbursable_last_synced_at": null,
    "ccc_last_synced_at": null,
    "onboarding_state": QBDOnboardingState.EXPORT_SETTINGS,
    "created_at": "2023-01-23T05:37:56.907997Z",
    "updated_at": "2023-01-23T05:37:56.908051Z",
    "user": [1],
    "migrated_to_qbd_direct": false
  };

  export const errorResponse = {
    status: 404,
    statusText: "Not Found",
    error: {
      id: 1,
      is_expired: true,
      company_name: 'QBO'
    }
};