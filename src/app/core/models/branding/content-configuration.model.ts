export type ContentConfiguration = {
    [brandingId: string]: {
        intacct : {
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
                customField: string;
                customFieldName: string;
                customFieldPlaceholderName: string;
                customFieldType: string;
                customFieldCreateandSave: string;
                userId: string;
                companyId: string;
                userPassword: string;
                password: string;
                locationEntity: string;
                descriptionText: string;
            },
            configuration: {
                connector: {
                    stepName: string;
                    subLabel: string;
                },
                exportSetting: {
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    corporateCard: {
                        cccExpensePaymentType: string;
                        cccExpensePaymentTypeSubLabel: string;
                        creditCardVendor: string;
                        creditCardVendorSublabel: string;
                        chargeCard: string;
                        chargeCardPlaceholder: string;
                        chargeCardSublabel: string;
                        cccExpenseState: string;
                        cccExportGroup: string;
                        employeeFieldMapping: string;
                        creditCard: string;
                        creditCardSubLabel: string;
                    }
                },
                advancedSettings: {
                    stepName: string;
                    scheduleAutoExport: string;
                    email: string;
                    autoSyncPayments: string;
                    defaultPaymentAccount: string;
                    autoCreateEmployeeVendor: string;
                    postEntriesCurrentPeriod: string;
                    setDescriptionField: string;
                    dfvLabel: string;
                    dfvSubLabel: string;
                    location: string;
                    department: string;
                    project: string;
                    class: string;
                    item: string;
                    customPreferencesLabel: string;
                    customPreferencesSubLabel: string;
                },
                done: {
                    ctaText: string;
                    hintText: string;
                }
            },
        }
        configuration: {
            connector: {
                stepName: string;
            },
            employeeSetting: {
                stepName: string;
            },
            exportSetting: {
                stepName: string;
                headerText: string;
                contentText: string;
                corporateCard: {
                    expenseState: string;
                    sectionLabel: string;
                    subLabel: string;
                    exportSubLabel: string;
                    defaultCCCAccountLabel: string;
                    defaultCCCAccountPlaceholder: string;
                    defaultDebitCardAccountLabel: string;
                    defaultDebitCardAccountPlaceholder: string;
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
                memoStructureLabel: string;
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
            customField: string;
            customFieldName: string;
            customFieldPlaceholderName: string;
            customFieldType: string;
            customFieldCreateandSave: string;
        }
    }
}
