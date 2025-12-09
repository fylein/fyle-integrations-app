import { DestinationAttribute } from '../../db/destination-attribute.model';

/* Tslint:disable */
export type TenantMapping = {
  id: number;
  tenant_name: string;
  tenant_id: string;
  connection_id: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};

export type TenantMappingPost = {
  tenant_id: string;
  tenant_name: string;
};

export class TenantMappingModel {
  static constructPayload(tenantMapping: DestinationAttribute): TenantMappingPost {
    return {
      tenant_id: tenantMapping.destination_id.toString(),
      tenant_name: tenantMapping.value,
    };
  }
}
