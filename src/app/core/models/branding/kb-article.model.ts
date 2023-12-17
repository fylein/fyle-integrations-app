export type KbArticle = {
    [brandingId: string]: {
        topLevelArticles: {
            BAMBOO_HR: string;
            QBD: string;
            INTACCT: string;
            TRAVELPERK: string;
            GUSTO: string;
            SAGE300: string;
            BUSINESS_CENTRAL: string;
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                CONNECTOR: string;
                SKIP_EXPORT: string;
            },
            SAGE300: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                SKIP_EXPORT: string;
            },
            QBO: {
                LANDING: string;
                CONNECTOR: string;
                EMPLOYEE_SETTING: string;
                EXPORT_SETTING: string;
                IMPORT_SETTING: string;
                ADVANCED_SETTING: string;
                SKIP_EXPORT: string;
            }
            BUSINESS_CENTRAL: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                SKIP_EXPORT: string;
            }
        }
    }
};
