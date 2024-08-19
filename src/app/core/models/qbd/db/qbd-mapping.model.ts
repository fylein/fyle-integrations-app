export type MappingPost = {
  attribute_type: string;
  source_value: string;
  source_id: string;
  destination_value: string | null;
};

export interface Mapping extends MappingPost {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export type MappingResponse = {
  count: number;
  next: string;
  previous: string;
  results: Mapping[];
};

export type MappingStats = {
  all_attributes_count: number;
  unmapped_attributes_count: number;
};

export class MappingModel {
  static constructPayload(mapping: Mapping): MappingPost {
    return {
      attribute_type: mapping.attribute_type,
      source_value: mapping.source_value,
      source_id: mapping.source_id.toString(),
      destination_value: mapping.destination_value
    };
  }
}
