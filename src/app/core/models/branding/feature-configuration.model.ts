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
        loginRedirectUri: boolean;
        loginToAllConnectedApps: boolean;
        hasAssistedSetupSupport: boolean;
        isDashboardButtonOutlined: boolean;
        isPrimengLoaderEnabled: boolean;
        shouldShowOnboardingYouTubeVideo: boolean,
        disableTextColorWhenChecked: boolean,
        qbd_direct: {
            showStepStateAsIcons: boolean,
            showStepStateDivider: boolean,
            isStepSectionAlwaysVisible: boolean,
        },
        featureFlags: {
            showOptionalTextInsteadOfAsterisk: boolean;
            cloneSettings: boolean;
            mapEmployees: boolean;
            useCustomIcon: boolean;
            displayAppLogoInDashboard: boolean;
            contentVersion: string;
            useLandingV2: boolean;
            exportSettings: {
                isReimbursableExpensesAllowed: boolean;
                reimbursableExpenses: boolean;
                nameInJournalEntry: boolean;
                useMerchantInJournalLine: boolean;
                splitExpenseGrouping: boolean;
                isEmployeeMappingFixed: boolean;
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
                importSettingsV1: boolean;
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
                showTopLevelMemoFieldInIntacct: boolean;
            },
            exportLog: {
                expenseType: boolean;
            },
            mappings: {
                employeeMapping: boolean;
                allowExpandableSearch: boolean;
            },
            dashboard: {
                disconnectButton: boolean;
                useRepurposedExportSummary: boolean;
            }
        }
    }
}
