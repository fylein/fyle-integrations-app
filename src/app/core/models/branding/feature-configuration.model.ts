export type FeatureConfiguration = {
    [brandingId: string]: {
        illustrationsAllowed: boolean;
        isGradientAllowed: boolean;
        isIconsInsideButtonAllowed: boolean;
        exposeC1Apps: boolean;
        isBackgroundColorAllowed: boolean;
        isAsterikAllowed: boolean;
        locationEntityLoader: boolean;
        featureFlags: {
            cloneSettings: boolean;
            mapEmployees: boolean;
            exportSettings: {
                reimbursableExpenses: boolean;
                nameInJournalEntry: boolean;
                useMerchantInJournalLine: boolean;
            },
            importSettings: {
                tax: boolean;
                importVendorsAsMerchants: boolean;
            },
            advancedSettings: {
                autoCreateVendors: boolean;
                paymentsSync: boolean;
                singleCreditLineJE: boolean;
                emailNotification: boolean;
                skipExport: boolean;
            },
            exportLog: {
                expenseType: boolean;
            },
            mappings: {
                employeeMapping: boolean;
            }
        }
    }
}
