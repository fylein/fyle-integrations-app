import type { DestinationAttributeDetail } from "./destination-attribute-detail.model";

export interface MappingDestination {
  id?: number | null;
  attribute_type?: string;
  display_name?: string;
  value?: string;
  destination_id?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  detail?: DestinationAttributeDetail;
}
