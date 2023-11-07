import { MappingDestination } from "./mapping-destination.model";
import { MappingSource } from "./mapping-source.model";
import { MappingResult } from "./mapping.model";

export type CategoryMappingPost = {
  source_category: MappingSource;
  destination_account?: MappingDestination;
  destination_expense_head?: MappingDestination;
  created_at?: Date;
  updated_at?: Date;
  workspace: number;
}

export interface CategoryMapping extends CategoryMappingPost {
  id: number;
}

export interface CategoryMappingResult extends MappingResult {
  categorymapping: CategoryMapping;
}