const importSettings = {

    "import_categories": false,
    "import_vendors_as_merchants": false,
    "mapping_settings": [
      {
          "source_field": "COST_CENTER",
          "destination_field": "CLASS",
          "import_to_fyle": false,
          "is_custom": false,
          "source_placeholder": null
      },
      {
          "source_field": "PROJECT",
          "destination_field": "PROJECT",
          "import_to_fyle": false,
          "is_custom": false,
          "source_placeholder": null
      }
  ],
    "dependent_field_settings": {
          "cost_code_field_name": "Sage Cost COde",
          "cost_code_placeholder": null,
          "cost_category_field_name": "Sage Cost Type",
          "cost_category_placeholder": null,
          "is_import_enabled": true
      },
    "workspace_id": 313
  };
export const importSettingsResponse = [
    importSettings,
    [
        {
            "attribute_type": "COST_CENTER",
            "display_name": "Cost Center"
        },
        {
            "attribute_type": "PROJECT",
            "display_name": "Project"
        },
        {
            "attribute_type": "CLASS",
            "display_name": "Class"
        }
    ],
    [
        {
            "attribute_type": "COST_CENTER",
            "display_name": "Cost Center"
        },
        {
            "attribute_type": "PROJECT",
            "display_name": "Project"
        },
        {
            "attribute_type": "CLASS",
            "display_name": "Class"
        }
    ]
];