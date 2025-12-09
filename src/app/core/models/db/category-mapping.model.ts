import { DestinationAttribute } from './destination-attribute.model';
import { ExpenseAttribute } from './expense-attribute.model';
import { MappingPrimaryKey } from './mapping.model';

export type CategoryMappingPost = {
  source_category: MappingPrimaryKey;
  destination_account: MappingPrimaryKey;
  destination_expense_head: MappingPrimaryKey;
  workspace: number;
};

export interface CategoryMapping {
  id: number;
  created_at: Date;
  destination_account: DestinationAttribute;
  destination_expense_head: DestinationAttribute;
  source_category: ExpenseAttribute;
  updated_at: Date;
  workspace: number;
}
