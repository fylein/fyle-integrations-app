import { BrandingConfiguration } from '../core/models/branding/branding-configuration.model';
import { ContentConfiguration } from '../core/models/branding/content-configuration.model';
import { DemoVideo } from '../core/models/branding/demo-video.model';
import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

const featureConfigs: FeatureConfiguration = {
    fyle: {
        illustrationsAllowed: true,
        isGradientAllowed: true,
        isIconsInsideButtonAllowed: true,
        exposeC1Apps: false,
        isBackgroundColorAllowed: false,
        isAsterikAllowed: true,
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
                importNetsuiteEmployees: true
            },
            advancedSettings: {
                autoCreateVendors: true,
                paymentsSync: true,
                singleCreditLineJE: true,
                emailNotification: true,
                defaultFields: true,
                skipExport: true,
                autoCreateContacts: true,
                useEmployeeAttributes: true
            },
            exportLog: {
                expenseType: true
            },
            mappings: {
                employeeMapping: true
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
                importNetsuiteEmployees: false
            },
            advancedSettings: {
                autoCreateVendors: false,
                paymentsSync: false,
                singleCreditLineJE: false,
                emailNotification: false,
                defaultFields: false,
                skipExport: false,
                autoCreateContacts: false,
                useEmployeeAttributes: false
            },
            exportLog: {
                expenseType: false
            },
            mappings: {
                employeeMapping: false
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
            XERO: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#xero-2-0`
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
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_e3ade308dc`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_ad07470d98`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_04d289fd42`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_d95b791edd`
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
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_e3ade308dc`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_ad07470d98`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_04d289fd42`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6721333-how-to-set-up-the-fyle-xero-integration-v2-0#h_d95b791edd`
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
            // TODO: Update link for Sage 300
            SAGE300: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            QBO: 'https://www.youtube.com/embed/b63lS2DG5j4',
            // TODO: Update link for MS Dynamics
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            XERO: 'https://www.youtube.com/embed/IplJd7tGWBk'
        }
    },
    co: {
        onboarding: {
            INTACCT: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            // TODO: Update link for Sage 300
            SAGE300: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            QBO: 'https://www.youtube.com/embed/b63lS2DG5j4',
            // TODO: Update link for MS Dynamics
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            TRAVELPERK: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            XERO: 'https://www.youtube.com/embed/IplJd7tGWBk'
        }
    }
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];


const content: ContentConfiguration = {
    fyle: {
        netsuite: {
            landing: {
                contentText: 'Import data from Netsuite to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Netsuite. ',
                guideHeaderText: 'Guide to setup your integrations'
            },
            common: {
                readMoreText: 'Read more',
                exportLogTabName: 'Export log',
                viewExpenseText: 'View expense',
                corporateCard: 'Corporate card',
                errors: 'errors',
                autoMap: 'Auto map',
                customField: 'Add new custom field',
                customFieldName: 'Field name',
                customFieldPlaceholderName: 'Placeholder name',
                customFieldType: 'Field type',
                customFieldCreateandSave: 'Create and save',
                tenantMapping: 'Tenant Mapping',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    configurationHeaderText: 'Connect to Netsuite Tenant',
                    configurationSubHeaderText: 'Connect to the Netsuite Tenant from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and Netsuite Tenant cannot be changed once the configuration steps are complete.',
                    stepName: 'Connect to Netsuite',
                    subLabel: 'Expenses will be posted to the Netsuite Tenant Mapping selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or Tenant Mapping.'
                },
                exportSetting: {
                    stepName: 'Export settings',
                    headerText: ' Export Corporate Card Expenses',
                    contentText: 'Enable this to export non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card</b> expenses will not be exported to Netsuite.',
                    corporateCard: {
                        cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Netsuite.',
                        creditCardExportTypeSubLabel: '',
                        expenseState: '',
                        creditCardExpenseSubLabel: '',
                        cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (Approved) or when the payment has been settled (Closed).'
                    }
                },
                importSetting: {
                    stepName: 'Import Settings',
                    headerText: '',
                    contentText: '',
                    importCategoriesLabel: 'Import the Chart of Accounts as Categories in ',
                    importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                    importCustomersLabel: 'Import Customers from Netsuite',
                    importCustomersSubLabel: 'The Customers in Netsuite will be imported as Projects in Fyle and will be a selectable field while creating an expense',
                    taxCodeLabel: 'Import Tax from Netsuite',
                    taxCodeSubLabel: 'The imported Tax codes from Netsuite will be set as Tax group in ',
                    defaultTaxCodeLabel: 'Select Default Tax Code',
                    importSuppliersAsMerchantsLabel: 'Import Suppliers from Netsuite as Merchants',
                    importSuppliersAsMerchantsSubLabel: 'The Suppliers in Netsuite will be imported as Merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                    notes: 'NOTE: To export billable expenses from Fyle, import Customers from Netsuite as Projects in Fyle.',
                    toggleToastMessage: 'You have already mapped a tracking category from Netsuite to the Project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import Customers in the Project field.'
                },
                advancedSettings: {
                    stepName: 'Advanced settings',
                    scheduleAutoExport: 'Schedule automatic export',
                    email: 'Send error notification to',
                    paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                    autoCreateVendorsLabel: 'Auto create Contacts',
                    autoCreateMerchantsAsVendorsLabel: 'Auto Create ' + brandingConfig.brandName + ' Merchants as Contacts on Netsuite',
                    billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                    billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                    postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                    autoCreateEmployeeVendor: 'Auto-create ',
                    dfvSubLabel: '',
                    dfvLabel: ''
                }
            }
        },
        xero: {
            landing: {
                contentText: 'Import data from Xero to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Xero. ',
                guideHeaderText: 'Guide to setup your integrations'
            },
            common: {
                readMoreText: 'Read more',
                exportLogTabName: 'Export log',
                viewExpenseText: 'View expense',
                corporateCard: 'Corporate card',
                errors: 'errors',
                autoMap: 'Auto map',
                customField: 'Add new custom field',
                customFieldName: 'Field name',
                customFieldPlaceholderName: 'Placeholder name',
                customFieldType: 'Field type',
                customFieldCreateandSave: 'Create and save',
                tenantMapping: 'Tenant Mapping',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    configurationHeaderText: 'Connect to Xero Tenant',
                    configurationSubHeaderText: 'Connect to the Xero Tenant from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and Xero Tenant cannot be changed once the configuration steps are complete.',
                    stepName: 'Connect to Xero',
                    subLabel: 'Expenses will be posted to the Xero Tenant Mapping selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or Tenant Mapping.'
                },
                exportSetting: {
                    stepName: 'Export settings',
                    headerText: ' Export Corporate Card Expenses',
                    contentText: 'Enable this to export non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card</b> expenses will not be exported to Xero.',
                    corporateCard: {
                        cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Xero.',
                        creditCardExportTypeSubLabel: '',
                        expenseState: '',
                        creditCardExpenseSubLabel: '',
                        cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (Approved) or when the payment has been settled (Closed).'
                    }
                },
                importSetting: {
                    stepName: 'Import Settings',
                    headerText: '',
                    contentText: '',
                    importCategoriesLabel: 'Import the Chart of Accounts as Categories in ',
                    importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                    importCustomersLabel: 'Import Customers from Xero',
                    importCustomersSubLabel: 'The Customers in Xero will be imported as Projects in Fyle and will be a selectable field while creating an expense',
                    taxCodeLabel: 'Import Tax from Xero',
                    taxCodeSubLabel: 'The imported Tax codes from Xero will be set as Tax group in ',
                    defaultTaxCodeLabel: 'Select Default Tax Code',
                    importSuppliersAsMerchantsLabel: 'Import Suppliers from Xero as Merchants',
                    importSuppliersAsMerchantsSubLabel: 'The Suppliers in Xero will be imported as Merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                    notes: 'NOTE: To export billable expenses from Fyle, import Customers from Xero as Projects in Fyle.',
                    toggleToastMessage: 'You have already mapped a tracking category from Xero to the Project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import Customers in the Project field.'
                },
                advancedSettings: {
                    stepName: 'Advanced settings',
                    scheduleAutoExport: 'Schedule automatic export',
                    email: 'Send error notification to',
                    paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                    autoCreateVendorsLabel: 'Auto create Contacts',
                    autoCreateMerchantsAsVendorsLabel: 'Auto Create ' + brandingConfig.brandName + ' Merchants as Contacts on Xero',
                    billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                    billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                    postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                    autoCreateEmployeeVendor: 'Auto-create '
                }
            }
        },
        intacct: {
            landing: {
                contentText: 'Import data from Sage Intacct to ' + brandingConfig.brandName + ' and Export expenses from ' + brandingConfig.brandName + ' to Sage Intacct. ',
                guideHeaderText: 'Guide to setup your Integrations'
            },
            common: {
                readMoreText: 'Read More',
                exportLogTabName: 'Export Log',
                viewExpenseText: 'View Expense',
                corporateCard: 'Corporate Card',
                errors: 'Errors',
                autoMap: 'Auto Map',
                customField: 'Add new Custom Field',
                customFieldName: 'Field Name',
                customFieldPlaceholderName: 'Placeholder Name',
                customFieldType: 'Field Type',
                customFieldCreateandSave: 'Create and save',
                userId: 'User ID',
                companyId: 'Company ID',
                userPassword: 'User Password',
                password: 'password',
                locationEntity: 'Location Entity',
                descriptionText: 'of the Description Field'
            },
            configuration: {
                connector: {
                    stepName: 'Connect to Sage Intacct',
                    locationSubLabel: 'Expenses will be posted to the Sage Intacct Location entity selected here. Once configured, you can not change ' + brandingConfig.brandName + ' Organization or Location Entity.',
                    subLabel: 'To connect your ' + brandingConfig.brandName + ' and Sage Intacct accounts, follow the detailed instructions provided in the article to generate the credentials and establish a secure connection.'
                },
                exportSetting: {
                    stepName: 'Export Settings',
                    headerText: '',
                    contentText: 'Enable this to export Non-Reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>Corporate Credit Card</b> expenses will not be exported to Sage Intacct.',
                    corporateCard: {
                        cccExpensePaymentType: 'Set the Default Expense Payment Type as?',
                        cccExpensePaymentTypeSubLabel: 'The selected Expense Payment Type will be added to the Corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Sage Intacct.',
                        creditCardVendor: 'Set the Default Credit Card Vendor as',
                        creditCardVendorSublabel: 'The vendor configured here will be added to all the Credit Card expenses exported as Bills.',
                        chargeCard: 'Set the Default Charge Card',
                        chargeCardPlaceholder: 'Select Corporate Charge Card',
                        chargeCardSublabel: 'Expenses of Corporate Cards in ' + brandingConfig.brandName + ' that are not mapped to their respective cards in Sage Intacct will be posted to the Card configured here. You can map your cards in the Mapping section after configuring the integration.',
                        cccExpenseState: 'You can export expenses either when they are awaiting closure after approval (Approved) or when the transactions has been settled (Closed)',
                        cccExportGroup: 'Expenses can either be exported as single line items (Expense) or as a grouped report with multiple line items (Report)',
                        employeeFieldMapping: 'How are your Employees represented in Sage Intacct?',
                        creditCard: 'To which General Ledger Account should the expenses be credited to?',
                        creditCardSubLabel: 'The integration will credit the account selected here for Corporate Credit Card Expenses exported as Journal Entries.'
                    }
                },
                advancedSettings: {
                    stepName: 'Advanced Settings',
                    contentText: 'In this section, you can customize the integration based on your accounting requirements.',
                    scheduleAutoExport: 'Schedule Automatic Export',
                    email: 'Send Error Notification to',
                    autoSyncPayments: 'Auto-Sync Payment Status for Reimbursable Expenses',
                    defaultPaymentAccount: 'Select Payment Account',
                    autoCreateEmployeeVendor: 'Auto-Create ',
                    postEntriesCurrentPeriod: 'Post Entries in the Current Accounting Period',
                    setDescriptionField: 'Set the Description Field in Sage Intacct',
                    dfvLabel: 'Default Field Values',
                    dfvSubLabel: 'If you\'ve made a field mandatory in Sage Intacct but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses. For Location and Department, you can opt to use the values from your employee records in Sage Intacct.',
                    location: 'Location',
                    department: 'Department',
                    project: 'Project',
                    class: 'Class',
                    item: 'Item',
                    customPreferencesLabel: 'Other Preferences',
                    customPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in Sage Intacct from ' + brandingConfig.brandName + '. (when there is no employee record found, or when the accounting period is closed)',
                    automationSubLabel: 'You can automate the export and sync of your data in this section.',
                    scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to Sage Intacct.',
                    accountingPeriodSubLabel: 'If there are expenses for which the accounting period is closed in Sage Intacct, you can export those to the current month by enabling this option.',
                    memoStructureSubLabel: 'You can choose from a list of available data points that you would like to export to the description field in Sage Intacct and re-order them as per your requirement.'
                },
                done: {
                    ctaText: '',
                    hintText: ''
                }
            }
        },
        configuration: {
            connector: {
                stepName: 'Connect to Quickbooks Online'
            },
            employeeSetting: {
                stepName: 'Map Employees'
            },
            exportSetting: {
                stepName: 'Export Settings',
                headerText: 'Export Corporate Card Expenses',
                contentText: 'In this section, you will configure how and when expenses from ' + brandingConfig.brandName + ' can be exported to QuickBooks Online.',
                corporateCard: {
                    expenseState: 'Select CCC expense state',
                    sectionLabel: '',
                    subLabel: '',
                    exportSubLabel: '',
                    defaultCCCAccountLabel: 'Set Default Credit Card Account as',
                    defaultCCCAccountPlaceholder: 'Select Default Credit Card Account',
                    defaultDebitCardAccountLabel: 'Set Default Debit Card Account as',
                    defaultDebitCardAccountPlaceholder: 'Select Default Debit Card Account',
                    defaultCCCVendorLabel: 'Set Default corporate Card Vendor as',
                    accountsPayableLabel: 'To which Accounts Payable account should the ',
                    accountsPayableSubLabel: ' to the selected Accounts Payable Account.',
                    creditCardExpenseSubLabel: 'You could choose to export CCC expenses when they have been approved and are awaiting payment clearance, OR simply when they have been paid out.',
                    creditCardExportGroupSubLabel: 'Expense can either be exported as single line items (Expense) or as a grouped report with multiple line items (Expense Report).',
                    journalOptionLabel: 'Name in Journal Entry',
                    journalOptionSubLabel: 'You can select either the \'Merchant Name\' or the \'Employee Name\' to appear in the \'Name\' field of your Journal Entries.',
                    creditCardExpenseLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                    creditCardExportTypeSubLabel: 'Choose the type of transaction in QuickBooks Online to export your ' + brandingConfig.brandName + ' expenses.'
                }
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'In this section, you can choose the fields required to be imported from QuickBooks Online to ' + brandingConfig.brandName + '. ',
                importCategoriesLabel: 'Import the Chart of Accounts as Categories in ' + brandingConfig.brandName,
                importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                importItemsLabel: 'Import Products/Services from QuickBooks Online',
                importItemsSubLabel: 'Products/services from QuickBooks Online will be imported as Categories in ' + brandingConfig.brandName + '.',
                taxCodeLabel: 'Import Tax from QuickBooks Online',
                taxCodeSubLabel: 'The imported Tax codes from QuickBooks Online will be set as Tax group in ',
                defaultTaxCodeLabel: 'Select Default Tax Code',
                importVendorsAsMerchantsLabel: 'Import Vendors from QuickBooks Online',
                chartOfAccountTypes: 'Select the accounts from QuickBooks to import as categories in ' + brandingConfig.brandName,
                chartOfAccountTypesSubLabel: 'By default expense will be selected. Open the dropdown to select more as per your requirements.'
            },
            advancedSettings: {
                stepName: 'Advanced Settings',
                contentText: 'In this section, you can customize the integration based on your accounting requirements. ',
                autoCreateVendorsLabel: 'Auto-Create Vendors',
                paymentSyncLabel: 'Auto Sync payment status for reimbursable expenses',
                customizationSubLabel: 'You can choose what data points need to be exported and what shouldn\'t be.',
                autoCreateMerchantsAsVendorsLabel: 'Auto-create Merchants as Vendors',
                singleCreditLineJELabel: 'Create a single itemized offset credit entry for Journal',
                singleCreditLineJESubLabel: 'Merge all Credits in a Journal to create a single entry.',
                billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                memoStructureLabel: 'Set the line item-level Description Field in QuickBooks Online',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from Capital One to QuickBooks Online.',
                frequencySubLabel: 'Set a frequency based on how often you want your expenses in Capital One to be exported to QuickBooks Online.',
                otherPreferencesLabel: 'Other Preferences',
                otherPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in QuickBooks Online from Capital One. (when there is no employee record found, or when the accounting period is closed)',
                accountingPeriodLabel: 'Post entries in the next open accounting period',
                accountingPeriodSubLabel: 'If the accounting period in QuickBooks Online is closed, the expenses from Capital One will be exported with a date stamp of the first day next open accounting period. ',
                autoCreateMerchantsAsVendorsSubLabel: 'Fyle will auto-create a new vendor in QuickBooks Online if a merchant added by an employee does not have a corresponding match in QuickBooks Online. ',
                customizeSectionSubLAbel: 'In this section, you can customize the data that you\'d like to export from ' + brandingConfig.brandName + ' to QuickBooks Online You can choose what data points need to be exported and what shouldn\'t be.',
                memoStructureSubLabel: 'You can choose from a list of available data points that you\'d like to export to the description field in QuickBooks Online and re-order them as per your requirement',
                previewDescriptionFieldLabel: 'Preview of the Description Field'
            },
            done: {
                ctaText: 'Launch Integration',
                hintText: 'After launching the integration, you can change your settings at any point of time under the <b class="tw-font-bold">Configuration</b> section.',
                doneHeaderText: 'Your integration setup is now complete.'
            }
        },
        dashboard: {
            exportHeaderFirstTimeZeroStateText: 'Sit back and relax!',
            exportHeaderZeroStateText: 'You are all caught up!',
            lastExportSuccessText: 'Successful Expenses',
            lastExportFailedText: 'Failed Expenses',
            lastExportedAtText: 'Last Export at:',
            nextExportAtText: 'Next Export at:',
            integrationErrorHeader: 'Integrations Errors',
            employeeMappingErrorText: 'Employee Mapping Errors',
            categoryMappingErrorText: 'Category Mapping Errors',
            qboErrorText: 'Errors',
            qboErrorDialogHeaderText: 'Error',
            exportLogHeader: 'Failed',
            exportLogSubHeader: 'These expenses have failed to export due to some errors. Resolve the errors on your dashboard to and try to re-export them again'
        },
        exportLog: {
            tableHeaders: {
                expenseID: 'Expense ID',
                employee: 'Employee Name and ID',
                expenseType: 'Expense Type',
                dateTime: 'Date and Time of Export',
                exportedAs: 'Exported As',
                exportSkippedOn: 'Export Skipped On'
            },
            searchPlaceholder: 'Search by Employee Name or Expense ID',
            dateRangeLabel: 'Or, Select Date range'
        },
        mapping: {
            filterPlaceholder: 'Select Status',
            employeeMappingToastText: 'Employee Mapping saved successfully',
            categoryMappingToastText: 'Category Mapping saved successfully',
            mappingToastText: 'Mapping saved successfully'
        },
        landing: {
            contentText: 'Import data from QuickBooks Online to ' + brandingConfig.brandName + ' and Export expenses from ' + brandingConfig.brandName + ' to QuickBooks Online. ',
            guideHeaderText: 'Guide to setup your Integrations'
        },
        common: {
            readMoreText: 'Read More',
            exportLogTabName: 'Export Log',
            viewExpenseText: 'View Expense',
            corporateCard: 'Corporate Card',
            errors: 'Errors',
            autoMap: 'Auto Map',
            customField: 'Add new Custom Field',
            customFieldName: 'Field Name',
            customFieldPlaceholderName: 'Placeholder Name',
            customFieldType: 'Field Type',
            customFieldCreateandSave: 'Create and save'
        }
    },
    co: {
        netsuite: {
            landing: {
                contentText: 'Import data from Netsuite to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Netsuite. ',
                guideHeaderText: 'Guide to setup your integrations'
            },
            common: {
                readMoreText: 'Read more',
                exportLogTabName: 'Export log',
                viewExpenseText: 'View expense',
                corporateCard: 'Corporate card',
                errors: 'errors',
                autoMap: 'Auto map',
                customField: 'Add new custom field',
                customFieldName: 'Field name',
                customFieldPlaceholderName: 'Placeholder name',
                customFieldType: 'Field type',
                customFieldCreateandSave: 'Create and save',
                tenantMapping: 'Tenant Mapping',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    configurationHeaderText: 'Connect to Netsuite subsidary',
                    configurationSubHeaderText: 'Connect to the Netsuite subsidary from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and Netsuite subsidary cannot be changed once the configuration steps are complete.',
                    stepName: 'Connect to Netsuite',
                    subLabel: 'Expenses will be posted to the Netsuite subsidary selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or Netsuite subsidary.'
                },
                exportSetting: {
                    stepName: 'Export settings',
                    headerText: ' Export Corporate Card Expenses',
                    contentText: 'Enable this to export non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card</b> expenses will not be exported to Netsuite.',
                    corporateCard: {
                        cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Netsuite.',
                        creditCardExportTypeSubLabel: '',
                        expenseState: '',
                        creditCardExpenseSubLabel: '',
                        cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (Approved) or when the payment has been settled (Closed).'
                    }
                },
                importSetting: {
                    stepName: 'Import Settings',
                    headerText: '',
                    contentText: '',
                    importCategoriesLabel: 'Import the Chart of Accounts as Categories in ',
                    importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                    importCustomersLabel: 'Import Customers from Netsuite',
                    importCustomersSubLabel: 'The Customers in Netsuite will be imported as Projects in Fyle and will be a selectable field while creating an expense',
                    taxCodeLabel: 'Import Tax from Netsuite',
                    taxCodeSubLabel: 'The imported Tax codes from Netsuite will be set as Tax group in ',
                    defaultTaxCodeLabel: 'Select Default Tax Code',
                    importSuppliersAsMerchantsLabel: 'Import Suppliers from Netsuite as Merchants',
                    importSuppliersAsMerchantsSubLabel: 'The Suppliers in Netsuite will be imported as Merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                    notes: 'NOTE: To export billable expenses from Fyle, import Customers from Netsuite as Projects in Fyle.',
                    toggleToastMessage: 'You have already mapped a tracking category from Netsuite to the Project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import Customers in the Project field.'
                },
                advancedSettings: {
                    stepName: 'Advanced settings',
                    scheduleAutoExport: 'Schedule automatic export',
                    email: 'Send error notification to',
                    paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                    autoCreateVendorsLabel: 'Auto create Contacts',
                    autoCreateMerchantsAsVendorsLabel: 'Auto Create ' + brandingConfig.brandName + ' Merchants as Contacts on Netsuite',
                    billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                    billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                    postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                    autoCreateEmployeeVendor: 'Auto-create ',
                    dfvSubLabel: '',
                    dfvLabel: ''
                }
            }
        },
        xero: {
            landing: {
                contentText: 'Import data from Xero to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Xero. ',
                guideHeaderText: 'Guide to setup your integrations'
            },
            common: {
                readMoreText: 'Read more',
                exportLogTabName: 'Export log',
                viewExpenseText: 'View expense',
                corporateCard: 'Corporate card',
                errors: 'errors',
                autoMap: 'Auto map',
                customField: 'Add new custom field',
                customFieldName: 'Field name',
                customFieldPlaceholderName: 'Placeholder name',
                customFieldType: 'Field type',
                customFieldCreateandSave: 'Create and save',
                tenantMapping: 'Tenant Mapping',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    configurationHeaderText: 'Connect to Xero tenant',
                    configurationSubHeaderText: 'Connect to the Xero tenant from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and Xero tenant cannot be changed once the configuration steps are complete.',
                    stepName: 'Connect to Xero',
                    subLabel: 'Expenses will be posted to the Xero tenant Mapping selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or tenant mapping.'
                },
                exportSetting: {
                    stepName: 'Export settings',
                    headerText: 'Export corporate card expenses',
                    contentText: 'Enable this to export non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card</b> expenses will not be exported to Xero.',
                    corporateCard: {
                        cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Xero.',
                        creditCardExportTypeSubLabel: '',
                        expenseState: '',
                        creditCardExpenseSubLabel: '',
                        cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (approved) or when the payment has been settled (closed).'
                    }
                },
                importSetting: {
                    stepName: 'Import Settings',
                    headerText: '',
                    contentText: '',
                    importCategoriesLabel: 'Import the chart of accounts as categories in ',
                    importCategoriesSubLabel: 'Imported account will be available as categories in ' + brandingConfig.brandName + '.',
                    importCustomersLabel: 'Import customers from Xero',
                    importCustomersSubLabel: 'The customers in Xero will be imported as projects in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense',
                    taxCodeLabel: 'Import tax from Xero',
                    taxCodeSubLabel: 'The imported tax codes from Xero will be set as tax group in ',
                    defaultTaxCodeLabel: 'Select default tax code',
                    importSuppliersAsMerchantsLabel: 'Import suppliers from Xero as merchants',
                    importSuppliersAsMerchantsSubLabel: 'The suppliers in Xero will be imported as merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                    notes: 'NOTE: To export billable expenses from ' + brandingConfig.brandName + ', import customers from Xero as projects in ' + brandingConfig.brandName,
                    toggleToastMessage: 'You have already mapped a tracking category from Xero to the project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import customers in the project field.'
                },
                advancedSettings: {
                    stepName: 'Advanced settings',
                    scheduleAutoExport: 'Schedule automatic export',
                    email: 'Send error notification to',
                    paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                    autoCreateVendorsLabel: 'Auto create contacts',
                    autoCreateMerchantsAsVendorsLabel: 'Auto create ' + brandingConfig.brandName + ' merchants as contacts on Xero',
                    billPaymentAccountLabel: 'To which payment account should the payment entries be posted?',
                    billPaymentAccountSubLabel: ', the payment entries will be posted to the selected payment account in ',
                    postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                    autoCreateEmployeeVendor: 'Auto-create '
                }
            }
        },
        intacct: {
            landing: {
                contentText: 'Import GL accounts and projects from Sage Intacct and export expenses from your expense management account.',
                guideHeaderText: 'How to setup your integration'
            },
            common: {
                readMoreText: 'Read more',
                exportLogTabName: 'Export log',
                viewExpenseText: 'View expense',
                corporateCard: 'Corporate card',
                errors: 'errors',
                autoMap: 'Auto map',
                customField: 'Add new custom field',
                customFieldName: 'Field name',
                customFieldPlaceholderName: 'Placeholder name',
                customFieldType: 'Field type',
                customFieldCreateandSave: 'Create and save',
                userId: 'user ID',
                companyId: 'company ID',
                userPassword: 'User password',
                password: 'password',
                locationEntity: 'location entity',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    stepName: 'Connect to Sage Intacct',
                    subLabel: 'Provide your credentials to establish a secure connection between your expense management and Sage Intacct account. ',
                    locationSubLabel: 'Expenses will be posted to the Sage Intacct location entity selected here. You can\'t change the location entity once they\'re configured.'
                },
                exportSetting: {
                    stepName: 'Export settings',
                    headerText: '',
                    contentText: 'Enable this to export non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card</b> expenses will not be exported to Sage Intacct.',
                    corporateCard: {
                        cccExpensePaymentType: 'Set the default expense payment type as?',
                        cccExpensePaymentTypeSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to Sage Intacct.',
                        creditCardVendor: 'Set the default credit card vendor as',
                        creditCardVendorSublabel: 'The vendor configured here will be added to all the credit card expenses exported as bills.',
                        chargeCard: 'Set the default charge card',
                        chargeCardPlaceholder: 'Select a charge card',
                        chargeCardSublabel: 'Expenses of corporate cards in expense management that aren\'t mapped to their respective in Sage Intacct will post to this card. You can still map cards after configuring the integration.',
                        cccExpenseState: 'You can choose to only export expenses when they\'ve been labeled approved or closed. ',
                        cccExportGroup: 'Expenses can either be exported as single line items (i.e., expenses) or as a grouped report with multiple line items (i.e., expense reports).',
                        employeeFieldMapping: 'How are your employees represented in Sage Intacct?',
                        creditCard: 'To which general ledger account should the expenses be credited to?',
                        creditCardSubLabel: 'The integration will credit the account selected here for corporate credit card expenses exported as journal entries.'
                    }
                },
                advancedSettings: {
                    stepName: 'Advanced settings',
                    scheduleAutoExport: 'Schedule automatic export',
                    email: 'Send error notification to',
                    autoSyncPayments: 'Auto-sync payment status for reimbursable expenses',
                    defaultPaymentAccount: 'Select payment account',
                    autoCreateEmployeeVendor: 'Auto-create ',
                    postEntriesCurrentPeriod: 'Post entries in the current open accounting period',
                    setDescriptionField: 'Set the line-item description field in Sage Intacct',
                    dfvLabel: 'Default field values',
                    dfvSubLabel: 'If you\'ve made a field mandatory in Sage Intacct but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses. For location and department, you can use the values from your employee records in Sage Intacct.',
                    location: 'location',
                    department: 'department',
                    project: 'project',
                    class: 'class',
                    item: 'item',
                    customPreferencesLabel: 'Custom preferences',
                    customPreferencesSubLabel: 'Customize your data export process based on your business\'s needs and preferences. ',
                    contentText: 'Customize the integration based on your accounting requirements.',
                    automationSubLabel: 'Automate your export frequency and how often your data syncs with Sage Intacct.',
                    scheduleSubLabel: 'Set a schedule to automatically export expenses from expense management to Sage Intacct.',
                    accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                    memoStructureSubLabel: 'Choose the data points you\'d like to export to the description field in Sage Intacct and order them based on your requirements. '
                },
                done: {
                    ctaText: '',
                    hintText: ''
                }
            }
        },
        configuration: {
            connector: {
                stepName: 'Connect to Quickbooks Online'
            },
            employeeSetting: {
                stepName: 'Map employees'
            },
            exportSetting: {
                stepName: 'Export settings',
                headerText: 'Export corporate card expenses',
                contentText: 'Configure how and when expenses from expense management are exported to QuickBooks Online.',
                corporateCard: {
                    expenseState: 'Select ccc expense state',
                    sectionLabel: '',
                    subLabel: '',
                    exportSubLabel: '',
                    defaultCCCAccountLabel: 'Set default credit card account as',
                    defaultCCCAccountPlaceholder: 'Select default credit card account',
                    defaultDebitCardAccountLabel: 'Set default debit card account as',
                    defaultDebitCardAccountPlaceholder: 'Select default debit card account',
                    defaultCCCVendorLabel: 'Set default corporate card vendor as',
                    accountsPayableLabel: 'To which accounts payable account should the ',
                    accountsPayableSubLabel: ' to the selected accounts payable Account.',
                    creditCardExpenseSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed. ',
                    creditCardExportGroupSubLabel: 'Expenses can either be exported as single line items (i.e., expenses) or as a grouped report with multiple line items (i.e., expense reports).',
                    journalOptionLabel: 'Name in journal entry',
                    journalOptionSubLabel: 'You can select either the \'merchant name\' or the \'employee name\' to appear in the \'name\' field of your journal entries.',
                    creditCardExpenseLabel: 'How should expenses be labeled  before exporting from expense management?',
                    creditCardExportTypeSubLabel: 'Choose which transactions are exported to QuickBooks Online.'
                }
            },
            importSetting: {
                stepName: 'Import settings',
                headerText: '',
                contentText: 'Choose the required import fields from QuickBooks Online to expense management.',
                importCategoriesLabel: 'Import the chart of accounts as categories',
                importCategoriesSubLabel: 'Imported accounts will be available as categories in expense management.',
                importItemsLabel: 'Import products/services from QuickBooks Online',
                importItemsSubLabel: 'Products/services from QuickBooks Online will be imported as categories in expense management.',
                taxCodeLabel: 'Import tax from QuickBooks Online',
                taxCodeSubLabel: 'The imported tax codes from QuickBooks Online will be set as tax group in ',
                defaultTaxCodeLabel: 'Select default tax code',
                importVendorsAsMerchantsLabel: 'Import vendors from QuickBooks Online',
                chartOfAccountTypes: 'Select accounts from QuickBooks Online to import as categories.',
                chartOfAccountTypesSubLabel: 'By default, expense will be selected. To select another option, open the the dropdown.'
            },
            advancedSettings: {
                stepName: 'Advanced settings',
                contentText: 'Customize the integration based on your accounting requirements. ',
                autoCreateVendorsLabel: 'Auto-create vendors',
                paymentSyncLabel: 'Auto sync payment status for reimbursable expenses',
                customizationSubLabel: 'you can choose what data points need to be exported and what shouldn\'t be.',
                autoCreateMerchantsAsVendorsLabel: 'Auto-create merchants as vendors',
                singleCreditLineJELabel: 'Create a single itemized offset credit entry for journal',
                singleCreditLineJESubLabel: 'Merge all credits in a journal to create a single entry.',
                billPaymentAccountLabel: 'To which payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected payment account in ',
                memoStructureLabel: 'Set the line-item description field in QuickBooks Online',
                automationSubLabel: 'Automate exports and data syncs.',
                scheduleSubLabel: 'Set up a schedule to automate the export of expenses from expense management to QuickBooks Online.',
                frequencySubLabel: 'Set how often your expenses will be exported to Quickbooks Online.',
                otherPreferencesLabel: 'Other preferences',
                otherPreferencesSubLabel: 'Create new records in Quickbooks Online if no vendor record is found or the accounting period is closed.',
                accountingPeriodLabel: 'Post entries for the first day of the current open accounting period.',
                accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                autoCreateMerchantsAsVendorsSubLabel: 'Automatically create a new vendor in Quickbooks Online if an added merchant doesn\'t have a corresponding match.',
                customizeSectionSubLAbel: 'Customize the data that you\'d like to export from expense management to QuickBooks Online by choosing which data points need to be exported.',
                memoStructureSubLabel: 'Choose from a list of available data points that you\'d like to export to the description field in QuickBooks Online and re-order them.',
                previewDescriptionFieldLabel: 'Preview of the description field'
            },
            done: {
                ctaText: 'Launch integration',
                hintText: 'You can change your integration settings anytime in the <b class="tw-font-bold">configuration</b> section.',
                doneHeaderText: 'You\'ve successfully set up your integration'
            }
        },
        dashboard: {
            exportHeaderFirstTimeZeroStateText: 'There\'s currently no new expenses to report',
            exportHeaderZeroStateText: 'You\’re all caught up',
            lastExportSuccessText: 'Successful expenses',
            lastExportFailedText: 'Failed expenses',
            lastExportedAtText: 'Last export at:',
            nextExportAtText: 'Next export at:',
            integrationErrorHeader: 'Integrations errors',
            employeeMappingErrorText: 'Employee mapping errors',
            categoryMappingErrorText: 'Category mapping errors',
            qboErrorText: 'errors',
            qboErrorDialogHeaderText: 'error',
            exportLogHeader: 'Failed to export?',
            exportLogSubHeader: 'Resolve the errors from your dashboard and try exporting these expenses again.'
        },
        exportLog: {
            tableHeaders: {
                expenseID: 'Expense ID',
                employee: 'Employee',
                expenseType: 'Expense type',
                dateTime: 'Date and time of export',
                exportedAs: 'Exported as',
                exportSkippedOn: 'Export skipped on'
            },
            searchPlaceholder: 'Search by employee or expense ID',
            dateRangeLabel: 'Select date range'
        },
        mapping: {
            filterPlaceholder: 'Select status',
            employeeMappingToastText: 'Employee mapping saved successfully',
            categoryMappingToastText: 'Category mapping saved successfully',
            mappingToastText: 'Mapping saved successfully'
        },
        landing: {
            contentText: 'Import GL accounts and projects from QuickBooks Online and export expenses from your expense management account.',
            guideHeaderText: 'How to setup your integration'
        },
        common: {
            readMoreText: 'Read more',
            exportLogTabName: 'Export log',
            viewExpenseText: 'View expense',
            corporateCard: 'Corporate card',
            errors: 'errors',
            autoMap: 'Auto map',
            customField: 'Add new custom field',
            customFieldName: 'Field name',
            customFieldPlaceholderName: 'Placeholder name',
            customFieldType: 'Field type',
            customFieldCreateandSave: 'Create and save'
        }
    }
};

// @ts-ignore
export const brandingContent = content[brandingConfig.brandId];

