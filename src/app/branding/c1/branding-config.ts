import { BrandingConfiguration } from "../../core/models/branding/branding-configuration.model";
import { DemoVideo } from "../../core/models/branding/demo-video.model";
import { FeatureConfiguration } from "../../core/models/branding/feature-configuration.model";
import { KbArticle } from "../../core/models/branding/kb-article.model";
import config from '../config.json';

const brandingConfig = config as BrandingConfiguration;

export const c1FeatureConfig: FeatureConfiguration[string] = {
    illustrationsAllowed: false,
    isGradientAllowed: false,
    isIconsInsideButtonAllowed: false,
    exposeC1Apps: true,
    isBackgroundColorAllowed: true,
    isAsterikAllowed: false,
    allowIntacctHelperDoc: false,
    showMoreDropdownInMainMenu: false,
    loginRedirectUri: true,
    loginToAllConnectedApps: false,
    hasAssistedSetupSupport: false,
    isDashboardButtonOutlined: false,
    shouldShowOnboardingYouTubeVideo: true,
    shouldShowXeroPreviewImage: true,
    disableTextColorWhenChecked: false,
    footerButtonsRightAligned: true,
    useMainMenuForSubmenu: true,
    usePrimaryLoader: true,
    qbdDirect: {
        showStepStateAsIcons: true,
        showStepStateDivider: true,
        isStepSectionAlwaysVisible: true,
        configToggleLeftAligned: true,
        unlockStepsInOrder: true
    },
    featureFlags: {
        cloneSettings: false,
        mapEmployees: false,
        showOptionalTextInsteadOfAsterisk: true,
        useCustomIcon: true,
        displayAppLogoInDashboard: true,
        contentVersion: 'v2',
        useLandingV2: false,
        exportSettings: {
            reimbursableExpenses: false,
            nameInJournalEntry: false,
            useMerchantInJournalLine: false,
            splitExpenseGrouping: false,
            isEmployeeMappingFixed: true,
            isReimbursableExpensesAllowed: false
        },
        importSettings: {
            tax: false,
            importVendorsAsMerchants: false,
            importNetsuiteEmployees: true,
            importItems: true,
            importProjects: true,
            allowCustomSegment: false,
            dependentField: true,
            allowImportCode: false,
            importSettingsV1: false,
            disableCustomerSourceField: true
        },
        advancedSettings: {
            autoCreateVendors: false,
            paymentsSync: false,
            singleCreditLineJE: false,
            emailNotification: false,
            defaultFields: false,
            skipExport: false,
            autoCreateContacts: false,
            useEmployeeAttributes: true,
            autoCreateMerchants: true,
            excludeCardNumberAndEmployeeNameInMemo: true,
            showTopLevelMemoFieldInIntacct: false
        },
        exportLog: {
            expenseType: false
        },
        mappings: {
            employeeMapping: false,
            allowExpandableSearch: true
        },
        dashboard: {
            disconnectButton: false,
            useRepurposedExportSummary: false
        }
    }
};

export const c1KbArticles: KbArticle[string] = {
    topLevelArticles: {
        BAMBOO_HR: `${brandingConfig.helpArticleDomain}/en/articles/6845034-fyle-bamboo-hr-integration`,
        QBD: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
        QBO: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`,
        INTACCT: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration`,
        NETSUITE: `${brandingConfig.helpArticleDomain}/en/articles/9330230-onboarding-process-to-set-up-netsuite-integration`,
        TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
        SAGE300: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration`,
        BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
        XERO: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration`,
        QBD_DIRECT: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
        // TODO: update link
        SAGE50: `${brandingConfig.helpArticleDomain}`
    },
    onboardingArticles: {
        INTACCT: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_78e1747002`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_eebe5df4b7`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_498f2acc61`,
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/9081356-generate-credentials-to-connect-with-sage-intacct`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration`
        },
        NETSUITE: {
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/9471329-generate-credentials-to-connect-with-netsuite`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9330230-onboarding-process-to-set-up-netsuite-integration#h_cca32ec1be`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/een/articles/9330230-onboarding-process-to-set-up-netsuite-integration#h_c18c533ca1`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9330230-onboarding-process-to-set-up-netsuite-integration#h_b394546a8c`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
        },
        SAGE300: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration#h_e68fbd43da`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration#h_6af02b6d29`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration#h_87c335593a`,
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/9144068-how-to-skip-exports-in-sage-300-cre`,
            DEPENDANT_FIELD: `${brandingConfig.helpArticleDomain}/en/articles/9144059-how-to-set-up-dependant-fields-in-sage-300-cre`,
            COMMITMENT_FIELD: `${brandingConfig.helpArticleDomain}/en/articles/9144059-how-to-set-up-dependant-fields-in-sage-300-cre#h_5981f2ce79`
        },
        QBO: {
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration#h_6c60e48783`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration#h_faf3a93ed6`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration#h_fe18937876`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`
        },
        BUSINESS_CENTRAL: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c`,
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
        },
        TRAVELPERK: {
            PAYMENT_PROFILE_SETTINGS: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_0f8ebdfa10',
            ADVANCED_SETTING: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_281acb3026',
            LANDING: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration'
        },
        // TODO
        XERO: {
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration#h_9b4570099f`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration#h_0f42f8bf02`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration#h_19858cad25`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9361876-set-up-the-expense-management-xero-integration#h_dab5b9668c`
        },
        QBD_DIRECT: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_78e1747002`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_eebe5df4b7`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration#h_498f2acc61`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta#h_d3cc42849a`,
            ASSISTED_SETUP_ARTICLE_LINK: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration`,
            HELPER_ARTICLE: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`,
            GCAL_LINK: `https://calendar.app.google/xRwaKsiwEYukqigx9`
        },
        SAGE50: {
            // TODO
            LANDING: `${brandingConfig.helpArticleDomain}`,
            EXPORT_SETTINGS: `${brandingConfig.helpArticleDomain}`,
            IMPORT_SETTINGS: `${brandingConfig.helpArticleDomain}`,
            ADVANCED_SETTINGS: `${brandingConfig.helpArticleDomain}`
        }
    }
};

export const c1DemoVideoLinks: DemoVideo[string] = {
    onboarding: {
        INTACCT: 'https://www.youtube.com/embed/EQ8hRadkOic',
        // TODO: Update link for Sage 300
        SAGE300: 'https://www.youtube.com/embed/2oYdc8KcQnk',
        QBO: 'https://www.youtube.com/embed/TcL8ketSvbM',
        // TODO: Update link for MS Dynamics
        BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
        TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
        XERO: 'https://www.youtube.com/embed/KeiegWDj308',
        NETSUITE: 'https://www.youtube.com/embed/e3X3TtjxrHk',
        QBD_DIRECT: 'https://www.youtube.com/embed/e3X3TtjxrHk',
        // TODO: Update link for Sage 50
        SAGE50: 'https://www.youtube.com/embed/2oYdc8KcQnk'
    }
};
