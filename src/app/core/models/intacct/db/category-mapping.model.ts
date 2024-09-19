import type { ExpenseAttributeDetail } from "./expense-attribute-detail.model";
import type { MappingDestination } from "./mapping-destination.model";
import type { MappingSource } from "./mapping-source.model";


export interface CategoryMappingPost {
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

export interface CategoryMappingResult {
  id: number;
  categorymapping: CategoryMapping[];
  attribute_type?: string;
  display_name?: string;
  value?: string;
  source_id?: number;
  auto_mapped?: boolean;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  detail?: ExpenseAttributeDetail;
}
