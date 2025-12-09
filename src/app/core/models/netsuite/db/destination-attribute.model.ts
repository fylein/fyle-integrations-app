import { DestinationAttribute } from '../../db/destination-attribute.model';

type NetsuiteDestinationAttributeDetail = {
  country?: string;
};

export interface NetsuiteDestinationAttribute extends DestinationAttribute {
  detail: NetsuiteDestinationAttributeDetail;
}
