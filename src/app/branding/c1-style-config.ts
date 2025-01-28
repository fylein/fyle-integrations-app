import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const c1Styles = {
    common: {
        configurationContents: 'tw-mx-60-px tw-shadow-shadow-level-1',
        mainComponentPadding: 'tw-px-60-px',
        mainComponentShadow: 'tw-shadow-shadow-level-1'
    },
    mapping: {
        mappingHeaderBoxShadow: 'tw-shadow-shadow-level-1'
    }
};
