import { disconnect } from 'process';
import { BrandingConfiguration } from '../core/models/branding/branding-configuration.model';
import { ContentConfiguration } from '../core/models/branding/content-configuration.model';
import { DemoVideo } from '../core/models/branding/demo-video.model';
import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import { c1Contents } from './c1-contents-config';
import config from './config.json';
import { fyleContents } from './fyle-contents-config';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

const featureConfigs: FeatureConfiguration = {
    fyle: {
        illustrationsAllowed: true,
        isGradientAllowed: true,
        isIconsInsideButtonAllowed: true,
        exposeC1Apps: false,
        isBackgroundColorAllowed: false,
        isAsterikAllowed: true,
        allowIntacctHelperDoc: true,
        featureFlags: {
            cloneSettings: true,
            mapEmployees: true,
            exportSettings: {
                reimbursableExpenses: true,
                nameInJournalEntry: true,
                useMerchantInJournalLine: true
            },
            importSettings: {
                tax: true,
                importVendorsAsMerchants: true,
                importNetsuiteEmployees: true,
                importItems: true,
                importProjects: true,
                allowCustomSegment: true
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
                autoCreateMerchants: true
            },
            exportLog: {
                expenseType: true
            },
            mappings: {
                employeeMapping: true
            },
            dashboard: {
                disconnectButton: true
            }
        }
    },
    co: {
        illustrationsAllowed: false,
        isGradientAllowed: false,
        isIconsInsideButtonAllowed: false,
        exposeC1Apps: true,
        isBackgroundColorAllowed: true,
        isAsterikAllowed: false,
        allowIntacctHelperDoc: false,
        featureFlags: {
            cloneSettings: false,
            mapEmployees: false,
            exportSettings: {
                reimbursableExpenses: false,
                nameInJournalEntry: false,
                useMerchantInJournalLine: false
            },
            importSettings: {
                tax: false,
                importVendorsAsMerchants: false,
                importNetsuiteEmployees: true,
                importItems: true,
                importProjects: true,
                allowCustomSegment: false
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
                autoCreateMerchants: true
            },
            exportLog: {
                expenseType: false
            },
            mappings: {
                employeeMapping: false
            },
            dashboard: {
                disconnectButton: false
            }
        }
    }
};

// @ts-ignore
export const brandingFeatureConfig = featureConfigs[brandingConfig.brandId];

const kbArticles: KbArticle = {
    fyle: {
        topLevelArticles: {
            BAMBOO_HR: `${brandingConfig.helpArticleDomain}/en/articles/6845034-fyle-bamboo-hr-integration`,
            QBD: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
            NETSUITE: `${brandingConfig.helpArticleDomain}/en/articles/4424242-fyle-netsuite-integration`,
            QBO: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
            INTACCT: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
            SAGE300: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration`,
            BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration`,
            XERO: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration`
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c`,
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_38e0c9bea6`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
            },
            NETSUITE: {
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
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
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_dca1353686`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_b8a2df129f`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7`,
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
                PAYMENT_PROFILE_SETTINGS: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_0f8ebdfa10',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_281acb3026',
                LANDING: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration'
            },
            // TODO
            XERO: {
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_e3ade308dc`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_ad07470d98`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_04d289fd42`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_d95b791edd`
            }
        }
    },
    co: {
        topLevelArticles: {
            BAMBOO_HR: `${brandingConfig.helpArticleDomain}/en/articles/6845034-fyle-bamboo-hr-integration`,
            QBD: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
            QBO: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`,
            INTACCT: `${brandingConfig.helpArticleDomain}/en/articles/9082146-configure-the-capital-one-sage-intacct-integration`,
            NETSUITE: `${brandingConfig.helpArticleDomain}/en/articles/4424242-fyle-netsuite-integration`,
            TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
            SAGE300: `${brandingConfig.helpArticleDomain}/en/articles/8948413-how-to-set-up-the-fyle-sage-300-cre-integration`,
            BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            XERO: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`
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
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
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
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/9054778-configure-capital-one-quickbooks-online-integration`,
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
                PAYMENT_PROFILE_SETTINGS: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_0f8ebdfa10',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration#h_281acb3026',
                LANDING: 'https://help.fylehq.com/en/articles/7193187-how-to-set-up-the-fyle-travelperk-integration'
            },
            // TODO
            XERO: {
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_e3ade308dc`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_ad07470d98`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_04d289fd42`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration#h_d95b791edd`
            }
        }
    }
};

// @ts-ignore
export const brandingKbArticles = kbArticles[brandingConfig.brandId];

const demoVideoLinks: DemoVideo = {
    fyle: {
        onboarding: {
            INTACCT: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            SAGE300: 'https://www.youtube.com/embed/KTJ6IF271bc',
            QBO: 'https://www.youtube.com/embed/b63lS2DG5j4',
            // TODO: Update link for MS Dynamics
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            XERO: 'https://www.youtube.com/embed/IplJd7tGWBk',
            NETSUITE: 'https://www.youtube.com/embed/IplJd7tGWBk'
        }
    },
    co: {
        onboarding: {
            INTACCT: 'https://www.youtube.com/embed/EQ8hRadkOic',
            // TODO: Update link for Sage 300
            SAGE300: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            QBO: 'https://www.youtube.com/embed/TcL8ketSvbM',
            // TODO: Update link for MS Dynamics
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            XERO: 'https://www.youtube.com/embed/IplJd7tGWBk',
            NETSUITE: 'https://www.youtube.com/embed/IplJd7tGWBk'
        }
    }
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];


const content: ContentConfiguration = {
    fyle: fyleContents,
    co: c1Contents
};

// @ts-ignore
export const brandingContent = content[brandingConfig.brandId];

