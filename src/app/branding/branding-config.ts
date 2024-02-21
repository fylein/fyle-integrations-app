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
        exposeOnlyQBOApp: false,
        isBackgroundColorAllowed: false,
        isAsterikAllowed: true,
        featureFlags: {
            cloneSettings: true,
            mapEmployees: true,
            exportSettings: {
                reimbursableExpenses: true,
                nameInJournalEntry: true
            },
            importSettings: {
                tax: true
            },
            advancedSettings: {
                autoCreateVendors: true,
                paymentsSync: true,
                singleCreditLineJE: true,
                emailNotification: true
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
        exposeOnlyQBOApp: true,
        isBackgroundColorAllowed: true,
        isAsterikAllowed: false,
        featureFlags: {
            cloneSettings: false,
            mapEmployees: false,
            exportSettings: {
                reimbursableExpenses: false,
                nameInJournalEntry: false
            },
            importSettings: {
                tax: false
            },
            advancedSettings: {
                autoCreateVendors: false,
                paymentsSync: false,
                singleCreditLineJE: false,
                emailNotification: false
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
            BAMBOO_HR: 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration',
            QBD: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-desktop',
            INTACCT: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            TRAVELPERK: 'https://help.fylehq.com/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle',
            SAGE300: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            BUSINESS_CENTRAL: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle'
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                CONNECTOR: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_38e0c9bea6',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            },
            // TODO: Update KB articles for Sage 300
            SAGE300: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            },
            // TODO: Update KB articles for QBO
            QBO: {
                LANDING: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-2-0',
                CONNECTOR: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0',
                EMPLOYEE_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_d70f1d54cc',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_dca1353686',
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_b8a2df129f',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online'
            },
            // TODO: Update KB articles for MS Dynamics
            BUSINESS_CENTRAL: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            }
        }
    },
    co: {
        topLevelArticles: {
            BAMBOO_HR: 'https://help.fylehq.com/en/articles/6845034-fyle-bamboo-hr-integration',
            QBD: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-desktop',
            INTACCT: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            TRAVELPERK: 'https://help.fylehq.com/en/articles/7549535-how-are-travelperk-invoices-created-as-expenses-in-fyle',
            SAGE300: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            BUSINESS_CENTRAL: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle'
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                CONNECTOR: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_38e0c9bea6',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            },
            // TODO: Update KB articles for Sage 300
            SAGE300: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            },
            // TODO: Update KB articles for QBO
            QBO: {
                LANDING: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#quickbooks-2-0',
                CONNECTOR: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0',
                EMPLOYEE_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_d70f1d54cc',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_dca1353686',
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_b8a2df129f',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7044785-how-to-skip-exporting-specific-expenses-from-fyle-to-quickbooks-online'
            },
            // TODO: Update KB articles for MS Dynamics
            BUSINESS_CENTRAL: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
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
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk'
        }
    },
    co: {
        onboarding: {
            INTACCT: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            // TODO: Update link for Sage 300
            SAGE300: 'https://www.youtube.com/embed/2oYdc8KcQnk',
            QBO: 'https://www.youtube.com/embed/b63lS2DG5j4',
            // TODO: Update link for MS Dynamics
            BUSINESS_CENTRAL: 'https://www.youtube.com/embed/2oYdc8KcQnk'
        }
    }
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];


const content: ContentConfiguration = {
    fyle: {
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
                contentText: 'Enable this to export the Non-Reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>out-of-pocket</b> expenses will not be exported to QuickBooks Online',
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
                    creditCardExportTypeSubLabel: 'Expense can either be exported as single line items (Expense) or as a grouped report with multiple line items (Expense Report)',
                    journalOptionLabel: 'Name in Journal Entry (CCC)',
                    journalOptionSubLabel: 'You can select either the \'Merchant Name\' or the \'Employee Name\' to appear in the \'Name\' field of your Journal Entries'
                }
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: '',
                importCategoriesLabel: 'Import the Chart of Accounts as Categories in ',
                importCategoriesSubLabel: 'Imported account will be available as Categories in ',
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
                contentText: 'Enable this to export the non-reimbursable expenses from ' + brandingConfig.brandName + ' if not enabled, any <b>out-of-pocket</b> expenses will not be exported to QuickBooks Online',
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
                    creditCardExportTypeSubLabel: 'Expense can either be exported as single line items (expense) or as a grouped report with multiple line items (expense report)',
                    journalOptionLabel: 'Name in journal entry (ccc)',
                    journalOptionSubLabel: 'You can select either the \'merchant name\' or the \'employee name\' to appear in the \'name\' field of your journal entries'
                }
            },
            importSetting: {
                stepName: 'Import settings',
                headerText: '',
                contentText: '',
                importCategoriesLabel: 'Import the chart of accounts as categories in ',
                importCategoriesSubLabel: 'Imported account will be available as categories in ',
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

