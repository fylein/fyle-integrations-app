export type FeatureConfiguration = {
    [brandingId: string]: {
        illustrationsAllowed: boolean;
        isGradientAllowed: boolean;
        exposeOnlyQBOApp: boolean;
        featureFlags: {
            cloneSettings: boolean;
            mapEmployees: boolean;
            exportSettings: {
                reimbursableExpenses: boolean;
                nameInJournalEntry: boolean;
            },
            importSettings: {
                tax: boolean;
            },
            advancedSettings: {
                autoCreateVendors: boolean;
                paymentsSync: boolean;
                singleCreditLineJE: boolean;
                emailNotification: boolean;
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
