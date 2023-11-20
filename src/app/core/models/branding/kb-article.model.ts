export type KbArticle = {
    [brandingId: string]: {
        topLevelArticles: {
            BAMBOO_HR: string;
            QBD: string;
            INTACCT: string;
            TRAVELPERK: string;
            GUSTO: string;
            SAGE300: string;
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: string;
                EXPORT_SETTING: string;
                ADVANCED_SETTING: string;
                LANDING: string;
                SKIP_EXPORT: string;
            }
        }
    }
};
