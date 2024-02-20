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
                    defaultCCCVendorLabel: string;
                    accountsPayableLabel: string;
                    accountsPayableSubLabel: string;
                    creditCardExpenseSubLabel: string;
                    creditCardExportTypeSubLabel: string;
                    journalOptionLabel: string;
                    journalOptionSubLabel: string;
                }
            },
            importSetting: {
                headerText: string;
                contentText: string;
                importCategoriesLabel: string;
                importCategoriesSubLabel: string;
                importItemsLabel: string;
                importItemsSubLabel: string;
                taxCodeLabel: string;
                taxCodeSubLabel: string;
                defaultTaxCodeLabel: string;
                importVendorsAsMerchantsLabel: string;
            }
        },
        dashboard: {},
        exportLog: {},
        mapping: {}
    }
}
