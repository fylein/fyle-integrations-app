import { BrandingConfiguration } from "../../core/models/branding/branding-configuration.model";
import { DemoVideo } from "../../core/models/branding/demo-video.model";
import { FeatureConfiguration } from "../../core/models/branding/feature-configuration.model";
import { KbArticle } from "../../core/models/branding/kb-article.model";
import config from '../config.json';

const brandingConfig = config as BrandingConfiguration;

export const fyleFeatureConfig: FeatureConfiguration[string] = {
    illustrationsAllowed: true,
    isGradientAllowed: false,
    isIconsInsideButtonAllowed: true,
    exposeC1Apps: false,
    isBackgroundColorAllowed: false,
    isAsterikAllowed: true,
    allowIntacctHelperDoc: true,
    showMoreDropdownInMainMenu: true,
    loginRedirectUri: false,
    loginToAllConnectedApps: true,
    hasAssistedSetupSupport: true,
    isDashboardButtonOutlined: true,
    shouldShowXeroPreviewImage: true,
    shouldShowOnboardingYouTubeVideo: true,
    disableTextColorWhenChecked: true,
    footerButtonsRightAligned: false,
    useMainMenuForSubmenu: false,
    usePrimaryLoader: false,
    allowToastMessageInApps: true,
    shouldShowInfoLabelInDashboard: true,
    qbdDirect: {
        showStepStateAsIcons: false,
        showStepStateDivider: false,
        isStepSectionAlwaysVisible: false,
        configToggleLeftAligned: false,
        unlockStepsInOrder: false,
        showMarkAsDone: true,
        showSubIconsInConfigurationFields: true
    },
    featureFlags: {
        cloneSettings: true,
        mapEmployees: true,
        showOptionalTextInsteadOfAsterisk: false,
        useCustomIcon: false,
        displayAppLogoInDashboard: false,
        contentVersion: 'v1',
        useLandingV2: true,
        exportSettings: {
            reimbursableExpenses: true,
            nameInJournalEntry: true,
            useMerchantInJournalLine: true,
            splitExpenseGrouping: true,
            isEmployeeMappingFixed: false,
            isReimbursableExpensesAllowed: true
        },
        importSettings: {
            tax: true,
            importVendorsAsMerchants: true,
            importNetsuiteEmployees: true,
            importItems: true,
            importProjects: true,
            allowCustomSegment: true,
            dependentField: true,
            importSettingsV1: true,
            disableCustomerSourceField: false
        },
        advancedSettings: {
            autoCreateVendors: true,
            paymentsSync: true,
            singleCreditLineJE: true,
            emailNotification: true,
            defaultFields: true,
            skipExport: true,
            autoCreateContacts: true,
            useEmployeeAttributes: true,
            autoCreateMerchants: true,
            excludeCardNumberAndEmployeeNameInMemo: false,
            showTopLevelMemoFieldInIntacct: true
        },
        exportLog: {
            expenseType: true
        },
        mappings: {
            employeeMapping: true,
            allowExpandableSearch: true
        },
        dashboard: {
            disconnectButton: true,
            shouldShowExpenseTypeInAccountingErrorDashboard: true,
            showTextOnlyForButtonsInDashboardErrorSection: false,
            showDashboardErrorSectionHeader: true
        }
    }
};

export const fyleKbArticles: KbArticle[string] = {
    topLevelArticles: {
        BAMBOO_HR: `${brandingConfig.helpArticleDomain}/en/articles/6845034-fyle-bamboo-hr-integration`,
        QBD: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
        NETSUITE: `${brandingConfig.helpArticleDomain}/en/articles/9329439-onboarding-process-to-set-up-fyle-netsuite-integration`,
        QBO: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration`,
        INTACCT: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
        TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
        SAGE300: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration`,
        BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration`,
        XERO: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration`,
        QBD_DIRECT: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta`,
        SAGE50: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration`
    },
    onboardingArticles: {
        INTACCT: {
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-setting-up-sage-intacct-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/8394683-setting-up-sage-intacct-integration#h_eedea087a8`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-setting-up-sage-intacct-integration#h_4eaff6e237`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-setting-up-sage-intacct-integration#h_a75fae54f4`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-setting-up-sage-intacct-integration#h_2a81c02bd0`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`,
            DFV_READ_MORE: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`,
            DEFAULT_BILLABLE_FIELD_BASED_ON_PROJECT_READ_MORE: `${brandingConfig.helpArticleDomain}/en/articles/13671674-project-level-billable-defaults-with-sage-intacct`
        },
        NETSUITE: {
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/9329439-setting-up-netsuite-integration#h_c0fb09216c`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9329439-setting-up-netsuite-integration#h_b39c272fff`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9329439-setting-up-netsuite-integration#h_1ed0b1a285`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9329439-setting-up-netsuite-integration#h_d9e37228b7`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/6967005-how-to-skip-exporting-specific-expenses-from-fyle-to-netsuite.`,
            DFV_READ_MORE: `${brandingConfig.helpArticleDomain}/en/articles/6967005-how-to-skip-exporting-specific-expenses-from-fyle-to-netsuite.`
        },
        // TODO: Update KB articles for Sage 300
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
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration#h_c16cb2d4e7`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration#h_a3a395b35e`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration#h_decaf812af`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-setting-up-quickbooks-online-integration#h_86edf1cae2`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online`
        },
        BUSINESS_CENTRAL: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration#h_a2dcb23212`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration#h_aea6d1e402`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration#h_9e9b1c5196`,
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration`,
            SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
        },
        TRAVELPERK: {
            PAYMENT_PROFILE_SETTINGS: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_0f8ebdfa10',
            ADVANCED_SETTING: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_281acb3026',
            LANDING: 'https://www.fylehq.com/help/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration'
        },
        // TODO
        XERO: {
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration#h_138bed4f7d`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration#h_8faefa5953`,
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration#h_275fa52ac9`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-setting-up-xero-integration#h_1dcd9e64e5`
        },
        QBD_DIRECT: {
            IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta#h_a170c7d562`,
            EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta#h_1366df4107`,
            ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta#h_b3850646c0`,
            CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration-beta#h_d3cc42849a`,
            ASSISTED_SETUP_ARTICLE_LINK: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration`,
            HELPER_ARTICLE: `${brandingConfig.helpArticleDomain}/en/articles/10259583-quickbooks-desktop-integration#h_d3cc42849a`,
            GCAL_LINK: `https://calendar.app.google/xRwaKsiwEYukqigx9`,
            ERROR_RESOLUTION_GUIDE_LINK: `${brandingConfig.helpArticleDomain}/en/articles/12585819-quickbooks-web-connector-qbw-error-resolution-guide`
        },
        SAGE50: {
            LANDING: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration`,
            PREREQUISITES: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_43b1096421`,
            EXPORT_SETTINGS: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_9cf3ddddf4`,
            IMPORT_SETTINGS: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            ADVANCED_SETTINGS: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_fd96087cc5`
        }
    },
    postOnboardingArticles: {
        SAGE50: {
            JOB: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            PHASE: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            VENDOR: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            ACCOUNT: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            COST_CODE: `${brandingConfig.helpArticleDomain}/en/articles/12709905-sage-50-us-integration#h_174913515f`,
            EXPORT_LOG: `${brandingConfig.helpArticleDomain}/en/articles/12710101-how-to-export-expenses-from-sage-expense-management-to-sage-50-us#h_5309128026`
        }
    }
};

export const fyleDemoVideoLinks: DemoVideo[string] = {
    onboarding: {
        INTACCT: 'https://www.youtube.com/embed/x40f7X08KXM',
        SAGE300: 'https://www.youtube.com/embed/3P1eUe9uVdg',
        QBO: 'https://www.youtube.com/embed/HUwzAEQVgd4',
        // TODO: Update link for MS Dynamics
        BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
        TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
        XERO: 'https://www.youtube.com/embed/61DoD8Zpu_U',
        NETSUITE: 'https://www.youtube.com/embed/5T9Fz7iUtIQ',
        QBD_DIRECT: 'https://www.youtube.com/embed/6KGhTU_OGes',
        SAGE50: 'https://www.youtube.com/embed/gexzZstip5o'
    },
    postOnboarding: {
        SAGE50: {
            JOB: 'https://www.youtube.com/embed/9eUud5qkMM0',
            PHASE: 'https://www.youtube.com/embed/9eUud5qkMM0',
            VENDOR: 'https://www.youtube.com/embed/uTwdpUlzM_Q',
            ACCOUNT: 'https://www.youtube.com/embed/zCehWmswR2U',
            COST_CODE: 'https://www.youtube.com/embed/9eUud5qkMM0',
            ERROR: 'https://www.youtube.com/embed/gZEr7iNQggM'
        }
    }
};
