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
    checkbok: {
        theme: 'co-checkbox'
    },
    qbd_direct: {
        onboarding: {
            preRequisiteContainer: 'tw-rounded-border-radius-full',
            preRequisiteCard: 'tw-rounded-8-px tw-border-1-px tw-border-bg-brand tw-py-24-px tw-pl-24-px tw-pr-8-px tw-my-24-px',
            optionStepStateBackground: 'tw-bg-bg-primary',
            tutorialvideoClass: 'tw-rounded-16-px tw-w-[500px] tw-h-[250px]',
            logoSectionStyle: '',
            headerTopText: 'tw-text-14-px tw-font-600',
            headerDescriptionText: 'tw-text-12-px',
            bodyTopText: 'tw-text-18-px tw-font-600',
            headerStyle: 'tw-bg-bg-white tw-mx-[40px] tw-my-[24px] tw-rounded-xl tw-shadow-c1-card',
            headerCenterTextStyle: 'tw-justify-center',
            bodyStyle: 'tw-py-24-px tw-bg-bg-white tw-mx-[40px] tw-my-[24px] tw-rounded-xl tw-shadow-c1-card',
            flowChart: 'tw-mt-50-px'
        }
    },
    buttons: {
        primary: {
           class: 'p-button p-button-raised',
           active: 'tw-bg-primary',
           disabled: 'p-disabled tw-text-text-placeholder tw-cursor-not-allowed',
           progress: 'p-disabled tw-text-text-placeholder tw-cursor-not-allowed',
           loader: 'tw-border-t-border-tertiary',
           iconColorActive: 'tw-text-white',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        secondary: {
           class: 'tw-h-38-px tw-rounded-4-px tw-border tw-text-text-brand-primary tw-font-nav-link-font-weight tw-border-solid tw-border-btn-outline-primary-border-color',
           active: 'hover:tw-text-btn-outline-primary-hover-text-color hover:tw-bg-btn-outline-primary-hover-bg tw-text-size-14 tw-bg-btn-outline-primary-bg tw-border-grey-300 tw-font-500 tw-cursor-pointer',
           disabled: 'tw-text-text-placeholder tw-cursor-not-allowed',
           progress: '',
           loader: '',
           iconColorActive: 'tw-text-text-secondary',
           iconColorHover: '',
           iconColorDisabled: 'tw-text-text-placeholder'
        },
        dialog: {
            cancel: 'outline-sm'
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