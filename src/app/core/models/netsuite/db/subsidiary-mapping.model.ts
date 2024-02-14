export type SubsidiaryMapping = {
    id?: number;
    subsidiary_name: string;
    country_name: string | null;
    internal_id: string;
    created_at?: Date;
    updated_at?: Date;
    workspace: number;
};
