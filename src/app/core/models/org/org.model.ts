export type Org = {
    id: number;
    name: string;
    user: number[];
    fyle_org_id: string;
    managed_user_id: string;
    cluster_domain: string;
    is_bamboo_connector: boolean;
    is_fyle_connected: boolean;
    is_sendgrid_connected: boolean;
    is_org_rebranded: boolean;
    allow_travelperk: boolean;
    allow_dynamics: boolean;
    allow_qbd_direct_integration: boolean;
    created_at: Date;
    updated_at: Date;
}

export type GeneratedToken = {
    token: string
}
