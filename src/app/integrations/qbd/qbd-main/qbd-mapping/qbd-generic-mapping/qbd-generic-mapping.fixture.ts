import { Mapping, MappingPost, MappingResponse, MappingStats } from "src/app/core/models/qbd/db/mapping.model";

export const getMappingResponse: MappingResponse = {
    "count": 16,
    "next": "http://localhost:8008/api/workspaces/4/qbd_mappings/?attribute_type=CORPORATE_CARD&limit=10&offset=10",
    "previous": "null",
    "results": [
        {
          "id": 59,
          "attribute_type": "CORPORATE_CARD",
          "source_value": "Bank of America - 1319",
          "source_id": "baccK5ssSzxv1g",
          "destination_value": "eefs",
          "created_at": new Date("2023-09-01T08:32:40.176736Z"),
          "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
          "workspace": 4
        },
        {
          "id": 61,
          "attribute_type": "CORPORATE_CARD",
          "source_value": "American Express - 58057",
          "source_id": "baccsWbRJpSbnB",
          "destination_value": null,
          "created_at": new Date("2023-09-01T08:32:40.176736Z"),
          "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
          "workspace": 4
        },
        {
          "id": 62,
          "attribute_type": "CORPORATE_CARD",
          "source_value": "American Express - 83167",
          "source_id": "baccAGZQWkwSnZ",
          "destination_value": null,
          "created_at": new Date("2023-09-01T08:32:40.176736Z"),
          "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
          "workspace": 4
        }
    ]
};

export const getMappingStatsResponse: MappingStats = {
    "all_attributes_count": 16,
    "unmapped_attributes_count": 12
};

export const postMappingResponse: Mapping = {
    "id": 59,
    "attribute_type": "CORPORATE_CARD",
    "source_value": "Bank of America - 1319",
    "source_id": "baccK5ssSzxv1g",
    "destination_value": "eefw",
    "created_at": new Date("2023-09-01T08:32:40.176736Z"),
    "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
    "workspace": 4
};

export const postMappingPayload: MappingPost = {
    attribute_type: "CORPORATE_CARD",
    destination_value: "eefw",
    source_id: "baccK5ssSzxv1g",
    source_value: "Bank of America - 1319"
};
