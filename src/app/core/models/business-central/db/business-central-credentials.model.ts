import { BusinessCentralWorkspace } from "./business-central-workspace.model";

export type BusinessCentralCredential = {
    id: number;
    refresh_token: string;
    is_expired: boolean;
    country: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
}

export interface BusinessCentralCompanyDetails extends BusinessCentralWorkspace {
    business_central_company: string;
}