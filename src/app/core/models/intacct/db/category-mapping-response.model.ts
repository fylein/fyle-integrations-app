import { CategoryMappingResult } from './category-mapping.model';

export type CategoryMappingsResponse = {
  count: number;
  next: string;
  previous: string;
  results: CategoryMappingResult[];
};
