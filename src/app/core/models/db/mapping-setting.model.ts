import type { PaginatedResponse } from "./paginated-response.model";

export interface MappingSetting {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  source_field: string;
  destination_field: string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null
}

export interface MappingSettingResponse extends PaginatedResponse {
  results: MappingSetting[];
}
