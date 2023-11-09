import { DestinationAttribute } from "./destination-attribute.model";
import { ExpenseAttribute } from "./expense-attribute.model";

export type GenericMappingPost = {
    source_type: string;
    source_value: string;
    destination_type: string;
    destination_id: string;
    destination_value: string;
  };
  
  export interface GenericMapping {
    created_at: Date;
    destination: DestinationAttribute;
    destination_type: string;
    id: number;
    source: ExpenseAttribute;
    source_type: string,
    updated_at: Date;
    workspace: number;
  }