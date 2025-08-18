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
    configuration: {
        importSvgPadding: 'tw-pt-16-px',
        importFieldDependentField: 'tw-pr-24-px tw-pl-[58px]',
        importFieldDependentFieldSvg: 'tw-pt-42-px',
        importFieldDropDownText: '!tw-font-600 tw-text-12-px',
        stepHeaderH3Text: 'tw-text-18-px',
        searchIconFocus: 'tw-text-search-focused-filled-border'
    },
    dashboard: {
        dashboardErrorResolveBtnText: 'p-button primary-outline',
        dashboardExportBtn: 'tw-rounded-4-px',
        dashboardMainMenu: 'tw-items-center'
    },
    buttons: {
        outlined: {
           class: 'tw-px-4',
           active: 'hover:tw-shadow-md tw-text-size-14 tw-bg-white tw-border tw-border-grey-300 tw-font-500 tw-cursor-pointer',
           disabled: 'tw-text-text-placeholder tw-cursor-not-allowed',
           iconColorActive: 'tw-text-text-secondary',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        primary: {
           class: 'p-button p-button-raised',
           active: 'tw-bg-primary',
           disabled: 'tw-text-text-placeholder tw-cursor-not-allowed',
           progress: 'tw-text-text-placeholder tw-cursor-not-allowed',
           loader: 'tw-border-t-border-tertiary',
           iconColorActive: 'tw-text-white',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        dialog: {
            cancel: 'tw-px-16-px tw-py-8-px outline-sm'
        }
    },
    toast: {
        class: 'tw-flex tw-justify-between tw-items-center tw-h-44-px tw-text-14-px tw-p-12-px',
        leftIcon: {
            class: 'tw-inline-flex tw-items-center',
            iconSize: '20px',
            background: {
                success: '',
                error: '',
                info: ''
            }
        },
        message: 'tw-text-toast-text-color tw-pl-8-px',
        close: {
            class: 'tw-inline-flex tw-items-center tw-cursor-pointer',
            iconSize: '20px',
            iconStyleClasses: 'tw-text-toast-text-color'
        },
        backgroundClass: {
            success: 'tw-bg-toast-success-bg',
            error: 'tw-bg-toast-error-bg',
            info: 'tw-bg-bg-info'
        }
    }
};