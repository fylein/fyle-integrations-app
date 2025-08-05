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
    configuration: {
        importSvgPadding: 'tw-pt-18-px',
        importFieldDependentField: '',
        importFieldDependentFieldSvg: 'tw-pt-46-px',
        importFieldDropDownText: '!tw-font-400 tw-text-14-px',
        stepHeaderH3Text: '',
        searchIconFocus: 'tw-text-search-focused-search-icon'
    },
    dashboard: {
        dashboardErrorResolveBtnText: 'p-button secondary-sm',
        dashboardExportBtn: 'tw-rounded-32-px',
        dashboardMainMenu: 'tw-pt-8-px tw-pr-6 tw-pb-2 tw-pl-0'
    },
    buttons: {
        outlined: {
           class: 'tw-px-24-px tw-border-2 tw-rounded-32-px',
           active: 'hover:tw-border-border-green hover:tw-bg-bg-green hover:tw-text-white tw-text-size-14-px tw-font-primary tw-text-green-text-color tw-bg-white tw-border-mandatory-field-color',
           disabled: 'tw-text-text-placeholder tw-cursor-not-allowed',
           iconColorActive: 'tw-text-green-text-color',
           iconColorHover: 'tw-text-white',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        primary: {
           class: 'tw-rounded-32-px tw-text-14-px',
           active: 'hover:tw-bg-bg-green tw-font-primary tw-text-green-text-color tw-text-white tw-text-sm tw-bg-btn-primary-bg',
           disabled: 'tw-bg-bg-grey-primary tw-text-text-placeholder tw-cursor-not-allowed',
           progress: 'tw-bg-bg-grey-primary tw-text-text-placeholder tw-cursor-not-allowed',
           loader: 'tw-border-t-border-brand',
           iconColorActive: 'tw-text-white',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        dialog: {
            cancel: 'tw-px-16-px tw-py-8-px'
        },
        split_menu: {
            class: 'tw-font-primary tw-text-sm ',
            active: 'hover:tw-bg-bg-green tw-bg-btn-primary-bg tw-text-white ',
            disabled: ''
        }
    }
};