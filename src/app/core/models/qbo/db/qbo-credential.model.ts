export interface QBOCredential {
    id: number;
    refresh_token: string;
    is_expired: boolean;
    realm_id: string;
    country: string;
    company_name: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
}
