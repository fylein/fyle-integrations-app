export type ContentConfiguration = {
    [brandingId: string]: {
        configuration: {
            exportSetting: {
                stepName: string;
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
                stepName: string;
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
            },
            advancedSettings: {
                stepName: string;
                autoCreateVendorsLabel: string;
                paymentSyncLabel: string;
                customizationSubLabel: string;
                autoCreateMerchantsAsVendorsLabel: string;
                singleCreditLineJELabel: string;
                singleCreditLineJESubLabel: string;
                billPaymentAccountLabel: string;
                billPaymentAccountSubLabel: string;
            },
            done: {
                ctaText: string;
                hintText: string;
            }
        },
        dashboard: {
            exportHeaderFirstTimeZeroStateText: string;
            exportHeaderZeroStateText: string;
            lastExportSuccessText: string;
            lastExportFailedText: string;
            lastExportedAtText: string;
            nextExportAtText: string;
            integrationErrorHeader: string;
            employeeMappingErrorText: string;
            categoryMappingErrorText: string;
            qboErrorText: string;
            qboErrorDialogHeaderText: string;
        },
        exportLog: {
            tableHeaders: {
                expenseID: string;
                employee: string;
                expenseType: string;
                dateTime: string;
                exportedAs: string;
                exportSkippedOn: string;
            },
            searchPlaceholder: string;
            dateRangeLabel: string;
        },
        mapping: {
            filterPlaceholder: string;
        },
        landing: {
            contentText: string;
            guideHeaderText: string;
        },
        common: {
            readMoreText: string;
            exportLogTabName: string;
            viewExpenseText: string;
            corporateCard: string;
            errors: string;
            autoMap: string;
        }
    }
}
