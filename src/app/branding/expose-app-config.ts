import { AllowedAppsConfiguration } from "../core/models/branding/expose-app-configuration.model";

export const ExposeAppInLangingPage: AllowedAppsConfiguration = {
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
            BAMBOO: true
        },
        'production-1-in': {
            INTACCT: true,
            SAGE300: true,
            QBO: true,
            BUSINESS_CENTRAL: true,
            TRAVELPERK: true,
            XERO: true,
            NETSUITE: true,
            QBD: true,
            BAMBOO: true
        },
        'production-2-in': {
            INTACCT: true,
            SAGE300: true,
            QBO: true,
            BUSINESS_CENTRAL: true,
            TRAVELPERK: true,
            XERO: true,
            NETSUITE: true,
            QBD: true,
            BAMBOO: true
        }
    },
    co: {
        'c1-qa-1-us': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: false,
            XERO: true,
            NETSUITE: false,
            QBD: false,
            BAMBOO: false
            },
        'c1-production-1-us': {
            INTACCT: true,
            SAGE300: false,
            QBO: true,
            BUSINESS_CENTRAL: false,
            TRAVELPERK: false,
            XERO: true,
            NETSUITE: false,
            QBD: false,
            BAMBOO: false
        }
    }
};