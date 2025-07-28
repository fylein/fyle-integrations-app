import { ThemeColors } from './theme.types';
import { FyleCSSVars } from './fyle-css-vars';

// Legacy color palette - kept for reference and backward compatibility
// These will be gradually replaced by direct CSS variable references
const fyleColors: ThemeColors = {
  primary: '#FF3366',        // --text-brand-primary
  primaryLight: '#FFC2D6',   // --bg-brand-disable
  primaryDark: '#fe5196',    // --gradient-vibrant-lg-end

  // Neutral colors
  white: '#FFFFFF',          // --bg-white
  gray50: '#FAFCFF',         // --bg-tertiary-light
  gray100: '#F5F5F5',        // --bg-tertiary
  gray200: '#ECECEE',        // --border-tertiary
  gray300: '#DFDFE2',        // --border-secondary
  gray400: '#A9ACBC',        // --text-disable / --text-placeholder
  gray500: '#5A5D72',        // --text-label / --text-muted
  gray600: '#414562',        // --text-tertiary
  gray700: '#2c304e',        // --text-secondary / --bg-secondary
  gray900: '#161528',        // --text-primary / --bg-primary

  // Semantic colors
  success: '#24A148',        // --text-success / --bg-success
  danger: '#DA1E28',         // --text-danger / --bg-danger
  info: '#5C98E5',           // --text-info / --bg-info
  warning: '#E1AF05',        // --text-warning / --bg-warning

  // Fyle-specific colors
  hyperlink: '#3F6CFF',
  pink: '#FF3366'
};

/**
 * Fyle Brand Design Token Preset
 *
 * This preset defines the design tokens for the Fyle brand theme.
 * It can be used for future PrimeNG theming integration when the
 * @primeuix/themes dependency issues are resolved.
 */
export const FylePreset = {
  name: 'fyle',
  displayName: 'Fyle Theme',
  colors: fyleColors,

  // Direct CSS variable mappings - organized and ready to use
  cssVars: FyleCSSVars,

  // Component-specific overrides using CSS custom properties
  components: {
    button: {
      // Primary button (.p-button) - Direct CSS variable references
      primary: {
        base: {
          width: '100%',
          fontSize: '14px',
          color: FyleCSSVars.buttons.primaryTextColor,
          background: FyleCSSVars.buttons.primaryBg,
          borderColor: FyleCSSVars.text.brandPrimary,
          paddingX: FyleCSSVars.spacing[16],
          paddingY: FyleCSSVars.spacing[10],
          boxShadow: 'none',
          border: 'none'
        },
        hover: {
          color: FyleCSSVars.buttons.primaryHoverTextColor,
          background: FyleCSSVars.buttons.primaryHoverBg,
          boxShadow: FyleCSSVars.shadows.btnCta
        },
        disabled: {
          cursor: 'not-allowed',
          color: FyleCSSVars.buttons.primaryDisableTextColor,
          background: FyleCSSVars.backgrounds.brandDisable
        }
      },

      // Secondary small button (.p-button.secondary-sm)
      secondary: {
        base: {
          paddingX: FyleCSSVars.spacing[12],
          paddingY: FyleCSSVars.spacing[8],
          fontSize: '12px',
          color: FyleCSSVars.buttons.secondaryTextColor,
          background: FyleCSSVars.buttons.secondaryBg
        },
        hover: {
          color: FyleCSSVars.buttons.secondaryHoverTextColor,
          background: FyleCSSVars.buttons.secondaryHoverBg,
          boxShadow: FyleCSSVars.shadows.btnCta
        }
      },

      // Outline small button (.p-button.outline-sm)
      outline: {
        base: {
          paddingX: FyleCSSVars.spacing[12],
          paddingY: FyleCSSVars.spacing[8],
          fontSize: '12px',
          color: FyleCSSVars.buttons.outlineSecondaryTextColor,
          background: FyleCSSVars.buttons.outlineSecondaryBg,
          borderColor: FyleCSSVars.buttons.outlineSecondaryBorderColor,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: FyleCSSVars.buttons.outlineSecondaryHoverTextColor,
          background: FyleCSSVars.buttons.outlineSecondaryHoverBg,
          borderColor: FyleCSSVars.buttons.outlineSecondaryHoverBorderColor,
          boxShadow: FyleCSSVars.shadows.btnCta
        }
      },

      // Primary outline button (.p-button.primary-outline)
      primaryOutline: {
        base: {
          fontWeight: '500',
          paddingX: FyleCSSVars.spacing[16],
          paddingY: FyleCSSVars.spacing[10],
          fontSize: '14px',
          color: FyleCSSVars.text.brandPrimary,
          background: FyleCSSVars.backgrounds.white,
          borderColor: FyleCSSVars.borders.brand,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: FyleCSSVars.text.white,
          background: FyleCSSVars.backgrounds.brandPrimary,
          borderColor: FyleCSSVars.gradients.vibrantLgEnd
        }
      },

      // Danger outline button (.p-button.danger-outline)
      dangerOutline: {
        base: {
          paddingX: FyleCSSVars.spacing[16],
          paddingY: FyleCSSVars.spacing[10],
          fontSize: '14px',
          color: FyleCSSVars.text.danger,
          background: FyleCSSVars.buttons.outlineSecondaryBg,
          borderColor: FyleCSSVars.buttons.outlineSecondaryBorderColor,
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        hover: {
          color: FyleCSSVars.text.danger,
          background: FyleCSSVars.buttons.outlineSecondaryHoverBg,
          borderColor: FyleCSSVars.buttons.outlineSecondaryHoverBorderColor
        }
      },

      // Text button variants (.btn-text-primary)
      text: {
        primary: {
          color: FyleCSSVars.buttons.tertiaryTextColor,
          fontSize: '14px',
          cursor: 'pointer'
        },
        primaryHover: {
          color: FyleCSSVars.buttons.tertiaryHoverTextColor,
          background: FyleCSSVars.buttons.tertiaryHoverBg,
          borderRadius: FyleCSSVars.borderRadius['2xs']
        }
      }
    },

    input: {
      // Basic Input Text Styles
      base: {
        fontFamily: 'var(--font-primary)',
        fontSize: '14px',
        color: FyleCSSVars.text.primary,
        background: FyleCSSVars.backgrounds.white,
        border: '1px solid',
        borderColor: FyleCSSVars.borders.secondary,
        borderRadius: FyleCSSVars.borderRadius['2xs'],
        paddingLeft: FyleCSSVars.spacing[12],
        paddingRight: FyleCSSVars.spacing[12],
        paddingTop: FyleCSSVars.spacing[8],
        paddingBottom: FyleCSSVars.spacing[8]
      },
      focusVisible: {
        boxShadow: 'none',
        outline: 'none'
      },
      focus: {
        borderColor: FyleCSSVars.borders.primary,
        boxShadow: 'none'
      },
      disabled: {
        color: FyleCSSVars.text.placeholder,
        background: FyleCSSVars.backgrounds.tertiary,
        borderColor: FyleCSSVars.borders.tertiary,
        cursor: 'not-allowed'
      },
      placeholder: {
        color: FyleCSSVars.text.placeholder,
        opacity: '1'
      },
      // Calendar Input Specific
      calendar: {
        padding: '0',
        background: FyleCSSVars.backgrounds.white,
        border: 'none',
        cursor: 'pointer',
        transition: 'none',
        focus: {
          boxShadow: 'none',
          borderColor: FyleCSSVars.borders.primary
        },
        placeholder: {
          color: FyleCSSVars.text.tertiary
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
          color: FyleCSSVars.text.secondary,
          border: 'none'
        }
      },
      // Chips Input
      chips: {
        focus: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: FyleCSSVars.borders.primary
        }
      },
      // Input Container Focus
      container: {
        focus: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: FyleCSSVars.borders.primary,
          borderRadius: FyleCSSVars.borderRadius.sm
        }
      },
      // Dropdown Filter
      dropdownFilter: {
        height: '32px',
        paddingLeft: '40px',
        paddingRight: '12px',
        paddingTop: '12px',
        paddingBottom: '12px',
        borderRadius: FyleCSSVars.borderRadius['2xs'],
        border: '1px solid',
        borderColor: FyleCSSVars.borders.primary
      }
    },
    tooltip: {
      text: {
        background: FyleCSSVars.backgrounds.tooltip,
        color: 'white',
        fontSize: '12px',
        paddingX: FyleCSSVars.spacing[8],
        paddingY: FyleCSSVars.spacing[6],
        height: 'auto',
        wordBreak: 'break-words',
        whiteSpace: 'normal',
        overflow: 'visible',
        fontWeight: '400',
        borderRadius: FyleCSSVars.borderRadius['2xs']
      },
      arrow: {
        borderColor: FyleCSSVars.backgrounds.tooltip
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
      height: FyleCSSVars.toggle.height,
      width: FyleCSSVars.toggle.width,

      // Circle styling
      circle: {
        marginTop: '-0.425rem',
        width: FyleCSSVars.toggle.circleSize,
        height: FyleCSSVars.toggle.circleSize
      },

      // Checked state
      checked: {
        circle: {
          transform: `translateX(${FyleCSSVars.toggle.circleTranslate})`
        },
        background: FyleCSSVars.backgrounds.toggleChecked,
        width: FyleCSSVars.toggle.width,
        height: FyleCSSVars.toggle.height
      },

      // Unchecked state
      unchecked: {
        background: FyleCSSVars.backgrounds.toggleUnchecked,
        width: FyleCSSVars.toggle.width,
        height: FyleCSSVars.toggle.height
      },

      // Focus state
      focus: {
        boxShadow: 'none'
      },

      // Text styling
      text: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        fontSize: '12px',
        color: 'white',
        fontWeight: '500',
        bottom: '0',
        checkedContent: FyleCSSVars.toggle.textYes,
        uncheckedContent: FyleCSSVars.toggle.textNo,
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
        borderColor: FyleCSSVars.borders.secondary,
        borderRadius: '50%',
        background: FyleCSSVars.backgrounds.white,
        hover: {
          borderColor: FyleCSSVars.text.secondary
        },
        highlight: {
          boxShadow: 'none',
          borderColor: FyleCSSVars.text.secondary,
          background: FyleCSSVars.backgrounds.white
        }
      },
      icon: {
        width: '10px',
        height: '10px',
        background: FyleCSSVars.text.secondary,
        borderRadius: '50%'
      }
    },
    dialog: {
      content: {
        padding: '0',
        borderRadius: FyleCSSVars.borderRadius['2xs']
      },
      header: {
        borderRadius: 'none',
        background: FyleCSSVars.backgrounds.white,
        padding: FyleCSSVars.spacing[16],
        title: {
          fontSize: '20px',
          fontWeight: '500',
          color: FyleCSSVars.text.primary
        },
        button: {
          background: FyleCSSVars.backgrounds.white,
          color: FyleCSSVars.text.placeholder,
          boxShadow: 'none',
          padding: FyleCSSVars.spacing[8]
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
        borderRadius: FyleCSSVars.borderRadius.xs,
        transition: 'none',
        border: '1.5px solid',
        borderColor: FyleCSSVars.borders.secondary,
        background: FyleCSSVars.backgrounds.white,
        baseBorder: '1.5px solid',
        hover: {
          borderColor: FyleCSSVars.text.secondary
        },
        highlight: {
          background: FyleCSSVars.icons.secondary,
          border: 'none'
        }
      },
      icon: {
        width: '9px',
        color: FyleCSSVars.text.white,
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
      borderColor: FyleCSSVars.borders.secondary,
      borderRadius: FyleCSSVars.borderRadius['2xs'],
      paddingRight: FyleCSSVars.spacing[20],
      trigger: {
        width: '12px'
      },
      label: {
        color: FyleCSSVars.text.secondary,
        fontSize: '14px',
        padding: '0'
      },
      focus: {
        boxShadow: 'none',
        enabled: {
          boxShadow: 'none',
          borderColor: FyleCSSVars.borders.primary
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
        color: FyleCSSVars.text.placeholder
      },
      item: {
        fontSize: '14px',
        color: FyleCSSVars.text.secondary,
        paddingLeft: FyleCSSVars.spacing[12],
        paddingRight: FyleCSSVars.spacing[12],
        paddingTop: FyleCSSVars.spacing[6],
        paddingBottom: FyleCSSVars.spacing[6],
        highlight: {
          fontSize: '14px',
          color: FyleCSSVars.text.secondary,
          background: FyleCSSVars.backgrounds.white,
          borderRadius: FyleCSSVars.borderRadius['2xs']
        },
        hover: {
          boxShadow: 'none',
          background: FyleCSSVars.backgrounds.tertiary
        },
        focus: {
          boxShadow: 'none',
          background: FyleCSSVars.backgrounds.tertiary
        },
        generalHover: {
          boxShadow: 'none',
          background: FyleCSSVars.backgrounds.tertiary,
          borderRadius: 'none'
        }
      },
      emptyMessage: {
        paddingTop: FyleCSSVars.spacing[24],
        paddingBottom: FyleCSSVars.spacing[24],
        display: 'flex',
        justifyContent: 'center',
        color: FyleCSSVars.text.secondary,
        fontSize: '14px',
        fontStyle: 'italic'
      }
    },
    dropdown: {
      height: '40px',
      width: '300px',
      transform: 'scale(1)',
      border: '1px solid',
      borderColor: FyleCSSVars.borders.secondary,
      paddingTop: FyleCSSVars.spacing[8],
      paddingBottom: FyleCSSVars.spacing[8],
      paddingLeft: FyleCSSVars.spacing[12],
      paddingRight: FyleCSSVars.spacing[12],
      borderRadius: FyleCSSVars.borderRadius['2xs'],
      disabled: {
        fontSize: '14px',
        color: FyleCSSVars.text.secondary,
        background: FyleCSSVars.backgrounds.tertiary,
        border: '1px solid',
        borderColor: FyleCSSVars.borders.tertiary
      },
      trigger: {
        width: '18px'
      },
      focus: {
        boxShadow: 'none',
        borderColor: FyleCSSVars.borders.primary
      },
      hover: {
        boxShadow: 'none'
      },
      placeholder: {
        color: FyleCSSVars.text.placeholder
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
          padding: FyleCSSVars.spacing[6]
        }
      },
      header: {
        background: FyleCSSVars.backgrounds.tertiary,
        padding: FyleCSSVars.spacing[6]
      },
      item: {
        fontSize: '14px',
        color: FyleCSSVars.text.secondary,
        borderRadius: FyleCSSVars.borderRadius['2xs'],
        minHeight: 'var(--dropdown-option-height)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: FyleCSSVars.spacing[8],
        paddingBottom: FyleCSSVars.spacing[8],
        paddingLeft: FyleCSSVars.spacing[14],
        paddingRight: FyleCSSVars.spacing[14],
        highlight: {
          color: FyleCSSVars.text.primary,
          background: FyleCSSVars.backgrounds.tertiary,
          borderRadius: 'none',
          minHeight: 'var(--dropdown-option-height)',
          display: 'flex',
          alignItems: 'center',
          paddingTop: FyleCSSVars.spacing[8],
          paddingBottom: FyleCSSVars.spacing[8],
          paddingLeft: FyleCSSVars.spacing[12],
          paddingRight: FyleCSSVars.spacing[12],
          fontSize: '14px'
        },
        focus: {
          color: FyleCSSVars.text.secondary,
          background: FyleCSSVars.backgrounds.white,
          borderRadius: 'none',
          minHeight: 'var(--dropdown-option-height)',
          display: 'flex',
          alignItems: 'center',
          paddingTop: FyleCSSVars.spacing[8],
          paddingBottom: FyleCSSVars.spacing[8],
          paddingLeft: FyleCSSVars.spacing[12],
          paddingRight: FyleCSSVars.spacing[12],
          fontSize: '14px'
        },
        hover: {
          background: FyleCSSVars.backgrounds.tertiary,
          color: FyleCSSVars.text.secondary,
          borderRadius: 'none'
        },
        group: {
          paddingLeft: FyleCSSVars.spacing[12],
          paddingRight: FyleCSSVars.spacing[12],
          paddingTop: FyleCSSVars.spacing[8],
          paddingBottom: FyleCSSVars.spacing[8]
        }
      },
      emptyMessage: {
        color: FyleCSSVars.text.secondary,
        paddingTop: FyleCSSVars.spacing[6],
        paddingBottom: FyleCSSVars.spacing[6],
        paddingLeft: FyleCSSVars.spacing[12],
        paddingRight: FyleCSSVars.spacing[12],
        fontSize: '14px'
      },
      divider: {
        paddingTop: FyleCSSVars.spacing[4],
        paddingBottom: FyleCSSVars.spacing[4],
        minHeight: '0'
      },
      calendarInput: {
        background: FyleCSSVars.backgrounds.tertiary
      },
      filterIcon: {
        left: '10px',
        color: FyleCSSVars.icons.secondary
      }
    },
    datepicker: {
      padding: FyleCSSVars.spacing[16],
      header: {
        padding: '0'
      },
      title: {
        fontSize: '12px',
        fontFamily: 'var(--font-primary)',
        color: FyleCSSVars.text.primary,
        hover: {
          color: FyleCSSVars.text.primary
        }
      },
      month: {
        paddingRight: FyleCSSVars.spacing[24]
      },
      nav: {
        focus: {
          boxShadow: 'none'
        }
      },
      dayHeader: {
        fontSize: '14px',
        color: FyleCSSVars.text.label,
        padding: '0',
        paddingTop: FyleCSSVars.spacing[4],
        paddingBottom: FyleCSSVars.spacing[4],
        textAlign: 'center'
      },
      cell: {
        padding: '0',
        paddingBottom: FyleCSSVars.spacing[4]
      },
      date: {
        fontSize: '14px',
        color: FyleCSSVars.text.secondary,
        height: '28px',
        width: '28px',
        focus: {
          boxShadow: 'none'
        },
        highlight: {
          color: FyleCSSVars.text.white,
          background: FyleCSSVars.backgrounds.brandPrimary
        },
        hover: {
          background: FyleCSSVars.backgrounds.tertiary
        }
      },
      monthpicker: {
        width: '25%',
        padding: '0',
        marginTop: FyleCSSVars.spacing[10],
        fontSize: '14px',
        color: FyleCSSVars.text.secondary,
        height: '32px',
        focus: {
          boxShadow: 'none'
        }
      },
      yearpicker: {
        width: '25%',
        padding: '0',
        marginTop: FyleCSSVars.spacing[10],
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
    chips: {
      token: {
        background: FyleCSSVars.backgrounds.white,
        paddingX: FyleCSSVars.spacing[8],
        paddingY: '2px',
        borderRadius: '50px',
        border: `1px solid ${FyleCSSVars.borders.secondary}`,
        boxShadow: 'none'
      },
      
      container: {
        enabled: {
          border: `1px solid ${FyleCSSVars.borders.primary}`,
          paddingLeft: FyleCSSVars.spacing[14],
          paddingRight: FyleCSSVars.spacing[12]
        }
      }
    }
  }
};

export default FylePreset;