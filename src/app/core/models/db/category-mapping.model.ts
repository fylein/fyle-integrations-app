
import { DestinationAttributeDetail } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";
import { MappingResult } from "./mapping.model";

export type CategoryMappingPost = {
  source_category: ExpenseAttribute;
  destination_account?: DestinationAttributeDetail;
  destination_expense_head?: DestinationAttributeDetail;
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