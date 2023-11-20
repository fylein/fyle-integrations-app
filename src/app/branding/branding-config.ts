import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import config from './config.json';

export const brandingConfig = config;

const featureConfigs: FeatureConfiguration = {
    fyle: {
        reimbursableExpenses: true
    },
    coco: {
        reimbursableExpenses: false
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
            TRAVELPERK: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            GUSTO: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle',
            SAGE300: 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle'
        },
        onboardingArticles: {
            INTACCT: {
                IMPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_85f929716c',
                EXPORT_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_6492c5038d',
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration#h_3f6718633c',
                LANDING: 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration',
                SKIP_EXPORT: 'https://help.fylehq.com/en/articles/7882821-how-to-skip-exporting-specific-expenses-from-fyle-to-sage-intacct'
            }
        }
    }
}

// @ts-ignore
export const brandingKbArticles = kbArticles[brandingConfig.brandId];
