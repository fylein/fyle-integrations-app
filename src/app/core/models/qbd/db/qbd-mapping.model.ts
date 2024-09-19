export interface QBDMappingPost {
  attribute_type: string;
  source_value: string;
  source_id: string;
  destination_value: string | null;
}

export interface QBDMapping extends QBDMappingPost {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface QBDMappingResponse {
  count: number;
  next: string;
  previous: string;
  results: QBDMapping[];
}

export interface QBDMappingStats {
  all_attributes_count: number;
  unmapped_attributes_count: number;
}

export class QBDMappingModel {
  static constructPayload(mapping: QBDMapping): QBDMappingPost {
    return {
      attribute_type: mapping.attribute_type,
      source_value: mapping.source_value,
      source_id: mapping.source_id.toString(),
      destination_value: mapping.destination_value
    };
  }
}
