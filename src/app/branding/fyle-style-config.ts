import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const fyleStyles = {
    common: {
        configurationCommonStyle: 'tw-mx-120-px tw-shadow-app-card',
        mainPaddingStyle: 'tw-px-120-px',
        mainShadowStyle: 'tw-shadow-app-card'
    },
    mapping: {
        mappingHeaderBoxShadow: 'tw-shadow-stats-box'
    }
};