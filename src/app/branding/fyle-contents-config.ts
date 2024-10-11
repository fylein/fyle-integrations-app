import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const fyleContents = {
    qbd_direct: {
        landing: {
            contentText: 'Import data from NetSuite to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to NetSuite. ',
            guideHeaderText: 'Guide to setup your integrations'
        },
        configuration: {
            connector: {
                configurationHeaderText: 'Connect to NetSuite Tenant',
                configurationSubHeaderText: 'Connect to the NetSuite Tenant from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and NetSuite Tenant cannot be changed once the configuration steps are complete.',
                stepName: 'Connect to NetSuite',
                subLabel: 'Expenses will be posted to the NetSuite Tenant Mapping selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or Tenant Mapping.'
            },
            exportSetting: {
                stepName: 'Export Settings',
                headerText: ' Export Corporate Card Expenses',
                contentText: 'In this section, you can configure how and when the expenses from ' + brandingConfig.brandName + ' can be exported to QuickBooks Desktop',
                reimbursable: {
                    reimbursableExpenseLabel: 'Export Reimbursable Expenses',
                    reimbursableExpenseSubLabel: 'Enable this to export the reimbursable expenses from ' + brandingConfig.brandName + '. If not enabled, any <b>out-of-pocket</b> expenses will not be exported to Quickbooks Desktop.',
                    reimbursableExpenseTypeLabel: 'How should the expenses be exported?',
                    reimbursableExpenseTypeSubLabel: 'Choose the type of transaction in QuickBooks Desktop to export your ' + brandingConfig.brandName +' expenses.',
                    reimbursableExpenseStateLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                    reimbursableExpenseStateSubLabel: 'You can export expenses either when they are awaiting closure after approval (Processing) or when the payment has been settled (Closed).',
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
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'In this section, you can choose the fields required to be imported from QuickBooks Desktop to ' + brandingConfig.brandName + '. ',
                importCategoriesLabel: 'Import the Chart of Accounts as Categories in ' + brandingConfig.brandName,
                importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                importItemsLabel: 'Import Products/Services from QuickBooks Desktop',
                importItemsSubLabel: 'Products/services from QuickBooks Desktop will be imported as Categories in ' + brandingConfig.brandName + '.',
                importVendorsAsMerchantsLabel: 'Import Vendors from QuickBooks Desktop',
                chartOfAccountTypes: 'Select the accounts from QuickBooks Desktop to import as categories in ' + brandingConfig.brandName,
                chartOfAccountTypesSubLabel: 'By default expense will be selected. Open the dropdown to select more as per your requirements.'
            },
            advancedSettings: {
                stepName: 'Advanced Settings',
                contentText: 'In this section, you can customize the integration based on your accounting requirements. ',
                automationLabel: 'Automation',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                customizeSectionLabel: 'Customization',
                customizeSectionSubLabel: 'In this section, you can customize the data that you\'d like to export from Fyle to QuickBooks Desktop You can choose what data points need to be exported and what shouldn\'t be.',
                scheduleAutoExportLabel: 'Schedule automatic export',
                scheduleAutoExportSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to QuickBooks Desktop.',
                autoExportfrequencyLabel: 'Set up export frequency',
                autoExportfrequencySubLabel: 'Set a frequency based on how often you want your expenses in Fyle to be exported to QuickBooks Desktop.',
                topLevelMemoStructureLabel: 'Select the top level memo field data for QuickBooks Desktop',
                topLevelMemoStructureSubLabel: 'You can customize the <b>data point</b> you would like to export to QuickBooks Desktop\’s <b>top-level memo</b> field while exporting expenses from ' + brandingConfig.brandName + '.',
                memoStructureLabel: 'Set the line-ttem level memo field data for QuickBooks Desktop.',
                memoStructureSubLabel: 'You can customize the data set you would like to export to QuickBooks Desktop\’s <b>transaction line-item level memo</b> field while exporting expenses from ' + brandingConfig.brandName + '.',
                previewDescriptionFieldLabel: 'Preview of the Description Field',
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
            contentText: 'Import data from NetSuite to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to NetSuite. ',
            guideHeaderText: 'Guide to setup your integrations'
        },
        configuration: {
            connector: {
                configurationHeaderText: 'Connect to NetSuite Tenant',
                configurationSubHeaderText: 'Connect to the NetSuite Tenant from which you would like to import and export data. The ' + brandingConfig.brandName + ' org and NetSuite Tenant cannot be changed once the configuration steps are complete.',
                stepName: 'Connect to NetSuite',
                subLabel: 'Expenses will be posted to the NetSuite Tenant Mapping selected here. Once configured, you can not change ' + brandingConfig.brandName + ' organization or Tenant Mapping.'
            },
            exportSetting: {
                stepName: 'Export Settings',
                headerText: ' Export Corporate Card Expenses',
                contentText: 'In this section, you can configure how and when the expenses from ' + brandingConfig.brandName + ' can be exported to NetSuite',
                corporateCard: {
                    creditCardExpenseLabel: 'How should the expenses be exported?',
                    cccExpenseBankAccountSubLabel: 'The selected expense payment type will be added to the corporate credit card expenses exported from ' + brandingConfig.brandName + ' to NetSuite.',
                    creditCardExportTypeSubLabel: 'Expenses can either be exported as single line items (Expense) or as a grouped report with multiple line items (Report)',
                    expenseState: 'Select export state',
                    creditCardExpenseStateSubLabel: 'You could choose to export ccc expenses when they have been approved and are awaiting payment clearance, or simply when they have been paid out.',
                    creditCardExpenseStateLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                    creditCardExpenseSubLabel: 'Choose the type of transaction in NetSuite to export your ' + brandingConfig.brandName +' expenses.',
                    cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (Approved) or when the payment has been settled (Closed).',
                    defaultCCCAccountLabel: 'Set Default Credit Card Account as',
                    defaultCCCAccountPlaceholder: 'Select Default Credit Card Account',
                    defaultDebitCardAccountLabel: 'Set Employee Payables Account as',
                    defaultDebitCardAccountPlaceholder: 'Select Default Debit Card Account',
                    defaultCCCVendorLabel: 'Set Default Corporate Card Vendor as',
                    accountsPayableLabel: 'Set Vendor Payables Account as',
                    journalOptionLabel: 'Name in Journal Entry',
                    journalOptionSubLabel: 'You can select either the \'Merchant Name\' or the \'Employee Name\' to appear in the \'Name\' field of your Journal Entries.'
                }
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'In this section, you can choose the fields required to be imported from NetSuite to ' + brandingConfig.brandName + '. ',
                importCategoriesLabel: ' as Categories in ' + brandingConfig.brandName,
                importCategoriesSubLabel: ' will be available as Categories in ' + brandingConfig.brandName + '.',
                importCustomersLabel: 'Import Customers from NetSuite',
                importCustomersSubLabel: 'The Customers in NetSuite will be imported as Projects in Fyle and will be a selectable field while creating an expense',
                taxCodeLabel: 'Import Tax from NetSuite',
                taxCodeSubLabel: 'The imported Tax codes from NetSuite will be set as Tax group in ',
                defaultTaxCodeLabel: 'Select Default Tax Code',
                importSuppliersAsMerchantsLabel: 'Import Suppliers from NetSuite as Merchants',
                importSuppliersAsMerchantsSubLabel: 'The Suppliers in NetSuite will be imported as Merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                notes: 'NOTE: To export billable expenses from Fyle, import Customers from NetSuite as Projects in Fyle.',
                toggleToastMessage: 'You have already mapped a tracking category from NetSuite to the Project field in '+ brandingConfig.brandName +'. Change the configured mapping to a new field to be able to import Customers in the Project field.',
                importVendorsAsMerchantsLabel: 'Import Vendors from NetSuite',
                importNetsuiteEmployeesLabel: 'Import NetSuite Employee as Employee in ' + brandingConfig.brandName,
                importNetsuiteEmployeesSubLabel: 'Imported NetSuite Employee will be available as Employee in ' + brandingConfig.brandName+ '.',
                customSegmentHeader: 'Add Custom Segment/List/Record',
                importProjectsLabel: 'Import Projects from NetSuite',
                importItemsLabel: 'Import Items from NetSuite'
            },
            advancedSettings: {
                stepName: 'Advanced Settings',
                contentText: 'In this section, you can customize the integration based on your accounting requirements. ',
                scheduleAutoExport: 'Schedule automatic export',
                email: 'Send error notification to',
                paymentSyncLabel: 'Auto-sync payment status for reimbursable expenses',
                autoCreateVendorsLabel: 'Auto create ',
                autoCreateMerchantsAsVendorsLabel: 'Auto Create ' + brandingConfig.brandName + ' Merchants as Contacts on NetSuite',
                billPaymentAccountLabel: 'To which Payment account should the payment entries be posted?',
                billPaymentAccountSubLabel: ', the payment entries will be posted to the selected Payment account in ',
                postEntriesCurrentPeriod: 'Post entries in the next open accounting period',
                dfvSubLabel: 'If you\'ve made a field mandatory in NetSuite but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses. For Location and Department, you can opt to use the values from your employee records in NetSuite.',
                dfvLabel: 'Default Field Values',
                changeAccountingPeriodSubLabel: 'If the accounting period in NetSuite is closed, the expenses from ' + brandingConfig.brandName + ' will be exported with a date stamp of the first day next open accounting period.',
                defaultPaymentAccount: 'Select Payment Bank Account',
                memoStructureLabel: 'Set the line item-level description field in NetSuite',
                memoStructureSubLabel: 'You can choose from a list of available data points that you\'d like to export to the description field in NetSuite.',
                customizationSubLabel: 'In this section, you can customize the data that you\'d like to export from ' + brandingConfig.brandName + ' to NetSuite, You can choose what data points need to be exported and what shouldn\'t be.',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to NetSuite.',
                frequencySubLabel: 'Set a frequency based on how often you want your expenses in ' + brandingConfig.brandName + ' to be exported to NetSuite.',
                preferenceLabel: 'Other Preferences',
                preferenceSubLabel: 'Based on your preference, you can choose whether you want to create any new records in NetSuite from Fyle. (when there is no employee record found, or when the accounting period is closed).',
                previewDescriptionFieldLabel: 'Preview of the Description Field',
                autoCreateMerchantsLabel: 'Auto Create Merchant on NetSuite for Credit Card Charge'
            }
        }
    },
    xero: {
        landing: {
            contentText: 'Import data from Xero to ' + brandingConfig.brandName + ' and export expenses from ' + brandingConfig.brandName + ' to Xero. ',
            guideHeaderText: 'Guide to setup your integrations'
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
                    cccExpenseBankAccountLabel: 'To which Bank Account should the Bank Transactions be posted to?',
                    cccExpenseStateSubLabel: 'You can export expenses either when they\'re awaiting payment after approval (Approved) or when the payment has been settled (Closed).'
                },
                cccExpenseStateLabel: 'At which state should the expenses be ready to export from ' + brandingConfig.brandName + '?',
                stepSubLabel: 'In this section, you will configure how and when expenses from ' + brandingConfig.brandName + ' can be exported to Xero.'
            },
            importSetting: {
                stepName: 'Import Settings',
                headerText: '',
                contentText: 'In this section, you can choose the fields required to be imported from Xero to Fyle',
                importCategoriesLabel: 'Import the Chart of Accounts as Categories in ' + brandingConfig.brandName + '.',
                importCategoriesSubLabel: 'Imported account will be available as Categories in ' + brandingConfig.brandName + '.',
                importCustomersLabel: 'Import Customers from Xero',
                importCustomersSubLabel: 'The Customers in Xero will be imported as Projects in Fyle and will be a selectable field while creating an expense',
                taxCodeLabel: 'Import Tax from Xero',
                taxCodeSubLabel: 'The imported Tax codes from Xero will be set as Tax group in ',
                defaultTaxCodeLabel: 'Select Default Tax Code',
                importSuppliersAsMerchantsLabel: 'Import Suppliers from Xero as Merchants',
                importSuppliersAsMerchantsSubLabel: 'The Suppliers in Xero will be imported as Merchants in ' + brandingConfig.brandName + ' and will be a selectable field while creating an expense.',
                notes: 'NOTE: To export billable expenses from Fyle, import Customers from Xero as Projects in Fyle.',
                toggleToastMessage: 'You have already mapped a tracking category from Xero to the Project field in ' + brandingConfig.brandName + '. Change the configured mapping to a new field to be able to import Customers in the Project field.',
                chartOfAccountsLabel: 'Select the accounts from Xero to import as categories in' + brandingConfig.brandName,
                chartOfAccountsSubLabel: 'By default expense will be selected. Open the dropdown to select more as per your requirements.'
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
                contentText: 'In this section, you can customize the integration based on your accounting requirements. ',
                frequencySubLabel: 'Set a frequency based on how often you want your expenses in Fyle to be exported to Xero.',
                customPreferencesLabel: 'Other Preferences',
                customPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in Xero from ' + brandingConfig.brandName + '. (when there is no employee record found, or when the accounting period is closed)',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to Xero.',
                accountingPeriodSubLabel: 'If there are expenses for which the accounting period is closed in Xero, you can export those to the current month by enabling this option.',
                autoCreateVendorsSubLabel: 'While exporting reimbursable expenses from Fyle, the integration will automatically create a vendor if a match does not exist in Xero already'
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
                subLabel: 'To connect your ' + brandingConfig.brandName + ' and Sage Intacct account, follow the detailed instructions provided in the article to generate the credentials and establish a secure connection.'
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
                autoCreateMerchantsAsVendorsLabel: 'Auto-Create Merchants as Vendors',
                postEntriesCurrentPeriod: 'Post Entries in the Current Accounting Period',
                setDescriptionField: 'Set the Description Field in Sage Intacct',
                dfvLabel: 'Default Field Values',
                dfvSubLabel: 'If you\'ve made a field mandatory in Sage Intacct but don\'t collect a value from your employees in the expense form, you can set a default value here to be added to all the expenses. For Location and Department, you can opt to use the values from your employee records in Sage Intacct.',
                location: 'Location',
                department: 'Department',
                project: 'Project',
                class: 'Class',
                item: 'Item',
                frequencySubLabel: 'Set a frequency based on how often you want your expenses in ' + brandingConfig.brandName + ' to be exported to Sage Intacct.',
                customPreferencesLabel: 'Other Preferences',
                customPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in Sage Intacct from ' + brandingConfig.brandName + '. (when there is no employee record found, or when the accounting period is closed)',
                automationSubLabel: 'You can automate the export and sync of your data in this section.',
                scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from ' + brandingConfig.brandName + ' to Sage Intacct.',
                accountingPeriodSubLabel: 'If there are expenses for which the accounting period is closed in Sage Intacct, you can export those to the current month by enabling this option.',
                memoStructureSubLabel: 'You can choose from a list of available data points that you would like to export to the description field in Sage Intacct.',
                customizeSectionSubLabel: 'In this section, you can customize the data that you\'d like to export from ' + brandingConfig.brandName + ' to Sage Intacct You can choose what data points need to be exported and what shouldn\'t be.'
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
                defaultCCCVendorLabel: 'Set Default Corporate Card Vendor as',
                defaultCCCVendorSubLabel: 'This selected vendor will be applied on all Corporate Card Transactions exported to QuickBooks Online.',
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
            scheduleSubLabel: 'Set up a schedule to frequently automate the export of expenses from Fyle to QuickBooks Online.',
            frequencySubLabel: 'Set a frequency based on how often you want your expenses in Fyle to be exported to QuickBooks Online.',
            otherPreferencesLabel: 'Other Preferences',
            otherPreferencesSubLabel: 'Based on your preference, you can choose whether you want to create any new records in QuickBooks Online from Fyle. (when there is no employee record found, or when the accounting period is closed)',
            accountingPeriodLabel: 'Post entries in the current accounting period',
            accountingPeriodSubLabel: 'If there are expenses for which the accounting period is closed in QuickBooks Online, you can export those to the current month by enabling this option.',
            autoCreateMerchantsAsVendorsSubLabel: 'Fyle will auto-create a new vendor in QuickBooks Online if a merchant added by an employee does not have a corresponding match in QuickBooks Online. ',
            customizeSectionSubLAbel: 'In this section, you can customize the data that you\'d like to export from ' + brandingConfig.brandName + ' to QuickBooks Online You can choose what data points need to be exported and what shouldn\'t be.',
            memoStructureSubLabel: 'You can choose from a list of available data points that you\'d like to export to the description field in QuickBooks Online.',
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
        customFieldCreateandSave: 'Create and save',
        currentDate: 'Export Date'
    }
};