export type IntegrationField = {
    attribute_type: string,
    display_name: string
}

export type FyleField = {
    attribute_type: string,
    display_name: string,
    is_dependent?: boolean
}

export type MappingsResponse = {
    count: number,
    next: string,
    previous: string,
    results: IntegrationField[] | FyleField[]
}