import { BrandingConfiguration } from "../core/models/branding/branding-configuration.model";
import { configuration } from "../integrations/intacct/intacct.fixture";
import config from './config.json';

export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

export const c1Styles = {
    common: {
        configurationContents: 'tw-mx-60-px tw-shadow-shadow-level-1',
        mainComponentPadding: 'tw-px-60-px',
        mainComponentShadow: 'tw-shadow-shadow-level-1',
        inputLabelTextStyle: 'tw-pt-4-px',
        configurationBrandingClass: 'co'
    },
    mapping: {
        mappingHeaderBoxShadow: 'tw-shadow-shadow-level-1'
    },
    configurationComponents: {
        configurationImportSvgPadding: 'tw-pt-16-px',
        configurationImportFieldDependentField: 'tw-pr-24-px tw-pl-[58px]',
        configurationImportFieldDependentFieldSvg: 'tw-pt-42-px',
        configurationImportFieldDropDownText: '!tw-font-600 tw-text-12-px',
        configurationStepHeaderH3Text: 'tw-text-18-px'
    },
    dashboard: {
        dashboardErrorResolveBtnText: 'p-button primary-outline'
    }
};
