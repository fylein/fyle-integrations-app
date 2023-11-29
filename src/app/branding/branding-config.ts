import { BrandingConfiguration } from '../core/models/branding/branding-configuration.model';
import { DemoVideo } from '../core/models/branding/demo-video.model';
import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config;

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
                ADVANCED_SETTING: 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-quickbooks-online-integration-v2-0#h_18c28de6c7'
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
            QBO: 'https://www.youtube.com/embed/b63lS2DG5j4'
        }
    }
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];
