import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const c1Contents = {
    netsuite: {
        landing: {
            contentText: 'Import data from Netsuite to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Netsuite. ',
            guideHeaderText: 'How to setup your integration'
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
                dfvLabel: '',
                changeAccountingPeriodSubLabel: 'If there are expenses for which the accounting period is closed in NetSuite, you can export those to the current month by enabling this option.'
            }
        }
    },
    xero: {
        landing: {
            contentText: 'Import data from Xero to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Xero. ',
            guideHeaderText: 'How to setup your integration'
        },
        configuration: {
            connector: {
                configurationHeaderText: 'Connect to Xero tenant',
                configurationSubHeaderText: 'Connect to Xero tenant to import and export data. The connection cannot be changed once the setup is complete.',
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
                    cccExpenseStateSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed. '
                },
                stepSubLabel: 'Configure how and when expenses from expense management can be exported to Xero.',
                cccExpenseStateLabel: 'How should expenses be labeled before exporting from expense management?'
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'Choose the required import fields from Xero to expense management.',
                importCategoriesLabel: 'Import the chart of accounts as categories.',
                importCategoriesSubLabel: 'Imported accounts will be available as categories in ' + brandingConfig.brandName + '.',
                importCustomersLabel: 'Import customers from Xero',
                importCustomersSubLabel: 'The customers in Xero will be imported as projects in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense',
                taxCodeLabel: 'Import tax from Xero',
                taxCodeSubLabel: 'The imported tax codes from Xero will be set as tax group in ',
                defaultTaxCodeLabel: 'Select default tax code',
                importSuppliersAsMerchantsLabel: 'Import suppliers from Xero as merchants',
                importSuppliersAsMerchantsSubLabel: 'The suppliers in Xero will be imported as merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                notes: 'NOTE: To export billable expenses from ' + brandingConfig.brandName + ', import customers from Xero as projects in ' + brandingConfig.brandName,
                toggleToastMessage: 'You have already mapped a tracking category from Xero to the project field in ' + brandingConfig.brandName + '. Change the configured mapping to a new field to be able to import customers in the project field.',
                chartOfAccountsLabel: 'Select accounts from Xero to import as categories.',
                chartOfAccountsSubLabel: 'By default, expense will be selected. To select another option, open the dropdown. '
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
                autoCreateEmployeeVendor: 'Auto-create ',
                frequencySubLabel: 'Set how often your expenses will be exported to Xero.',
                contentText: 'Customize the integration based on your accounting requirements.',
                automationSubLabel: 'Automate your export frequency and how often your data syncs with Xero.',
                scheduleSubLabel: 'Set a schedule to automatically export expenses from expense management to Xero.',
                accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                autoCreateVendorsSubLabel: 'Automatically create a new contact in Xero if an added merchant doesn\'t have a corresponding match.',
                customPreferencesLabel: 'Other preferences',
                customPreferencesSubLabel: ' Create new records in Xero if no contacts found or the accounting period is closed.'
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
                    chargeCardSublabel: 'Expenses of corporate cards in expense management that aren\'t mapped to their respective cards in Sage Intacct will post to this card. You can still map cards after configuring the integration.',
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
                dfvSubLabel: 'If you\'ve made a field mandatory in Sage Intacct but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses.',
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
                memoStructureSubLabel: 'Choose from a list of available data points that you\'d like to export to the description field in Sage Intacct.',
                customizeSectionSubLabel: 'Customize the data that you\'d like to export from expense management to Sage Intacct by choosing which data points need to be exported.'
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
                defaultCCCVendorSubLabel: 'The default vendor will apply to all corporate card transactions upon export.',
                accountsPayableLabel: 'To which accounts payable account should the ',
                accountsPayableSubLabel: ' to the selected accounts payable Account.',
                creditCardExpenseSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed. ',
                creditCardExportGroupSubLabel: 'Expenses can either be exported as single line items (i.e., expenses) or as a grouped report with multiple line items (i.e., expense reports).',
                journalOptionLabel: 'Name in journal entry',
                journalOptionSubLabel: 'You can select either the \'merchant name\' or the \'employee name\' to appear in the \'name\' field of your journal entries.',
                creditCardExpenseLabel: 'How should expenses be labeled  before exporting from expense management?',
                creditCardExportTypeSubLabel: 'Choose how transactions are exported to QuickBooks Online.'
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
            chartOfAccountTypesSubLabel: 'By default, expense will be selected. To select another option, open the dropdown.'
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
            accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period',
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
        employeeMappingToastText: 'Employee mapping saved successfully.',
        categoryMappingToastText: 'Category mapping saved successfully.',
        mappingToastText: 'Mapping saved successfully.'
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
        customFieldCreateandSave: 'Create and save',
        currentDate: 'Current date'
    }
};