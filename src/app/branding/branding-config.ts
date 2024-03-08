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
                useMerchantInJournalLine: false
            },
            importSettings: {
                tax: true,
                importVendorsAsMerchants: true
            },
            advancedSettings: {
                autoCreateVendors: true,
                paymentsSync: true,
                singleCreditLineJE: true,
                emailNotification: true,
                skipExport: true
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
                importVendorsAsMerchants: false
            },
            advancedSettings: {
                autoCreateVendors: false,
                paymentsSync: false,
                singleCreditLineJE: false,
                emailNotification: false,
                skipExport: false
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
            QBO: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
            INTACCT: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
            SAGE300: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration`,
            XERO: `${brandingConfig.helpArticleDomain}/en/articles/8911018-how-to-configure-the-fyle-dynamics-365-business-central-integration`
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
            // TODO: Update KB articles for Sage 300
            SAGE300: {
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c`,
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
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
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_dca1353686`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_b8a2df129f`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online`
            }
        }
    },
    co: {
        topLevelArticles: {
            BAMBOO_HR: `${brandingConfig.helpArticleDomain}/en/articles/6845034-fyle-bamboo-hr-integration`,
            QBD: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle#quickbooks-desktop`,
            QBO: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
            INTACCT: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            TRAVELPERK: `${brandingConfig.helpArticleDomain}/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle`,
            SAGE300: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            BUSINESS_CENTRAL: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`,
            XERO: `${brandingConfig.helpArticleDomain}/en/collections/215867-integrations-with-fyle`
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
            SAGE300: {
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c`,
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct`
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
                LANDING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration`,
                CONNECTOR: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0`,
                EMPLOYEE_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_d70f1d54cc`,
                EXPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_dca1353686`,
                IMPORT_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_b8a2df129f`,
                ADVANCED_SETTING: `${brandingConfig.helpArticleDomain}/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7`,
                SKIP_EXPORT: `${brandingConfig.helpArticleDomain}/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online`
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
            XERO: 'https://www.youtube.com/embed/2oYdc8KcQnk'
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
            XERO: 'https://www.youtube.com/embed/2oYdc8KcQnk'
        }
    }
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];


const content: ContentConfiguration = {
    fyle: {
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
                    subLabel: 'Expenses will be posted to the Sage Intacct Location entity selected here. Once configured, you can not change ' + brandingConfig.brandName + ' Organization or Location Entity.'
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
                        chargeCardSublabel: 'Expenses of Corporate Cards in ' + brandingConfig.brandName + ' that are not mapped to their respective cards in Sage Intacct will be posted to the Card configured here. You can map your cards in the Mapping section after configuring the integration.',
                        cccExpenseState: 'You can export expenses either when they are awaiting closure after approval (Approved) or when the transaction has been settled (Closed)',
                        cccExportGroup: 'Expenses can either be exported as single line items (Expense) or as a grouped report with multiple line items (Report)',
                        employeeFieldMapping: 'How are your Employees represented in Sage Intacct?',
                        creditCard: 'To which GL Account should the expenses be credited to?',
                        creditCardSubLabel: 'The integration will credit the account selected here for Corporate Credit Card Expenses exported as Journal Entries.'
                    }
                },
                advancedSettings: {
                    stepName: 'Advanced Settings',
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
                    item: 'Item'
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
                contentText: 'Enable this to export the Non-Reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>out-of-pocket</b> expenses will not be exported to QuickBooks Online.',
                corporateCard: {
                    expenseState: 'Select CCC expense state',
                    sectionLabel: '',
                    subLabel: '',
                    exportSubLabel: '',
                    defaultCCCAccountLabel: 'Set Default Credit Card Account as',
                    defaultCCCAccountPlaceholder: 'Select Default Credit Card Account',
                    defaultDebitCardAccountLabel: 'Set Default Debit Card Account as',
                    defaultDebitCardAccountPlaceholder: 'Select Default Debit Card Account',
                    defaultCCCVendorLabel: 'Set default corporate Card Vendor as',
                    accountsPayableLabel: 'To which Accounts Payable account should the ',
                    accountsPayableSubLabel: ' to the selected Accounts Payable Account.',
                    creditCardExpenseSubLabel: 'You could choose to export CCC expenses when they have been approved and are awaiting payment clearance, OR simply when they have been paid out.',
                    creditCardExportTypeSubLabel: 'Expense can either be exported as single line items (Expense) or as a grouped report with multiple line items (Expense Report).',
                    journalOptionLabel: 'Name in Journal Entry (CCC)',
                    journalOptionSubLabel: 'You can select either the \'Merchant Name\' or the \'Employee Name\' to appear in the \'Name\' field of your Journal Entries.'
                }
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: '',
                importCategoriesLabel: 'Import the Chart of Accounts as Categories in ',
                importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                importItemsLabel: 'Import Products/Services from QuickBooks Online',
                importItemsSubLabel: 'Products/services from QuickBooks Online will be imported as Categories in ',
                taxCodeLabel: 'Import Tax from QuickBooks Online',
                taxCodeSubLabel: 'The imported Tax codes from QuickBooks Online will be set as Tax group in ',
                defaultTaxCodeLabel: 'Select Default Tax Code',
                importVendorsAsMerchantsLabel: 'Import Vendors from QuickBooks Online'
            },
            advancedSettings: {
                stepName: 'Advanced Settings',
                autoCreateVendorsLabel: 'Auto-Create Vendors',
                paymentSyncLabel: 'Auto Sync payment status for reimbursable expenses',
                customizationSubLabel: 'You can choose what data points need to be exported and what shouldn\'t be.',
                autoCreateMerchantsAsVendorsLabel: 'Auto-create Merchants as Vendors',
                singleCreditLineJELabel: 'Create a single itemized offset credit entry for Journal',
                singleCreditLineJESubLabel: 'Merge all Credits in a Journal to create a single entry.',
                billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                memoStructureLabel: 'Set the line item-level Description Field in QuickBooks Online'
            },
            done: {
                ctaText: 'Launch Integration',
                hintText: 'After launching the integration, you can change your settings at any point of time under the <b class="tw-font-bold">Configuration</b> section.'
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
            qboErrorDialogHeaderText: 'Error'
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
            filterPlaceholder: 'Select Status'
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
        intacct: {
            landing: {
                contentText: 'Import data from Sage Intacct to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Sage Intacct. ',
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
                userId: 'user ID',
                companyId: 'company ID',
                userPassword: 'User password',
                password: 'password',
                locationEntity: 'Location entity',
                descriptionText: 'of the description field'
            },
            configuration: {
                connector: {
                    stepName: 'Connect to Sage Intacct',
                    subLabel: 'Expenses will be posted to the Sage Intacct location entity selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or location entity.'
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
                        chargeCardSublabel: 'Expenses of corporate cards in ' + brandingConfig.brandName + ' that are not mapped to their respective cards in Sage Intacct will be posted to the card configured here. You can map your cards in the mapping section after configuring the integration.',
                        cccExpenseState: 'You can export expenses either when they are awaiting closure after approval (approved) or when the transaction has been settled (closed).',
                        cccExportGroup: 'Expenses can either be exported as single line items (expense) or as a grouped report with multiple line items (report).',
                        employeeFieldMapping: 'How are your employees represented in Sage Intacct?',
                        creditCard: 'To which gl account should the expenses be credited to?',
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
                    postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                    setDescriptionField: 'Set the description field in Sage Intacct',
                    dfvLabel: 'Default field values',
                    dfvSubLabel: 'If you\'ve made a field mandatory in Sage Intacct but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses. For location and department, you can opt to use the values from your employee records in Sage Intacct.',
                    location: 'location',
                    department: 'department',
                    project: 'project',
                    class: 'class',
                    item: 'item'
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
                contentText: 'Enable this to export the non-reimbursable expenses from ' + brandingConfig.brandName + ' if not enabled, any <b>out-of-pocket</b> expenses will not be exported to QuickBooks Online.',
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
                    creditCardExpenseSubLabel: 'You could choose to export ccc expenses when they have been approved and are awaiting payment clearance, or simply when they have been paid out.',
                    creditCardExportTypeSubLabel: 'Expense can either be exported as single line items (expense) or as a grouped report with multiple line items (expense report).',
                    journalOptionLabel: 'Name in journal entry (ccc)',
                    journalOptionSubLabel: 'You can select either the \'merchant name\' or the \'employee name\' to appear in the \'name\' field of your journal entries.'
                }
            },
            importSetting: {
                stepName: 'Import settings',
                headerText: '',
                contentText: '',
                importCategoriesLabel: 'Import the chart of accounts as categories in ',
                importCategoriesSubLabel: 'Imported account will be available as categories in ' + brandingConfig.brandName + '.',
                importItemsLabel: 'Import products/services from QuickBooks Online',
                importItemsSubLabel: 'Products/services from QuickBooks Online will be imported as categories in ',
                taxCodeLabel: 'Import tax from QuickBooks Online',
                taxCodeSubLabel: 'The imported tax codes from QuickBooks Online will be set as tax group in ',
                defaultTaxCodeLabel: 'Select default tax code',
                importVendorsAsMerchantsLabel: 'Import vendors from QuickBooks Online'
            },
            advancedSettings: {
                stepName: 'Advanced settings',
                autoCreateVendorsLabel: 'Auto-create vendors',
                paymentSyncLabel: 'Auto sync payment status for reimbursable expenses',
                customizationSubLabel: 'you can choose what data points need to be exported and what shouldn\'t be.',
                autoCreateMerchantsAsVendorsLabel: 'Auto-create merchants as vendors',
                singleCreditLineJELabel: 'Create a single itemized offset credit entry for journal',
                singleCreditLineJESubLabel: 'Merge all credits in a journal to create a single entry.',
                billPaymentAccountLabel: 'To which payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected payment account in ',
                memoStructureLabel: 'Set the line item-level description field in QuickBooks Online'
            },
            done: {
                ctaText: 'Launch integration',
                hintText: 'After launching the integration, you can change your settings at any point of time under the <b class="tw-font-bold">configuration</b> section.'
            }
        },
        dashboard: {
            exportHeaderFirstTimeZeroStateText: 'Sit back and relax',
            exportHeaderZeroStateText: 'You are all caught up',
            lastExportSuccessText: 'Successful expenses',
            lastExportFailedText: 'Failed expenses',
            lastExportedAtText: 'Last export at:',
            nextExportAtText: 'Next export at:',
            integrationErrorHeader: 'Integrations errors',
            employeeMappingErrorText: 'Employee mapping errors',
            categoryMappingErrorText: 'Category mapping errors',
            qboErrorText: 'errors',
            qboErrorDialogHeaderText: 'error'
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
            dateRangeLabel: 'Or, select date range'
        },
        mapping: {
            filterPlaceholder: 'Select status'
        },
        landing: {
            contentText: 'Import data from QuickBooks Online to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to QuickBooks Online. ',
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
            customFieldCreateandSave: 'Create and save'
        }
    }
};

// @ts-ignore
export const brandingContent = content[brandingConfig.brandId];

