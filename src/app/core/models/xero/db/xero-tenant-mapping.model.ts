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
}
