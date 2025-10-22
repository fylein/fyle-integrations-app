import { AllowedAppsConfiguration } from "../core/models/branding/expose-app-configuration.model";

export const exposeAppConfig: AllowedAppsConfiguration = {
    fyle: {
        'staging-1-in': {
            INTACCT: true,
            SAGE300: true,
            QBO: true,
            BUSINESS_CENTRAL: true,
            TRAVELPERK: true,
            XERO: true,
            NETSUITE: true,
            QBD: true,
            BAMBOO_HR: true,
            QBD_DIRECT: true,
            SAGE50: true
        },
        'production-1-in': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: true,
            XERO: true,
            NETSUITE: true,
            QBD: true,
            BAMBOO_HR: true,
            QBD_DIRECT: false,
            SAGE50: false
        },
        'production-1-us': {
            INTACCT: true,
            SAGE300: true,
            QBO: true,
            BUSINESS_CENTRAL: true,
            TRAVELPERK: true,
            XERO: true,
            NETSUITE: true,
            QBD: true,
            BAMBOO_HR: true,
            QBD_DIRECT: true,
            // TODO(sage50): enable after dev
            SAGE50: false
        }
    },
    co: {
        'c1-staging': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: false,
            XERO: true,
            NETSUITE: true,
            QBD: false,
            BAMBOO_HR: false,
            QBD_DIRECT: true,
            SAGE50: false
        },
        'c1-qa': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: false,
            XERO: true,
            NETSUITE: true,
            QBD: false,
            BAMBOO_HR: false,
            QBD_DIRECT: true,
            SAGE50: false
        },
        'c1-production-1-us': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: false,
            XERO: true,
            NETSUITE: true,
            QBD: false,
            BAMBOO_HR: false,
            QBD_DIRECT: false,
            SAGE50: false
        }
    }
};
