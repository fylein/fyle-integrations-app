import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const fyleStyles = {
    common: {
        configurationContents: 'tw-mx-120-px tw-shadow-app-card',
        mainComponentPadding: 'tw-px-120-px',
        mainComponentShadow: 'tw-shadow-app-card',
        inputLabelTextStyle: 'tw-pt-8-px',
        configurationBrandingClass: 'fyle'
    },
    mapping: {
        mappingHeaderBoxShadow: 'tw-shadow-stats-box'
    },
    configurationComponents: {
        configurationImportSvgPadding: 'tw-pt-18-px',
        configurationImportFieldDependentField: '',
        configurationImportFieldDependentFieldSvg: 'tw-pt-46-px',
        configurationImportFieldDropDownText: '!tw-font-400 tw-text-14-px',
        configurationStepHeaderH3Text: ''
    },
    dashboard: {
        dashboardErrorResolveBtnText: 'p-button secondary-sm'
    }
};