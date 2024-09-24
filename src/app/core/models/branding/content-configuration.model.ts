export type ContentConfiguration = {
    [brandingId: string]: {
        qbd_direct: {
            landing: {
                contentText: string;
                guideHeaderText: string;
            },
            configuration: {
                connector: {
                    stepName: string;
                    subLabel: string;
                    configurationHeaderText: string;
                    configurationSubHeaderText: string;
                },
                exportSetting: {
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    reimbursable: {
                        reimbursableExpenseLabel: string;
                        reimbursableExpenseSubLabel: string;
                        reimbursableExpenseTypeLabel: string;
                        reimbursableExpenseTypeSubLabel: string;
                        reimbursableExpenseStateLabel: string;
                        reimbursableExpenseStateSubLabel: string;
                        reimbursableExpenseDateLabel: string;
                        reimbursableExpenseDateSubLabel:string;
                        reimbursableExpenseGroupLabel: string;
                        reimbursableExpenseGroupSubLabel: string;
                    },
                    corporateCard: {
                        creditCardExpenseLabel: string;
                        creditCardExpenseSubLabel: string;
                        creditCardExpenseTypeLabel: string;
                        creditCardExpenseTypeSubLabel: string;
                        creditCardExpenseStateLabel: string;
                        creditCardExpenseStateSubLabel: string;
                        creditCardExpenseDateLabel: string;
                        creditCardExpenseDateSubLabel: string;
                        creditCardExpenseGroupLabel: string;
                        creditCardExpenseGroupSubLabel: string;
                        creditCardExpenseSplitLabel: string;
                        creditCardExpenseSplitSubLabel: string;
                    }
                },
                importSetting: {
                    importVendorsAsMerchantsLabel: string;
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    importCategoriesLabel: string;
                    importCategoriesSubLabel: string;
                    importCustomersLabel: string;
                    importCustomersSubLabel: string;
                    importProjectsLabel: string;
                    importItemsLabel: string;
                    taxCodeLabel: string;
                    taxCodeSubLabel: string;
                    defaultTaxCodeLabel: string;
                    importSuppliersAsMerchantsLabel: string;
                    importSuppliersAsMerchantsSubLabel: string;
                    notes: string,
                    importNetsuiteEmployeesLabel: string;
                    importNetsuiteEmployeesSubLabel: string;
                    toggleToastMessage: string,
                    customSegmentHeader: string;
                },
                advancedSettings: {
                    stepName: string;
                    contentText: string;
                    automationLabel: string;
                    automationSubLabel: string;
                    customizeSectionLabel: string;
                    customizeSectionSubLabel: string;
                    scheduleAutoExportLabel: string;
                    scheduleAutoExportSubLabel: string;
                    autoExportfrequencyLabel: string;
                    autoExportfrequencySubLabel: string;
                    topLevelMemoStructureLabel: string;
                    topLevelMemoStructureSubLabel: string;
                    memoStructureLabel: string;
                    memoStructureSubLabel: string;
                    previewDescriptionFieldLabel: string;
                }
            },
        },
        netsuite: {
            landing: {
                contentText: string;
                guideHeaderText: string;
            },
            configuration: {
                connector: {
                    stepName: string;
                    subLabel: string;
                    configurationHeaderText: string;
                    configurationSubHeaderText: string;
                },
                exportSetting: {
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    corporateCard: {
                        creditCardExpenseLabel: string;
                        cccExpenseBankAccountSubLabel: string;
                        creditCardExportTypeSubLabel: string;
                        expenseState: string;
                        creditCardExpenseSubLabel: string;
                        cccExpenseStateSubLabel: string;
                        creditCardExpenseStateSubLabel: string;
                        creditCardExpenseStateLabel: string;
                        defaultCCCVendorLabel: string;
                        defaultCCCAccountLabel: string;
                        defaultCCCAccountPlaceholder: string;
                        journalOptionLabel: string;
                        journalOptionSubLabel: string;
                        defaultDebitCardAccountLabel: string;
                        defaultDebitCardAccountPlaceholder: string;
                        accountsPayableLabel: string
                    }
                },
                importSetting: {
                    importVendorsAsMerchantsLabel: string;
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    importCategoriesLabel: string;
                    importCategoriesSubLabel: string;
                    importCustomersLabel: string;
                    importCustomersSubLabel: string;
                    importProjectsLabel: string;
                    importItemsLabel: string;
                    taxCodeLabel: string;
                    taxCodeSubLabel: string;
                    defaultTaxCodeLabel: string;
                    importSuppliersAsMerchantsLabel: string;
                    importSuppliersAsMerchantsSubLabel: string;
                    notes: string,
                    importNetsuiteEmployeesLabel: string;
                    importNetsuiteEmployeesSubLabel: string;
                    toggleToastMessage: string,
                    customSegmentHeader: string;
                },
                advancedSettings: {
                    memoStructureSubLabel: string;
                    preferenceLabel: string;
                    preferenceSubLabel: string;
                    frequencySubLabel: string;
                    automationSubLabel: string;
                    customizationSubLabel: string;
                    defaultPaymentAccount: string;
                    memoStructureLabel: string;
                    stepName: string;
                    contentText: string;
                    scheduleAutoExport: string;
                    email: string;
                    paymentSyncLabel: string;
                    postEntriesCurrentPeriod: string;
                    autoCreateMerchantsAsVendorsLabel: string;
                    billPaymentAccountLabel: string;
                    billPaymentAccountSubLabel: string;
                    autoCreateVendorsLabel: string;
                    dfvSubLabel: string;
                    dfvLabel: string;
                    changeAccountingPeriodSubLabel: string;
                    scheduleSubLabel: string;
                    previewDescriptionFieldLabel: string;
                    autoCreateMerchantsLabel: string;
                }
            },
        },
        xero: {
            landing: {
                contentText: string;
                guideHeaderText: string;
            },
            configuration: {
                connector: {
                    stepName: string;
                    subLabel: string;
                    configurationHeaderText: string;
                    configurationSubHeaderText: string;
                },
                exportSetting: {
                    cccExpenseStateLabel: string;
                    stepSubLabel: string;
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    corporateCard: {
                        cccExpenseBankAccountSubLabel: string;
                        creditCardExportTypeSubLabel: string;
                        expenseState: string;
                        creditCardExpenseSubLabel: string;
                        cccExpenseStateSubLabel: string;
                        cccExpenseBankAccountLabel: string;
                    }
                },
                importSetting: {
                    chartOfAccountsSubLabel: string;
                    chartOfAccountsLabel: string;
                    stepName: string;
                    headerText: string;
                    contentText: string;
                    importCategoriesLabel: string;
                    importCategoriesSubLabel: string;
                    importCustomersLabel: string;
                    importCustomersSubLabel: string;
                    taxCodeLabel: string;
                    taxCodeSubLabel: string;
                    defaultTaxCodeLabel: string;
                    importSuppliersAsMerchantsLabel: string;
                    importSuppliersAsMerchantsSubLabel: string;
                    notes: string,
                    toggleToastMessage: string
                },
                advancedSettings: {
                    contentText: string;
                    stepName: string;
                    scheduleAutoExport: string;
                    email: string;
                    paymentSyncLabel: string;
                    postEntriesCurrentPeriod: string;
                    autoCreateMerchantsAsVendorsLabel: string;
                    billPaymentAccountLabel: string;
                    billPaymentAccountSubLabel: string;
                    autoCreateVendorsLabel: string;
                    customPreferencesLabel: string;
                    customPreferencesSubLabel: string;
                    automationSubLabel: string;
                    scheduleSubLabel: string;
                    accountingPeriodSubLabel: string;
                    autoCreateVendorsSubLabel: string;
                    frequencySubLabel: string;
                }
            },
        },
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
                    locationSubLabel: string
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
                    frequencySubLabel: string;
                    stepName: string;
                    contentText: string;
                    scheduleAutoExport: string;
                    email: string;
                    autoSyncPayments: string;
                    defaultPaymentAccount: string;
                    autoCreateEmployeeVendor: string;
                    autoCreateMerchantsAsVendorsLabel: string;
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
                    automationSubLabel: string;
                    scheduleSubLabel: string;
                    accountingPeriodSubLabel: string;
                    memoStructureSubLabel: string;
                    customizeSectionSubLabel: string;
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
                    defaultCCCVendorSubLabel: string;
                    accountsPayableLabel: string;
                    accountsPayableSubLabel: string;
                    creditCardExpenseSubLabel: string;
                    creditCardExpenseLabel: string;
                    creditCardExportTypeSubLabel: string;
                    journalOptionLabel: string;
                    journalOptionSubLabel: string;
                    creditCardExportGroupSubLabel: string;
                }
            },
            importSetting: {
                stepName: string;
                headerText: string;
                contentText: string;
                importCategoriesLabel: string;
                importCategoriesSubLabel: string;
                chartOfAccountTypes: string;
                chartOfAccountTypesSubLabel: string;
                importItemsLabel: string;
                importItemsSubLabel: string;
                taxCodeLabel: string;
                taxCodeSubLabel: string;
                defaultTaxCodeLabel: string;
                importVendorsAsMerchantsLabel: string;
            },
            advancedSettings: {
                stepName: string;
                contentText: string;
                automationSubLabel: string;
                scheduleSubLabel: string;
                frequencySubLabel: string;
                otherPreferencesLabel: string;
                otherPreferencesSubLabel: string;
                accountingPeriodLabel: string;
                accountingPeriodSubLabel: string;
                customizeSectionSubLAbel: string;
                autoCreateVendorsLabel: string;
                paymentSyncLabel: string;
                customizationSubLabel: string;
                autoCreateMerchantsAsVendorsLabel: string;
                autoCreateMerchantsAsVendorsSubLabel: string;
                singleCreditLineJELabel: string;
                singleCreditLineJESubLabel: string;
                billPaymentAccountLabel: string;
                billPaymentAccountSubLabel: string;
                memoStructureLabel: string;
                memoStructureSubLabel: string;
                previewDescriptionFieldLabel: string;
            },
            done: {
                ctaText: string;
                hintText: string;
                doneHeaderText: string;
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
            exportLogHeader: string;
            exportLogSubHeader: string;
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
            employeeMappingToastText: string;
            categoryMappingToastText: string;
            mappingToastText: string;
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
            currentDate: string;
        },
    }
}
