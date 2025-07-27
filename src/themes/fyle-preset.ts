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
      border: FyleCSSVars.borders.secondary,
      focus: FyleCSSVars.borders.primary,
      placeholder: FyleCSSVars.text.placeholder
    }
  }
};

export default FylePreset;