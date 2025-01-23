import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const c1Styles = {
    common: {
        configurationCommonStyle: 'tw-mx-60-px tw-shadow-shadow-level-1'
    }
};
