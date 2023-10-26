export type EmployeeMappingDetail = {
    email: string | null;
}

export type Sage300DestinationAttributes = {
    id?: number | null;
    attribute_type?: string;
    display_name?: string;
    value?: string;
    destination_id?: string;
    auto_created?: boolean;
    active?: boolean | null;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
    detail?: EmployeeMappingDetail | null;
}