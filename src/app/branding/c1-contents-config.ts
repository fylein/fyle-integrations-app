import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const c1Contents = {
    qbd_direct: {
        landing: {
            contentText: 'Import chart of accounts and projects from NetSuite and export expenses from your Expense Management account.',
            guideHeaderText: 'How to setup your integration'
        },
        configuration: {
            connector: {
                configurationHeaderText: 'Connect to NetSuite subsidary',
                configurationSubHeaderText: 'Expenses will be posted to the NetSuite subsidary selected here. You can\'t change the subsidary once they\'re configured.',
                stepName: 'Connect to NetSuite',
                subLabel: 'Provide your credentials to establish a secure connection between your Expense Management and NetSuite account'
            },
            exportSetting: {
                stepName: 'Export settings',
                headerText: ' Export Corporate Card Expenses',
                contentText: 'Configure how and when expenses from Expense Management can be exported to QuickBooks Desktop.',
                reimbursable: {
                    reimbursableExpenseLabel: 'Export Reimbursable Expenses',
                    reimbursableExpenseSubLabel: 'Enable this to export the reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>out-of-pocket</b> expenses will not be exported to Quickbooks Desktop.',
                    reimbursableExpenseTypeLabel: 'How should the expenses be exported?',
                    reimbursableExpenseTypeSubLabel: 'Choose the type of transaction in QuickBooks Desktop to export your ' + brandingConfig.brandName +' expenses.',
                    reimbursableExpenseStateLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                    reimbursableExpenseStateSubLabel: 'You can export exxpenses either when they are awaiting closure after approval (Processing) or when the payment has been settled (Closed).',
                    reimbursableExpenseDateLabel: 'Set the expense ',
                    reimbursableExpenseDateSubLabel: 'Expenses will be grouped and posted using the configured date when exporting from ' + brandingConfig.brandName +' to QuickBooks Desktop',
                    reimbursableExpenseGroupLabel: 'How should the expenses be grouped?',
                    reimbursableExpenseGroupSubLabel: 'Expenses can either be exported as single line items (Expense) or as a grouped report with multiple line items (Report)',
                    employeeMappingLabel: 'How are your Employees represented in QuickBooks Desktop?',
                    employeeMappingSubLabel: 'Select how you represent your employees in QuickBooks Desktop. This would help to export the expenses from ' + brandingConfig.brandName + ' to the correct employee/vendor record in QuickBooks Desktop.',
                    autoMapEmployeesLabel: 'How should Employees in ' + brandingConfig.brandName + ' be mapped to ',
                    autoMapEmployeesSubLabel: 'Automatically map the employees in ' + brandingConfig.brandName + ' to their corresponding records in QuickBooks Desktop based on a unique parameter.',
                    defaultReimbursableAccountPayableLabel: 'To which accounts payable account should the ',
                    defaultReimbursableAccountPayableSubLabel: 'The integration will post the offset credit entry in '
                },
                corporateCard: {
                    creditCardExpenseLabel: 'Export corporate card expenses',
                    creditCardExpenseSubLabel: 'Enable this to export the non-reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>corporate credit card </b> expenses will not be exported to Quickbooks Desktop.',
                    creditCardExpenseTypeLabel: 'How should the expenses be exported?',
                    creditCardExpenseTypeSubLabel: 'Choose the type of transaction in QuickBooks Desktop to export your ' + brandingConfig.brandName +' expenses.',
                    creditCardExpenseStateLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                    creditCardExpenseStateSubLabel: 'You could choose to export ccc expenses when they have been approved and are awaiting payment clearance, or simply when they have been paid out.',
                    creditCardExpenseDateLabel: 'Set the expense ',
                    creditCardExpenseDateSubLabel: 'Expenses will be grouped and posted using the configured date when exporting from ' + brandingConfig.brandName +' to QuickBooks Desktop',
                    creditCardExpenseGroupLabel: 'How should the expenses be grouped?',
                    creditCardExpenseGroupSubLabel: 'Expenses can either be exported as single line items (Expense) or as a grouped report with multiple line items (Report)',
                    creditCardExpenseNameinJELabel: 'Name in Journal Entry',
                    creditCardExpenseNameinJESubLabel: 'You can select either the \'Merchant Name\' or the \'Employee Name\' to appear in the \'Name\' field of your Journal Entries.',
                    defaultCCCAccountLabel: 'Set Default Credit Card Account as',
                    defaultCCCAccountSubLabel: 'Post all your company corporate card transactions to a default credit card account.',
                    defaultCCCAccountPayableLabel: 'To which accounts payable account should the ',
                    defaultCCCAccountPayableSubLabel: 'The integration will post the offset credit entry in '
                }
            },
            importSetting: {
                stepName: 'Import settings',
                headerText: '',
                contentText: 'Choose the required import fields from QuickBooks Desktop to Expense Management.',
                importCategoriesLabel: 'Import the chart of accounts as categories',
                importCategoriesSubLabel: 'Imported accounts will be available as categories in Expense Management.',
                importItemsLabel: 'Import products/services from QuickBooks Desktop',
                importItemsSubLabel: 'Products/services from QuickBooks Desktop will be imported as categories in Expense Management.',
                importVendorsAsMerchantsLabel: 'Import vendors from QuickBooks Desktop',
                chartOfAccountTypes: 'Select accounts from QuickBooks Desktop to import as categories.',
                chartOfAccountTypesSubLabel: 'By default, expense will be selected. To select another option, open the dropdown.'
            },
            advancedSettings: {
                stepName: 'Advanced settings',
                contentText: 'Customize the integration based on your accounting requirements.',
                customizeSectionLabel: 'Customization',
                customizeSectionSubLabel: 'In this section, you can customize the data that you\'d like to export from Fyle to QuickBooks Desktop You can choose what data points need to be exported and what shouldn\'t be.',
                automationLabel: 'Automation',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                scheduleAutoExportLabel: 'Schedule automatic export',
                scheduleAutoExportSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to QuickBooks Desktop.',
                autoExportfrequencyLabel: 'Set up export frequency',
                autoExportfrequencySubLabel: '',
                topLevelMemoStructureLabel: 'Select the top level memo field data for QuickBooks Desktop',
                topLevelMemoStructureSubLabel: 'You can customize the <b>data point</b> you would like to export to QuickBooks Desktop\’s <b>top-level memo</b> field while exporting expenses from ' + brandingConfig.brandName + '.',
                memoStructureLabel: 'Set the line-item level memo field data for QuickBooks Desktop.',
                memoStructureSubLabel: 'You can customize the data set you would like to export to QuickBooks Desktop\’s <b>transaction line-item level memo</b> field while exporting expenses from ' + brandingConfig.brandName + '.',
                previewDescriptionFieldLabel: 'Preview of the description field',
                otherPreferencesLabel: 'Other preferences',
                otherPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in QuickBooks Desktop from ' + brandingConfig.brandName + '.',
                autoCreateEmployeeLabel: 'Auto-create employee as ',
                autoCreateMerchantsAsVendorsLabel: 'Auto-create merchants as vendors',
                autoCreateMerchantsAsVendorsSubLabel: 'Fyle will auto-create a new vendor in QuickBooks Desktop if a merchant added by an employee does not have a corresponding match in QuickBooks Desktop. ',
                skipExportLabel: 'Skip export of specific expenses from ' + brandingConfig.brandName + ' to QuickBooks Desktop',
                skipExportSubLabel: 'You could choose to skip expenses from ' + brandingConfig.brandName + ' to QuickBooks Desktop by setting up a conditional rule. '
            }
        }
    },
    netsuite: {
        landing: {
            contentText: 'Import chart of accounts and projects from NetSuite and export expenses from your Expense Management account.',
            guideHeaderText: 'How to setup your integration'
        },
        configuration: {
            connector: {
                configurationHeaderText: 'Connect to NetSuite subsidary',
                configurationSubHeaderText: 'Expenses will be posted to the NetSuite subsidary selected here. You can\'t change the subsidary once they\'re configured.',
                stepName: 'Connect to NetSuite',
                subLabel: 'Provide your credentials to establish a secure connection between your Expense Management and NetSuite account'
            },
            exportSetting: {
                stepName: 'Export settings',
                headerText: ' Export Corporate Card Expenses',
                contentText: 'Configure how and when expenses from Expense Management can be exported to NetSuite.',
                corporateCard: {
                    creditCardExpenseLabel: 'How should the expenses be exported?',
                    cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to NetSuite.',
                    creditCardExportTypeSubLabel: 'Expenses can either be exported as single line items (i.e., expenses) or as a grouped report with multiple line items (i.e., expense reports).',
                    expenseState: 'Select export state',
                    creditCardExpenseSubLabel: 'Choose the type of NetSuite transaction to export your expenses.',
                    cccExpenseStateSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed.',
                    creditCardExpenseStateLabel: 'How should expenses be labeled  before exporting from Expense Management?',
                    creditCardExpenseStateSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed.',
                    defaultCCCAccountLabel: 'Set default credit card account as',
                    defaultCCCAccountPlaceholder: 'Select default credit card account',
                    defaultDebitCardAccountLabel: 'Set employee payables account as',
                    defaultDebitCardAccountPlaceholder: 'Select default debit card account',
                    defaultCCCVendorLabel: 'Set default corporate card vendor as',
                    accountsPayableLabel: 'Set vendor payables account as',
                    journalOptionLabel: 'Name in journal entry',
                    journalOptionSubLabel: 'You can select either the \'merchant name\' or the \'employee name\' to appear in the \'name\' field of your journal entries.'
                }
            },
            importSetting: {
                stepName: 'Import settings',
                headerText: '',
                contentText: 'Choose the required import fields from NetSuite to Expense Management.',
                importCategoriesLabel: ' as categories',
                importCategoriesSubLabel: ' will be available as categories in Expense Management.',
                importCustomersLabel: 'Import customers from NetSuite',
                importCustomersSubLabel: 'The customers in NetSuite will be imported as projects in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense',
                taxCodeLabel: 'Import tax from NetSuite',
                taxCodeSubLabel: 'The imported tax codes from NetSuite will be set as tax group in ',
                defaultTaxCodeLabel: 'Select Default tax Code',
                importSuppliersAsMerchantsLabel: 'Import vendors from NetSuite as merchants',
                importSuppliersAsMerchantsSubLabel: 'The vendors in NetSuite will be imported as merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                notes: 'NOTE: To export billable expenses from ' + brandingConfig.brandName + ', import customers from NetSuite as projects in ' + brandingConfig.brandName + '.',
                toggleToastMessage: 'You have already mapped a tracking category from NetSuite to the project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import customers in the project field.',
                importVendorsAsMerchantsLabel: 'Import vendors from NetSuite',
                importNetsuiteEmployeesLabel: 'Import NetSuite employee as employee in ' + brandingConfig.brandName,
                importNetsuiteEmployeesSubLabel: 'Imported NetSuite employee will be available as employee in Expense Management.',
                customSegmentHeader: 'Add custom segment/list/record',
                importProjectsLabel: 'Import projects from NetSuite',
                importItemsLabel: 'Import items from NetSuite'
            },
            advancedSettings: {
                stepName: 'Advanced settings',
                contentText: 'Customize the integration based on your accounting requirements.',
                scheduleAutoExport: 'Schedule automatic export',
                email: 'Send error notification to',
                paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                autoCreateVendorsLabel: 'Auto create ',
                autoCreateMerchantsAsVendorsLabel: 'Auto create ' + brandingConfig.brandName + ' merchants as vendors on NetSuite',
                billPaymentAccountLabel: 'To which payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected payment account in ',
                postEntriesCurrentPeriod: 'Post entries in the current accounting period',
                dfvSubLabel: 'If you\'ve made a field mandatory in NetSuite but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses.',
                dfvLabel: 'Default field values',
                changeAccountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                defaultPaymentAccount: 'Select payment bank account',
                memoStructureLabel: 'Set the line-item description field in NetSuite',
                memoStructureSubLabel: 'Choose from a list of available data points that you\'d like to export to the description field in NetSuite. ',
                customizationSubLabel: 'Customize the data that you\'d like to export from Expense Management to NetSuite by choosing which data points need to be exported.',
                automationSubLabel: 'Automate exports and data syncs.',
                scheduleSubLabel: 'Set up a schedule to automate the export of expenses from Expense Management to NetSuite.',
                frequencySubLabel: 'Set how often your expenses will be exported to NetSuite.',
                preferenceLabel: 'Other preferences',
                preferenceSubLabel: 'Create new records in NetSuite if no vendor record is found or the accounting period is closed.',
                previewDescriptionFieldLabel: 'Preview of the description field',
                autoCreateMerchantsLabel: 'Auto create merchant on NetSuite for credit card charge'
            }
        }
    },
    xero: {
        landing: {
            contentText: 'Import GL accounts and projects from Xero and export expenses from your ' + brandingConfig.brandName + ' account.',
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
                    cccExpenseBankAccountSubLabel: 'Expenses of corporate cards in Expense Management that aren\'t mapped to their respective bank accounts in Xero will post to this bank account.',
                    creditCardExportTypeSubLabel: 'Choose how transactions are exported to Xero.',
                    expenseState: '',
                    creditCardExpenseSubLabel: '',
                    cccExpenseBankAccountLabel: 'Which bank account should the bank transactions post to?',
                    cccExpenseStateSubLabel: 'You can choose to only export expenses when they\'ve been labeled approved or closed. '
                },
                stepSubLabel: 'Configure how and when expenses from Expense Management can be exported to Xero.',
                cccExpenseStateLabel: 'How should expenses be labeled before exporting from Expense Management?'
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'Choose the required import fields from Xero to Expense Management.',
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
                frequencySubLabel: 'Set how often your expenses will be exported to Xero.',
                contentText: 'Customize the integration based on your accounting requirements.',
                automationSubLabel: 'Automate exports and data syncs.',
                scheduleSubLabel: 'Set up a schedule to automate the export of expenses from Expense Management to Xero.',
                accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                autoCreateVendorsSubLabel: 'Automatically create a new contact in Xero if an added merchant doesn\'t have a corresponding match.',
                customPreferencesLabel: 'Other preferences',
                customPreferencesSubLabel: 'Create new records in Xero if no contacts found or the accounting period is closed.'
            }
        }
    },
    intacct: {
        landing: {
            contentText: 'Import GL accounts and projects from Sage Intacct and export expenses from your Expense Management account.',
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
                subLabel: 'Provide your credentials to establish a secure connection between your Expense Management and Sage Intacct account. ',
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
                    chargeCardSublabel: 'Expenses of corporate cards in Expense Management that aren\'t mapped to their respective cards in Sage Intacct will post to this card. You can still map cards after configuring the integration.',
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
                autoCreateMerchantsAsVendorsLabel: 'Auto-create ' + brandingConfig.brandName + ' merchants as vendors on Sage Intacct',
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
                automationSubLabel: 'Automate exports and data syncs.',
                frequencySubLabel: 'Set how often your expenses will be exported to Sage Intacct.',
                scheduleSubLabel: 'Set up a schedule to automate the export of expenses from Expense Management to Sage Intacct.',
                accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period.',
                memoStructureSubLabel: 'Choose from a list of available data points that you\'d like to export to the description field in Sage Intacct.',
                customizeSectionSubLabel: 'Customize the data that you\'d like to export from Expense Management to Sage Intacct by choosing which data points need to be exported.'
            },
            done: {
                ctaText: '',
                hintText: ''
            }
        }
    },
    configuration: {
        connector: {
            stepName: 'Connect to QuickBooks Online'
        },
        employeeSetting: {
            stepName: 'Map employees'
        },
        exportSetting: {
            stepName: 'Export settings',
            headerText: 'Export corporate card expenses',
            contentText: 'Configure how and when expenses from Expense Management can be exported to QuickBooks Online.',
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
                creditCardExpenseLabel: 'How should expenses be labeled  before exporting from Expense Management?',
                creditCardExportTypeSubLabel: 'Choose how transactions are exported to QuickBooks Online.'
            }
        },
        importSetting: {
            stepName: 'Import settings',
            headerText: '',
            contentText: 'Choose the required import fields from QuickBooks Online to Expense Management.',
            importCategoriesLabel: 'Import the chart of accounts as categories',
            importCategoriesSubLabel: 'Imported accounts will be available as categories in Expense Management.',
            importItemsLabel: 'Import products/services from QuickBooks Online',
            importItemsSubLabel: 'Products/services from QuickBooks Online will be imported as categories in Expense Management.',
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
            scheduleSubLabel: 'Set up a schedule to automate the export of expenses from Expense Management to QuickBooks Online.',
            frequencySubLabel: 'Set how often your expenses will be exported to QuickBooks Online.',
            otherPreferencesLabel: 'Other preferences',
            otherPreferencesSubLabel: 'Create new records in QuickBooks Online if no vendor record is found or the accounting period is closed.',
            accountingPeriodLabel: 'Post entries in the current open accounting period.',
            accountingPeriodSubLabel: 'If the accounting period is closed, the expenses will be exported with a date stamp for the first day of the current open accounting period',
            autoCreateMerchantsAsVendorsSubLabel: 'Automatically create a new vendor in QuickBooks Online if an added merchant doesn\'t have a corresponding match.',
            customizeSectionSubLAbel: 'Customize the data that you\'d like to export from Expense Management to QuickBooks Online by choosing which data points need to be exported.',
            memoStructureSubLabel: 'Choose from a list of available data points that you\'d like to export to the description field in QuickBooks Online.',
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
        contentText: 'Import GL accounts and projects from QuickBooks Online and export expenses from your Expense Management account.',
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