import { BrandingConfiguration } from '../core/models/branding/branding-configuration.model';
import { ContentConfiguration } from '../core/models/branding/content-configuration.model';
import { DemoVideo } from '../core/models/branding/demo-video.model';
import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import { c1Contents } from './c1-contents-config';
import config from './config.json';
import { fyleContents } from './fyle-contents-config';
import { fyleDemoVideoLinks, fyleFeatureConfig, fyleKbArticles } from './fyle-branding-config';
import { c1DemoVideoLinks, c1FeatureConfig, c1KbArticles } from './c1-branding-config';
import { fyleStyles } from './fyle-style-config';
import { c1Styles } from './c1-style-config';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

const featureConfigs: FeatureConfiguration = {
    fyle: fyleFeatureConfig,
    co: c1FeatureConfig
};

// @ts-ignore
export const brandingFeatureConfig = featureConfigs[brandingConfig.brandId];

const kbArticles: KbArticle = {
    fyle: fyleKbArticles,
    co: c1KbArticles
};

// @ts-ignore
export const brandingKbArticles = kbArticles[brandingConfig.brandId];

const demoVideoLinks: DemoVideo = {
    fyle: fyleDemoVideoLinks,
    co: c1DemoVideoLinks
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[brandingConfig.brandId];


const content: ContentConfiguration = {
    fyle: fyleContents,
    co: c1Contents
};

// @ts-ignore
export const brandingContent = content[brandingConfig.brandId];


const styles = {
    fyle: fyleStyles,
    co: c1Styles
};

// @ts-ignore
export const brandingStyle = styles[brandingConfig.brandId];

