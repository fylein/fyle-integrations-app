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
        padding: '0'
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
    }
  }
};

export default CoPreset;