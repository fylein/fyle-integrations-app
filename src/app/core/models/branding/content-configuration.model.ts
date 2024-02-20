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
                    journalOptionLabel: string;
                    journalOptionSubLabel: string;
                }
            }
        },
        dashboard: {},
        exportLog: {},
        mapping: {}
    }
}
