import { Org } from "../../models/org/org.model";

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
    created_at: new Date(),
    updated_at: new Date()
};

export const generateTokenData = {
    token: 'eyJ0eXAiOiJKV1Q;iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0N…ij-Z'
};
