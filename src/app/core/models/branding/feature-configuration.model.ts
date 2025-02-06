export type FeatureConfiguration = {
    [brandingId: string]: {
        illustrationsAllowed: boolean;
        isGradientAllowed: boolean;
        isIconsInsideButtonAllowed: boolean;
        exposeC1Apps: boolean;
        isBackgroundColorAllowed: boolean;
        isAsterikAllowed: boolean;
        allowIntacctHelperDoc: boolean;
        loginRedirectUri: boolean;
        featureFlags: {
            cloneSettings: boolean;
            mapEmployees: boolean;
            c1Icon: boolean;
            c1Options: boolean;
            allowForC1: boolean;
            exportSettings: {
                reimbursableExpenses: boolean;
                nameInJournalEntry: boolean;
                useMerchantInJournalLine: boolean;
                splitExpenseGrouping: boolean;
                cccDateConfiguration: boolean;
                cccExportGroupConfiguration: boolean;
                isEmployeeMappingIsEmployee: boolean;
                sentenseCaseConversion: boolean;
                lowerCaseConversion: boolean;
                allowAccountsPayableInCoCCC: boolean;
                allowBankAccountInCoCCC: boolean;
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
                categoryImportEnabled: boolean;
                intacctC1ImportSettings: boolean;
                disableCustomerSourceField: boolean;
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
                excludeCardNumberAndEmployeeNameInMemo: boolean;
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
