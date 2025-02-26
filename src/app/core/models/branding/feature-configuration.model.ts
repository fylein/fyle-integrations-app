export type FeatureConfiguration = {
    [brandingId: string]: {
        illustrationsAllowed: boolean;
        isGradientAllowed: boolean;
        isIconsInsideButtonAllowed: boolean;
        exposeC1Apps: boolean;
        isBackgroundColorAllowed: boolean;
        isAsterikAllowed: boolean;
        allowIntacctHelperDoc: boolean;
        showMoreDropdownInMainMenu: boolean;
        featureFlags: {
            cloneSettings: boolean;
            mapEmployees: boolean;
            exportSettings: {
                reimbursableExpenses: boolean;
                nameInJournalEntry: boolean;
                useMerchantInJournalLine: boolean;
                splitExpenseGrouping: boolean;
            },
            importSettings: {
                tax: boolean;
                importVendorsAsMerchants: boolean;
                importNetsuiteEmployees: boolean;
                importItems: boolean;
                importProjects: boolean;
                allowCustomSegment: boolean;
                dependentField: boolean;
                allowImportCode: boolean;
            },
            advancedSettings: {
                autoCreateVendors: boolean;
                paymentsSync: boolean;
                singleCreditLineJE: boolean;
                emailNotification: boolean;
                skipExport: boolean;
                defaultFields: boolean;
                autoCreateContacts: boolean;
                useEmployeeAttributes: boolean;
                autoCreateMerchants: boolean;
            },
            exportLog: {
                expenseType: boolean;
            },
            mappings: {
                employeeMapping: boolean;
            },
            dashboard: {
                disconnectButton: boolean;
            }
        }
    }
}
