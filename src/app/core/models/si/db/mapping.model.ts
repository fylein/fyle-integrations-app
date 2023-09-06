
import { DestinationAttribute } from "../../db/destination-attribute.model";
import { FyleField, MappingState, SageIntacctField } from "../../enum/enum.model";
import { Error } from "./error.model";
import { ExpenseAttribute, ExtendedExpenseAttribute } from "./expense-attribute.model";
import { MinimalMappingSetting } from "./mapping-setting.model";

export type MappingPost = {
  source_type: string;
  source_value: string;
  destination_type: string;
  destination_id: string;
  destination_value: string;
};

export interface Mapping extends MappingPost {
  id: number;
  source: ExpenseAttribute;
  destination: DestinationAttribute;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export type MappingResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExtendedExpenseAttribute[];
};

export type MappingList = {
  fyle: {
    id: number;
    value: string;
  };
  intacct: {
    id: number | string;
    value: string;
  };
  preserveDestination?: {
    id: number | string;
  }
  autoMapped: boolean;
  state: MappingState;
  index: number;
};

export type MappingStats = {
  all_attributes_count: number;
  unmapped_attributes_count: number;
};

export type ResolveMappingError = {
  sourceType: FyleField;
  destinationType: SageIntacctField | FyleField;
  fyleAttributes: Error[];
  workspaceId: string;
};

export class MappingModel {
  static constructPayload(mappingSetting: MinimalMappingSetting, mappingRow: MappingList): MappingPost {
    return {
      source_type: mappingSetting.source_field,
      source_value: mappingRow.fyle.value,
      destination_type: mappingSetting.destination_field,
      destination_id: mappingRow.intacct.id.toString(),
      destination_value: mappingRow.intacct.value
    };
  }
}
