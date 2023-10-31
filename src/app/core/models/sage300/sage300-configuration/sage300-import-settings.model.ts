export type Sage300ImportSettingPost = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    mapping_settings: [],
    dependent_field_settings: null
}

export type Sage300ImportSettingGet = {
    import_categories: boolean,
    import_vendors_as_merchants: boolean,
    mapping_settings: [],
    dependent_field_settings: null,
    workspaceId: number
}