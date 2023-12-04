export type BusinessCentralCredential = {
    id: number;
    refresh_token: string;
    is_expired: boolean;
    country: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
}