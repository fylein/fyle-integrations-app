import { NetsuiteDestinationAttribute } from './destination-attribute.model';
import { NetsuiteSubsidiaryMappingPost } from '../netsuite-configuration/netsuite-connector.model';

export type SubsidiaryMapping = {
  id?: number;
  subsidiary_name: string;
  country_name: string | null;
  internal_id: string;
  created_at?: Date;
  updated_at?: Date;
  workspace: number;
};

export class NetsuiteSubsidiaryMappingModel {
  static constructPayload(
    netsuiteSubsidiaryId: any,
    subsidiaries: NetsuiteDestinationAttribute[],
    workspaceId: number,
  ): NetsuiteSubsidiaryMappingPost {
    const filteredSubsidiary = subsidiaries.filter((entity) => entity.destination_id === netsuiteSubsidiaryId);
    return {
      subsidiary_name: filteredSubsidiary[0].value,
      internal_id: filteredSubsidiary[0].destination_id,
      country_name: filteredSubsidiary[0].detail?.country ? filteredSubsidiary[0].detail.country : null,
      workspace: workspaceId,
    };
  }
}
