import type { Org } from "../../models/org/org.model";

export const orgMockData: Org = {
    id: 1,
    name: 'Fyle',
    user: [1],
    fyle_org_id: 'org_1',
    managed_user_id: '1',
    cluster_domain: 'fyle',
    is_bamboo_connector: true,
    is_fyle_connected: true,
    is_sendgrid_connected: true,
    allow_travelperk: true,
    created_at: new Date(),
    updated_at: new Date(),
    allow_dynamics: true
};

export const generateTokenData = {
    token: 'widget_token_comes_here'
};
