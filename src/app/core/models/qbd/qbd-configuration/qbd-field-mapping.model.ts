import { FormGroup } from "@angular/forms";

export type QBDFieldMappingGet = {
    id: number,
    created_at: Date,
    updated_at: Date,
    class_type: string | null,
    project_type: string | null,
    item_type: string | null,
    custom_fields: string[],
    workspace: number
}

export type QBDFieldMappingPost = {
    class_type: string | null,
    project_type: string | null,
    item_type: string | null
}

export class FieldMappingModel {
  static constructPayload(fieldMappingForm: FormGroup): QBDFieldMappingPost {
    const fieldMappingPayload: QBDFieldMappingPost = {
      class_type: fieldMappingForm.get('classType')?.value ? fieldMappingForm.get('classType')?.value : null,
      project_type: fieldMappingForm.get('customerType')?.value ? fieldMappingForm.get('customerType')?.value : null,
      item_type: fieldMappingForm.get('itemType')?.value ? fieldMappingForm.get('itemType')?.value : null
    };
    return fieldMappingPayload;
  }
}