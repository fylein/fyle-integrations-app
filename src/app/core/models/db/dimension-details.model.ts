import { PaginatedResponse } from './paginated-response.model';

export type DimensionDetail = {
  id: number;
  attribute_type: string;
  display_name: string;
  source_type: string;
  created_at: string;
  updated_at: string;
  workspace: number;
};

export interface PaginatedDimensionDetails extends PaginatedResponse {
  results: DimensionDetail[];
}
