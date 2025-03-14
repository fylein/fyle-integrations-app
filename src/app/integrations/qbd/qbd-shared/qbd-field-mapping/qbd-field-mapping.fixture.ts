import { QBDFieldMappingGet } from "src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model";


export const QBDFieldMappingResponse: QBDFieldMappingGet = {
    id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      class_type: "CLASS",
      project_type: "PROJECT",
      item_type: 'Anish',
      custom_fields: ['anish'],
      workspace: 1
};

export const QBDFieldMappingResponse2: QBDFieldMappingGet = {
    id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      class_type: null,
      project_type: null,
      item_type: 'Anishh',
      custom_fields: ['anishh'],
      workspace: 1
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