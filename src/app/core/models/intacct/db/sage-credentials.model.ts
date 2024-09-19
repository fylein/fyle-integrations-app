export interface SageIntacctCredential {
    id?: number;
    si_user_id: string;
    si_company_id: string;
    si_company_name?: string;
    si_user_password: string;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
  }
