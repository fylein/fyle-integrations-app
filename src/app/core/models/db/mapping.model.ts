import type { MappingState } from "../enum/enum.model";

export interface MappingPrimaryKey {
    id: number | null
}

export interface IntegrationField {
    attribute_type: string,
    display_name: string
}

export interface FyleField {
    attribute_type: string,
    display_name: string,
    is_dependent: boolean
}

export interface MappingStats {
    all_attributes_count: number;
    unmapped_attributes_count: number;
}

export interface GenericMappingApiParams {
    limit: number;
    offset: number;
    mapped: boolean | MappingState;
    destination_type: string;
    mapping_source_alphabets?: string
    source_type: string;
    value?: string
}
