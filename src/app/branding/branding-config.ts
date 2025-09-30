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

const staticFeatureConfigs: FeatureConfiguration = {
    fyle: fyleFeatureConfig,
    co: c1FeatureConfig
};

const staticKbArticles: KbArticle = {
    fyle: fyleKbArticles,
    co: c1KbArticles
};

const staticDemoVideoLinks: DemoVideo = {
    fyle: fyleDemoVideoLinks,
    co: c1DemoVideoLinks
};

const staticStyles = {
    fyle: fyleStyles,
    co: c1Styles
};

// Global registry for dynamic values
class BrandingRegistry {
    private _config: BrandingConfiguration;

    private _featureConfig: FeatureConfiguration[string];

    private _kbArticles: KbArticle[string];

    private _demoVideoLinks: DemoVideo[string];

    private _style: any;

    constructor() {
        // Initialize with static defaults once
        this._config = { ...staticBrandingConfig };
        this._featureConfig = { ...staticFeatureConfigs[staticBrandingConfig.brandId] };
        this._kbArticles = { ...staticKbArticles[staticBrandingConfig.brandId] };
        this._demoVideoLinks = { ...staticDemoVideoLinks[staticBrandingConfig.brandId] };
        this._style = { ...staticStyles[staticBrandingConfig.brandId] };
    }

    setConfig(config: BrandingConfiguration): void {
        this._config = { ...config };

        if (config.brandId) {
            this._featureConfig = { ...staticFeatureConfigs[config.brandId] };
            this._kbArticles = { ...staticKbArticles[config.brandId] };
            this._demoVideoLinks = { ...staticDemoVideoLinks[config.brandId] };
            this._style = { ...staticStyles[config.brandId as keyof typeof staticStyles] };
        }
    }

    updateFeatureConfig(featureUpdates: Partial<FeatureConfiguration[string]>): void {
        this._featureConfig = { ...this._featureConfig, ...featureUpdates };
    }

    get config(): BrandingConfiguration {
        return this._config;
    }

    get featureConfig(): FeatureConfiguration[string] {
        return this._featureConfig;
    }

    get kbArticles(): KbArticle[string] {
        return this._kbArticles;
    }

    get demoVideoLinks(): DemoVideo[string] {
        return this._demoVideoLinks;
    }

    get style(): any {
        return this._style;
    }
}

const registry = new BrandingRegistry();

export function updateBrandingConfigRegistry(config: BrandingConfiguration) {
    registry.setConfig(config);
}

export function updateFeatureConfigRegistry(featureUpdates: Partial<FeatureConfiguration[string]>) {
    registry.updateFeatureConfig(featureUpdates);
}

// Export default static branding configs for service initialization
export const defaultBrandingConfig = staticBrandingConfig;
export const defaultBrandingFeatureConfig = staticFeatureConfigs[staticBrandingConfig.brandId];
export const defaultBrandingKbArticles = staticKbArticles[staticBrandingConfig.brandId];
export const defaultBrandingDemoVideoLinks = staticDemoVideoLinks[staticBrandingConfig.brandId];
export const defaultBrandingStyle = staticStyles[staticBrandingConfig.brandId];

// Dynamic exports using Proxy - these will automatically reflect changes
export const brandingConfig = new Proxy({} as BrandingConfiguration, {
    get: (target, prop) => registry.config[prop as keyof BrandingConfiguration],
    ownKeys: () => Object.keys(registry.config),
    has: (target, prop) => prop in registry.config,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.config, prop)
});

export const brandingFeatureConfig = new Proxy({} as FeatureConfiguration[string], {
    get: (target, prop) => registry.featureConfig[prop as keyof FeatureConfiguration[string]],
    ownKeys: () => Object.keys(registry.featureConfig),
    has: (target, prop) => prop in registry.featureConfig,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.featureConfig, prop)
});

export const brandingKbArticles = new Proxy({} as KbArticle[string], {
    get: (target, prop) => registry.kbArticles[prop as keyof KbArticle[string]],
    ownKeys: () => Object.keys(registry.kbArticles),
    has: (target, prop) => prop in registry.kbArticles,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.kbArticles, prop)
});

export const brandingDemoVideoLinks = new Proxy({} as DemoVideo[string], {
    get: (target, prop) => registry.demoVideoLinks[prop as keyof DemoVideo[string]],
    ownKeys: () => Object.keys(registry.demoVideoLinks),
    has: (target, prop) => prop in registry.demoVideoLinks,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.demoVideoLinks, prop)
});

export const brandingStyle = new Proxy({} as any, {
    get: (target, prop) => registry.style[prop],
    ownKeys: () => Object.keys(registry.style),
    has: (target, prop) => prop in registry.style,
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(registry.style, prop)
});
