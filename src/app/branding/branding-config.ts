import { BrandingConfiguration } from '../core/models/branding/branding-configuration.model';
import { DemoVideo } from '../core/models/branding/demo-video.model';
import { FeatureConfiguration } from '../core/models/branding/feature-configuration.model';
import { KbArticle } from '../core/models/branding/kb-article.model';
import config from './config.json';
import { fyleDemoVideoLinks, fyleFeatureConfig, fyleKbArticles } from './fyle/branding-config';
import { c1DemoVideoLinks, c1FeatureConfig, c1KbArticles } from './c1/branding-config';
import { fyleStyles } from './fyle/style-config';
import { c1Styles } from './c1/style-config';

const staticBrandingConfig: BrandingConfiguration = config as BrandingConfiguration;

const featureConfigs: FeatureConfiguration = {
    fyle: fyleFeatureConfig,
    co: c1FeatureConfig
};

// @ts-ignore
export const brandingFeatureConfig = featureConfigs[staticBrandingConfig.brandId];

const kbArticles: KbArticle = {
    fyle: fyleKbArticles,
    co: c1KbArticles
};

// @ts-ignore
export const brandingKbArticles = kbArticles[staticBrandingConfig.brandId];

const demoVideoLinks: DemoVideo = {
    fyle: fyleDemoVideoLinks,
    co: c1DemoVideoLinks
};

// @ts-ignore
export const brandingDemoVideoLinks = demoVideoLinks[staticBrandingConfig.brandId];

const styles = {
    fyle: fyleStyles,
    co: c1Styles
};

// @ts-ignore
export const brandingStyle = styles[staticBrandingConfig.brandId];


class BrandingRegistry {
    private _config: BrandingConfiguration;

    constructor() {
        this._config = { ...staticBrandingConfig };
    }

    setConfig(config: BrandingConfiguration): void {
        this._config = { ...config };
    }

    get config(): BrandingConfiguration {
        return this._config;
    }
}

const registry = new BrandingRegistry();

export function updateBrandingConfigRegistry(config: BrandingConfiguration) {
    registry.setConfig(config);
}

export const defaultBrandingConfig = staticBrandingConfig;

export const brandingConfig = new Proxy({} as BrandingConfiguration, {
    get: (target, prop) => registry.config[prop as keyof BrandingConfiguration],
    ownKeys: () => Object.keys(registry.config),
    has: (target, prop) => prop in registry.config,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.config, prop)
});
