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
        importSvgPadding: 'tw-pt-[17px]',
        importFieldDependentField: '',
        importFieldDependentFieldSvg: 'tw-pt-46-px',
        importFieldDropDownText: '!tw-font-400 tw-text-14-px',
        stepHeaderH3Text: '',
        searchIconFocus: 'tw-text-search-focused-search-icon'
    },
    dashboard: {
        dashboardErrorResolveBtnText: 'p-button secondary-sm',
        dashboardExportBtn: 'tw-rounded-32-px',
        dashboardMainMenu: 'tw-pr-6 tw-pl-0 tw-items-end'
    },
    checkbok: {
        theme: 'fyle-checkbox'
    },
    qbd_direct: {
        onboarding: {
            preRequisiteContainer: 'tw-rounded-border-radius-2xs',
            optionStepStateBackground: 'tw-bg-bg-secondary'
        }
    },
    buttons: {
        primary: {
           class: 'tw-rounded-32-px tw-font-primary tw-text-14-px',
           active: 'hover:tw-bg-bg-green tw-text-white tw-text-sm tw-bg-btn-primary-bg tw-border-3-px tw-border-transparent focus:tw-ring-[4px] focus:tw-ring-black focus:tw-border-border-focus',
           disabled: 'tw-bg-bg-grey-primary tw-text-text-placeholder tw-cursor-not-allowed',
           progress: 'tw-bg-bg-grey-primary tw-text-text-placeholder tw-cursor-not-allowed',
           loader: 'tw-border-t-border-brand',
           iconColorActive: 'tw-text-white',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        secondary: {
           class: 'tw-h-10 tw-border-2 tw-rounded-32-px tw-font-primary tw-text-size-14-px',
           active: 'hover:tw-border-border-green hover:tw-bg-bg-green hover:tw-text-white tw-text-green-text-color tw-bg-white tw-border-mandatory-field-color focus:tw-border-3-px focus:tw-ring-[4px] focus:tw-ring-black focus:tw-border-border-focus',
           disabled: 'tw-text-text-placeholder tw-cursor-not-allowed',
           progress: '',
           loader: '',
           iconColorActive: 'tw-text-green-text-color',
           iconColorHover: 'tw-text-white',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        dialog: {
            cancel: ''
        }
    },
    toast: {
        class: 'tw-flex tw-items-stretch tw-bg-white tw-rounded-8-px',
        leftIcon: {
            class: 'tw-flex tw-items-center tw-justify-center tw-w-32-px tw-rounded-tl-4-px tw-rounded-bl-4-px',
            iconSize: '17px',
            background: {
                success: 'tw-bg-toast-success-bg',
                error: 'tw-bg-toast-error-bg',
                info: 'tw-bg-toast-info-bg'
            }
        },
        message: 'tw-text-text-toast-color tw-pl-16-px',
        close: {
            class: 'tw-flex tw-items-center tw-justify-center tw-bg-white tw-cursor-pointer tw-px-4 tw-rounded-8-px',
            iconSize: '27px',
            iconStyleClasses: 'tw-text-bg-toast-grey'
        },
        backgroundClass: {
            success: 'tw-bg-white tw-outline-toast-success',
            error: 'tw-bg-white tw-outline-toast-error',
            info: 'tw-bg-white tw-outline-toast-info'
        }
    }
};
