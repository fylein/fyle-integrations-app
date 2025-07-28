import { ThemeColors } from './theme.types';
import { CoCSSVars } from './co-css-vars';

// Legacy color palette - kept for reference and backward compatibility
// These will be gradually replaced by direct CSS variable references
const coColors: ThemeColors = {
  primary: '#0070a8',        // --text-brand-primary
  primaryLight: '#0070A8',   // --bg-brand-primary (same as primary for Co)
  primaryDark: '#005885',    // --bg-brand-pressed (blue-75)

  // Neutral colors
  white: '#FFFFFF',          // --bg-white
  gray50: '#f4f4f4',         // --bg-tertiary-lighter (grey-05)
  gray100: '#F5F5F5',        // --bg-tertiary (similar)
  gray200: '#ECECEE',        // --border-tertiary (similar)
  gray300: '#DFDFE2',        // --border-secondary (similar)
  gray400: '#A9ACBC',        // --text-disable / --text-placeholder (similar)
  gray500: '#6e6e6e',        // --text-tertiary (grey-55)
  gray600: '#414562',        // --text-secondary (similar)
  gray700: '#2c304e',        // Co uses grey-95 for primary text
  gray900: '#161528',        // Co uses grey-95 for primary text

  // Semantic colors
  success: '#24A148',        // --text-success / --bg-success
  danger: '#DA1E28',         // --text-danger / --bg-danger
  info: '#5C98E5',           // --text-info / --bg-info
  warning: '#E1AF05',        // --text-warning / --bg-warning

  // Co-specific colors
  hyperlink: '#0070a8',      // --link-primary
  pink: '#FF3366'            // Kept same as Fyle for consistency
};

/**
 * Co Brand Design Token Preset
 *
 * This preset defines the design tokens for the Co brand theme.
 * It can be used for future PrimeNG theming integration when the
 * @primeuix/themes dependency issues are resolved.
 */
export const CoPreset = {
  name: 'co',
  displayName: 'Co Theme',
  colors: coColors,

  // Direct CSS variable mappings - organized and ready to use
  cssVars: CoCSSVars,

  // Component-specific overrides using CSS custom properties
  components: {
    button: {
      // Primary button (.p-button) - Direct CSS variable references
      primary: {
        base: {
          width: '100%',
          fontSize: '14px',
          color: CoCSSVars.buttons.primaryTextColor,
          background: CoCSSVars.buttons.primaryBg,
          borderColor: CoCSSVars.borders.brand,
          paddingX: CoCSSVars.spacing[16],
          paddingY: CoCSSVars.spacing[10],
          boxShadow: 'none',
          border: 'none'
        },
        hover: {
          color: CoCSSVars.buttons.primaryHoverTextColor,
          background: CoCSSVars.buttons.primaryHoverBg,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Co doesn't have specific shadow var yet
        },
        disabled: {
          cursor: 'not-allowed',
          color: CoCSSVars.buttons.primaryDisableTextColor,
          background: CoCSSVars.buttons.primaryDisableBg
        }
      },

      // Secondary small button (.p-button.secondary-sm)
      secondary: {
        base: {
          paddingX: CoCSSVars.spacing[12],
          paddingY: CoCSSVars.spacing[8],
          fontSize: '12px',
          color: CoCSSVars.buttons.secondaryTextColor,
          background: CoCSSVars.buttons.secondaryBg
        },
        hover: {
          color: CoCSSVars.buttons.secondaryHoverTextColor,
          background: CoCSSVars.buttons.secondaryHoverBg,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      },

      // Outline small button (.p-button.outline-sm)
      outline: {
        base: {
          paddingX: CoCSSVars.spacing[12],
          paddingY: CoCSSVars.spacing[8],
          fontSize: '12px',
          color: CoCSSVars.buttons.outlineSecondaryTextColor,
          background: CoCSSVars.buttons.outlineSecondaryBg,
          borderColor: CoCSSVars.buttons.outlineSecondaryBorderColor,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: CoCSSVars.buttons.outlineSecondaryHoverTextColor,
          background: CoCSSVars.buttons.outlineSecondaryHoverBg,
          borderColor: CoCSSVars.buttons.outlineSecondaryHoverBorderColor,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      },

      // Primary outline button (.p-button.primary-outline)
      primaryOutline: {
        base: {
          fontWeight: '500',
          paddingX: CoCSSVars.spacing[16],
          paddingY: CoCSSVars.spacing[10],
          fontSize: '14px',
          color: CoCSSVars.buttons.outlinePrimaryTextColor,
          background: CoCSSVars.buttons.outlinePrimaryBg,
          borderColor: CoCSSVars.buttons.outlinePrimaryBorderColor,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: CoCSSVars.buttons.outlinePrimaryHoverTextColor,
          background: CoCSSVars.buttons.outlinePrimaryHoverBg,
          borderColor: CoCSSVars.buttons.outlinePrimaryHoverBorderColor
        }
      },

      // Danger outline button (.p-button.danger-outline)
      dangerOutline: {
        base: {
          paddingX: CoCSSVars.spacing[16],
          paddingY: CoCSSVars.spacing[10],
          fontSize: '14px',
          color: CoCSSVars.buttons.dangerOutlineTextColor,
          background: CoCSSVars.buttons.dangerOutlineBg,
          borderColor: CoCSSVars.buttons.dangerOutlineBorderColor,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: CoCSSVars.buttons.dangerOutlineHoverTextColor,
          background: CoCSSVars.buttons.dangerOutlineHoverBg,
          borderColor: CoCSSVars.buttons.dangerOutlineHoverBorderColor
        }
      },

      // Text button variants (.btn-text-primary)
      text: {
        primary: {
          color: CoCSSVars.buttons.tertiaryTextColor,
          fontSize: '14px',
          cursor: 'pointer'
        },
        primaryHover: {
          color: CoCSSVars.buttons.tertiaryHoverTextColor,
          background: CoCSSVars.buttons.tertiaryHoverBg,
          borderRadius: CoCSSVars.borderRadius['2xs']
        }
      }
    },

    input: {
      // Basic Input Text Styles
      base: {
        fontFamily: 'var(--font-primary)',
        fontSize: '14px',
        color: CoCSSVars.text.primary,
        background: CoCSSVars.backgrounds.white,
        border: '1px solid',
        borderColor: CoCSSVars.borders.secondary,
        borderRadius: CoCSSVars.borderRadius['2xs'],
        paddingLeft: CoCSSVars.spacing[12],
        paddingRight: CoCSSVars.spacing[12],
        paddingTop: CoCSSVars.spacing[8],
        paddingBottom: CoCSSVars.spacing[8]
      },
      focusVisible: {
        boxShadow: 'none',
        outline: 'none'
      },
      focus: {
        borderColor: CoCSSVars.borders.primary,
        boxShadow: 'none'
      },
      disabled: {
        color: CoCSSVars.text.placeholder,
        background: CoCSSVars.backgrounds.tertiary,
        borderColor: CoCSSVars.borders.tertiary,
        cursor: 'not-allowed'
      },
      placeholder: {
        color: CoCSSVars.text.placeholder,
        opacity: '1'
      },
      // Calendar Input Specific
      calendar: {
        padding: '0',
        background: CoCSSVars.backgrounds.white,
        border: 'none',
        cursor: 'pointer',
        transition: 'none',
        focus: {
          boxShadow: 'none',
          borderColor: CoCSSVars.borders.primary
        },
        placeholder: {
          color: CoCSSVars.text.tertiary
        }
      },
      // Dropdown Label Input
      dropdownLabel: {
        paddingX: '3px',
        paddingY: '2px',
        input: {
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: CoCSSVars.text.secondary,
          border: 'none'
        }
      },
      // Chips Input
      chips: {
        focus: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: CoCSSVars.borders.primary
        }
      },
      // Input Container Focus
      container: {
        focus: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: CoCSSVars.borders.primary,
          borderRadius: CoCSSVars.borderRadius.sm
        }
      },
      // Dropdown Filter
      dropdownFilter: {
        height: '32px',
        paddingLeft: '40px',
        paddingRight: '12px',
        paddingTop: '12px',
        paddingBottom: '12px',
        borderRadius: CoCSSVars.borderRadius['2xs'],
        border: '1px solid',
        borderColor: CoCSSVars.borders.primary
      }
    },
    tooltip: {
      text: {
        background: CoCSSVars.backgrounds.tooltip,
        color: 'white',
        fontSize: '12px',
        paddingX: CoCSSVars.spacing[8],
        paddingY: CoCSSVars.spacing[6],
        height: 'auto',
        wordBreak: 'break-words',
        whiteSpace: 'normal',
        overflow: 'visible',
        fontWeight: '400',
        borderRadius: CoCSSVars.borderRadius['2xs']
      },
      arrow: {
        borderColor: CoCSSVars.backgrounds.tooltip
      },
      bottom: {
        marginTop: '4px',
        arrow: {
          border: '2px solid transparent',
          marginTop: '-2px'
        }
      }
    },
    toggle: {
      // Base dimensions
      height: CoCSSVars.toggle.height,
      width: CoCSSVars.toggle.width,

      // Circle styling (Co has different sizing)
      circle: {
        marginTop: '-0.55rem',
        width: CoCSSVars.toggle.circleSize,
        height: CoCSSVars.toggle.circleSize,
        left: '0',
        marginLeft: '2px'
      },

      // Checked state
      checked: {
        circle: {
          transform: `translateX(${CoCSSVars.toggle.circleTranslate})`
        },
        background: CoCSSVars.backgrounds.toggleChecked,
        width: CoCSSVars.toggle.width,
        height: CoCSSVars.toggle.height
      },

      // Unchecked state
      unchecked: {
        background: CoCSSVars.backgrounds.toggleUnchecked,
        width: CoCSSVars.toggle.width,
        height: CoCSSVars.toggle.height
      },

      // Focus state
      focus: {
        boxShadow: 'none'
      },

      // Text styling (Co theme has no text)
      text: {
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        fontSize: '12px',
        color: 'white',
        fontWeight: '500',
        bottom: '0',
        checkedContent: '""',
        uncheckedContent: '""',
        checkedLeft: '8px',
        uncheckedLeft: '24px'
      }
    },
    radio: {
      width: 'fit-content',
      height: '19px',
      box: {
        width: '16px',
        height: '16px',
        border: '1px solid',
        borderColor: CoCSSVars.borders.secondary,
        borderRadius: '50%',
        background: CoCSSVars.backgrounds.white,
        hover: {
          borderColor: CoCSSVars.text.secondary
        },
        highlight: {
          boxShadow: 'none',
          borderColor: CoCSSVars.text.secondary,
          background: CoCSSVars.backgrounds.white
        }
      },
      icon: {
        width: '10px',
        height: '10px',
        background: CoCSSVars.text.secondary,
        borderRadius: '50%'
      }
    },
    dialog: {
      content: {
        padding: '0',
        borderRadius: CoCSSVars.borderRadius['2xs']
      },
      header: {
        borderRadius: 'none',
        background: CoCSSVars.backgrounds.white,
        padding: CoCSSVars.spacing[16],
        title: {
          fontSize: '20px',
          fontWeight: '500',
          color: CoCSSVars.text.primary
        },
        button: {
          background: CoCSSVars.backgrounds.white,
          color: CoCSSVars.text.placeholder,
          boxShadow: 'none',
          padding: CoCSSVars.spacing[8]
        }
      },
      topRight: {
        margin: '.75rem',
        transform: 'translateZ(0)'
      },
      closeIcon: {
        marginTop: '-3px',
        width: '12px',
        height: '12px'
      }
    },
    checkbox: {
      height: 'revert',
      width: 'revert',
      box: {
        height: '16px',
        width: '16px',
        borderRadius: CoCSSVars.borderRadius.xs,
        transition: 'none',
        border: '1.5px solid',
        borderColor: CoCSSVars.borders.secondary,
        background: CoCSSVars.backgrounds.white,
        baseBorder: '1.5px solid',
        hover: {
          borderColor: CoCSSVars.text.secondary
        },
        highlight: {
          background: CoCSSVars.icons.brandPrimary,
          border: 'none'
        }
      },
      icon: {
        width: '9px',
        color: CoCSSVars.text.white,
        fontWeight: '700',
        fontSize: '9px',
        height: '14px'
      },
      checkIcon: {
        fontWeight: '700',
        fontSize: '9px',
        width: '9px',
        height: '14px'
      },
      multiselect: {
        marginBottom: '0'
      }
    },
    multiselect: {
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      width: '300px',
      border: '1px solid',
      borderColor: CoCSSVars.borders.secondary,
      borderRadius: CoCSSVars.borderRadius['2xs'],
      paddingRight: CoCSSVars.spacing[20],
      trigger: {
        width: '12px'
      },
      label: {
        color: CoCSSVars.text.secondary,
        fontSize: '14px',
        padding: '0'
      },
      focus: {
        boxShadow: 'none',
        enabled: {
          boxShadow: 'none',
          borderColor: CoCSSVars.borders.primary
        }
      },
      panel: {
        width: '300px',
        padding: '0',
        header: {
          border: 'none',
          checkbox: {
            display: 'none'
          }
        }
      },
      filterContainer: {
        display: 'none'
      },
      close: {
        display: 'none'
      },
      placeholder: {
        color: CoCSSVars.text.placeholder
      },
      item: {
        fontSize: '14px',
        color: CoCSSVars.text.secondary,
        paddingLeft: CoCSSVars.spacing[12],
        paddingRight: CoCSSVars.spacing[12],
        paddingTop: CoCSSVars.spacing[6],
        paddingBottom: CoCSSVars.spacing[6],
        highlight: {
          fontSize: '14px',
          color: CoCSSVars.text.secondary,
          background: CoCSSVars.backgrounds.white,
          borderRadius: CoCSSVars.borderRadius['2xs']
        },
        hover: {
          boxShadow: 'none',
          background: CoCSSVars.backgrounds.tertiary
        },
        focus: {
          boxShadow: 'none',
          background: CoCSSVars.backgrounds.tertiary
        },
        generalHover: {
          boxShadow: 'none',
          background: CoCSSVars.backgrounds.tertiary,
          borderRadius: 'none'
        }
      },
      emptyMessage: {
        paddingTop: CoCSSVars.spacing[24],
        paddingBottom: CoCSSVars.spacing[24],
        display: 'flex',
        justifyContent: 'center',
        color: CoCSSVars.text.secondary,
        fontSize: '14px',
        fontStyle: 'italic'
      }
    },
    dropdown: {
      height: '40px',
      width: '300px',
      transform: 'scale(1)',
      border: '1px solid',
      borderColor: CoCSSVars.borders.secondary,
      paddingTop: CoCSSVars.spacing[8],
      paddingBottom: CoCSSVars.spacing[8],
      paddingLeft: CoCSSVars.spacing[12],
      paddingRight: CoCSSVars.spacing[12],
      borderRadius: CoCSSVars.borderRadius['2xs'],
      disabled: {
        fontSize: '14px',
        color: CoCSSVars.text.secondary,
        background: CoCSSVars.backgrounds.tertiary,
        border: '1px solid',
        borderColor: CoCSSVars.borders.tertiary
      },
      trigger: {
        width: '18px'
      },
      focus: {
        boxShadow: 'none',
        borderColor: CoCSSVars.borders.primary
      },
      hover: {
        boxShadow: 'none'
      },
      placeholder: {
        color: CoCSSVars.text.placeholder
      },
              panel: {
          items: {
            marginTop: '1px',
            paddingLeft: '0',
            paddingRight: '0',
            paddingTop: '4px',
            paddingBottom: '5px',
            border: 'none',
            borderRadius: '0 0 8px 8px'
          },
        header: {
          padding: CoCSSVars.spacing[6]
        }
      },
      header: {
        background: CoCSSVars.backgrounds.tertiary,
        padding: CoCSSVars.spacing[6]
      },
      item: {
        fontSize: '14px',
        color: CoCSSVars.text.secondary,
        borderRadius: CoCSSVars.borderRadius['2xs'],
        minHeight: 'var(--dropdown-option-height)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: CoCSSVars.spacing[8],
        paddingBottom: CoCSSVars.spacing[8],
        paddingLeft: CoCSSVars.spacing[14],
        paddingRight: CoCSSVars.spacing[14],
        highlight: {
          color: CoCSSVars.text.primary,
          background: CoCSSVars.backgrounds.tertiary,
          borderRadius: 'none',
          minHeight: 'var(--dropdown-option-height)',
          display: 'flex',
          alignItems: 'center',
          paddingTop: CoCSSVars.spacing[8],
          paddingBottom: CoCSSVars.spacing[8],
          paddingLeft: CoCSSVars.spacing[12],
          paddingRight: CoCSSVars.spacing[12],
          fontSize: '14px'
        },
        focus: {
          color: CoCSSVars.text.secondary,
          background: CoCSSVars.backgrounds.white,
          borderRadius: 'none',
          minHeight: 'var(--dropdown-option-height)',
          display: 'flex',
          alignItems: 'center',
          paddingTop: CoCSSVars.spacing[8],
          paddingBottom: CoCSSVars.spacing[8],
          paddingLeft: CoCSSVars.spacing[12],
          paddingRight: CoCSSVars.spacing[12],
          fontSize: '14px'
        },
        hover: {
          background: CoCSSVars.backgrounds.tertiary,
          color: CoCSSVars.text.secondary,
          borderRadius: 'none'
        },
        group: {
          paddingLeft: CoCSSVars.spacing[12],
          paddingRight: CoCSSVars.spacing[12],
          paddingTop: CoCSSVars.spacing[8],
          paddingBottom: CoCSSVars.spacing[8]
        }
      },
      emptyMessage: {
        color: CoCSSVars.text.secondary,
        paddingTop: CoCSSVars.spacing[6],
        paddingBottom: CoCSSVars.spacing[6],
        paddingLeft: CoCSSVars.spacing[12],
        paddingRight: CoCSSVars.spacing[12],
        fontSize: '14px'
      },
      divider: {
        paddingTop: CoCSSVars.spacing[4],
        paddingBottom: CoCSSVars.spacing[4],
        minHeight: '0'
      },
      calendarInput: {
        background: CoCSSVars.backgrounds.tertiaryLighter
      },
      filterIcon: {
        left: '10px',
        color: CoCSSVars.icons.secondary
      }
    },
    datepicker: {
      padding: CoCSSVars.spacing[16],
      header: {
        padding: '0'
      },
      title: {
        fontSize: '12px',
        fontFamily: 'var(--font-primary)',
        color: CoCSSVars.text.primary,
        hover: {
          color: CoCSSVars.text.primary
        }
      },
      month: {
        paddingRight: CoCSSVars.spacing[24]
      },
      nav: {
        focus: {
          boxShadow: 'none'
        }
      },
      dayHeader: {
        fontSize: '14px',
        color: CoCSSVars.text.label,
        padding: '0',
        paddingTop: CoCSSVars.spacing[4],
        paddingBottom: CoCSSVars.spacing[4],
        textAlign: 'center'
      },
      cell: {
        padding: '0',
        paddingBottom: CoCSSVars.spacing[4]
      },
      date: {
        fontSize: '14px',
        color: CoCSSVars.text.secondary,
        height: '28px',
        width: '28px',
        focus: {
          boxShadow: 'none'
        },
        highlight: {
          color: CoCSSVars.text.white,
          background: CoCSSVars.backgrounds.brandPrimary
        },
        hover: {
          background: CoCSSVars.backgrounds.tertiary
        }
      },
      monthpicker: {
        width: '25%',
        padding: '0',
        marginTop: CoCSSVars.spacing[10],
        fontSize: '14px',
        color: CoCSSVars.text.secondary,
        height: '32px',
        focus: {
          boxShadow: 'none'
        }
      },
      yearpicker: {
        width: '25%',
        padding: '0',
        marginTop: CoCSSVars.spacing[10],
        height: '32px',
        fontSize: '14px',
        focus: {
          boxShadow: 'none'
        }
      },
      touchUi: {
        minWidth: 'fit-content',
        position: 'absolute',
        top: '36px',
        left: '-12px',
        transform: 'none'
      }
    },
    skeleton: {
      background: CoCSSVars.backgrounds.disable
    },
    spinner: {
      spinner16: {
        height: 'var(--size-16)',
        width: 'var(--size-16)',
        animation: 'p-progress-spinner-dash 1.5s ease-in-out infinite'
      },
      spinner16White: {
        height: 'var(--size-16)',
        width: 'var(--size-16)',
        animation: 'p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-cta-color 6s ease-in-out infinite'
      },
      spinnerDefault: {
        height: '100px',
        width: '100px',
        animation: 'p-progress-spinner-dash 1.5s ease-in-out infinite'
      },
      spinner30: {
        height: '30px',
        width: '30px',
        animation: 'p-progress-spinner-dash 1.5s ease-in-out infinite'
      }
    },
    toast: {
      opacity: '1',
      success: {
        border: 'none',
        background: CoCSSVars.backgrounds.success,
        color: CoCSSVars.text.white
      },
      error: {
        border: 'none',
        background: CoCSSVars.backgrounds.danger,
        color: CoCSSVars.text.white
      },
      info: {
        border: 'none',
        background: CoCSSVars.backgrounds.info,
        color: CoCSSVars.text.white
      },
      warn: {
        border: 'none',
        background: CoCSSVars.backgrounds.warning,
        color: CoCSSVars.text.white
      },
      content: {
        border: '0',
        padding: '0',
        color: CoCSSVars.text.white,
        background: 'transparent',
        borderRadius: CoCSSVars.borderRadius['2xs'],
        fontSize: '14px',
        fontWeight: '400'
      },
      closeIcon: {
        display: 'none'
      },
      closeIconIcon: {
        display: 'none'
      },
      messageContentDisplay: 'block'
    }
  }
};

export default CoPreset;