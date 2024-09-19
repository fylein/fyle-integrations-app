import type { CategoryMappingResult } from "./category-mapping.model";

export interface CategoryMappingsResponse {
  count: number;
  next: string;
  previous: string;
  results: CategoryMappingResult[];
}
