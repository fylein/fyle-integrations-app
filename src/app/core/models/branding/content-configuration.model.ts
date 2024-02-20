export type ContentConfiguration = {
    [brandingId: string]: {
        configuration: {
            exportSetting: {
                headerText: string;
                contentText: string;
                corporateCard: {
                    sectionLabel: string;
                    subLabel: string;
                    exportSubLabel: string;
                    defaultCCCAccountLabel: string;
                }
            }
        },
        dashboard: {},
        exportLog: {},
        mapping: {}
    }
}
    