import { Sage50ImportableField } from "../sage50/sage50-configuration/sage50-import-settings.model";

export type KbArticle = {
    [brandingId: string]: {
        topLevelArticles: {
            BAMBOO_HR: string;
            QBD: string;
            QBO: string;
            INTACCT: string;
            NETSUITE: string;
            TRAVELPERK: string;
            SAGE300: string;
            BUSINESS_CENTRAL: string;
            XERO: string;
            QBD_DIRECT: string;
            SAGE50: string;
        },
        onboardingArticles: {
            SAGE50: {
                PREREQUISITES: string;
                LANDING: string;
                EXPORT_SETTINGS: string;
                IMPORT_SETTINGS: string;
                ADVANCED_SETTINGS: string;
            },
            QBD_DIRECT: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                CONNECTOR: string;
                ASSISTED_SETUP_ARTICLE_LINK: string;
                HELPER_ARTICLE: string;
                GCAL_LINK: string;
                ERROR_RESOLUTION_GUIDE_LINK: string;
            },
            INTACCT: {
                DFV_READ_MORE: string;
                DEFAULT_BILLABLE_FIELD_BASED_ON_PROJECT_READ_MORE: string;
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                CONNECTOR: string;
                SKIP_EXPORT: string;
            },
            NETSUITE: {
                DFV_READ_MORE: string;
                CONNECTOR: string;
                EXPORT_SETTING: string;
                IMPORT_SETTING: string;
                ADVANCED_SETTING: string;
                SKIP_EXPORT: string;
            }
            SAGE300: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                SKIP_EXPORT: string;
                DEPENDANT_FIELD: string;
                COMMITMENT_FIELD: string;
            },
            QBO: {
                LANDING: string;
                CONNECTOR: string;
                EXPORT_SETTING: string;
                IMPORT_SETTING: string;
                ADVANCED_SETTING: string;
                SKIP_EXPORT: string;
            },
            BUSINESS_CENTRAL: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                SKIP_EXPORT: string;
            },
            TRAVELPERK: {
                PAYMENT_PROFILE_SETTINGS: string;
                ADVANCED_SETTING: string;
                LANDING: string;
            },
            XERO: {
                LANDING: string;
                CONNECTOR: string;
                EXPORT_SETTING: string;
                IMPORT_SETTING: string;
                ADVANCED_SETTING: string;
            },
        },
        postOnboardingArticles: {
            SAGE50: {
                EXPORT_LOG: string;
            } & Record<Sage50ImportableField, string>;
        }
    }
};
