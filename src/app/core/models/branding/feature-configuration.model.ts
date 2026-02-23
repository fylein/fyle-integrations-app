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
        shouldShowOnboardingYouTubeVideo: boolean,
        shouldShowXeroPreviewImage: boolean,
        disableTextColorWhenChecked: boolean,
        footerButtonsRightAligned: boolean,
        useMainMenuForSubmenu: boolean,
        usePrimaryLoader: boolean,
        allowToastMessageInApps: boolean,
        shouldShowInfoLabelInDashboard: boolean,
        qbdDirect: {
            showStepStateAsIcons: boolean,
            showStepStateDivider: boolean,
            isStepSectionAlwaysVisible: boolean,
            configToggleLeftAligned: boolean,
            unlockStepsInOrder: boolean,
            showMarkAsDone: boolean,
            showSubIconsInConfigurationFields: boolean,
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
                shouldShowExpenseTypeInAccountingErrorDashboard: boolean;
                showTextOnlyForButtonsInDashboardErrorSection: boolean;
                showDashboardErrorSectionHeader: boolean;
            }
        }
    }
}
