import { DestinationAttribute, GroupedDestinationAttribute } from '../../db/destination-attribute.model';

export type DestinationAttributeDetail = {
  email: string;
  fully_qualified_name: string;
};

export interface XeroDestinationAttributes extends DestinationAttribute {
  auto_created: boolean;
  detail: DestinationAttributeDetail | null;
}
