/**
 * Fyle CSS Custom Properties Mapping
 *
 * This file provides organized access to all CSS custom properties
 * defined in src/assets/themes/fyle/fdl.scss
 *
 * Usage: Instead of hardcoding hex values, reference these CSS variables
 * so that the preset stays in sync with the actual theme definitions.
 */

export const FyleCSSVars = {
  // ==================== BACKGROUNDS ====================
  backgrounds: {
    // Brand backgrounds
    brandPrimary: 'var(--bg-brand-primary)',      // #ff3366
    brandDisable: 'var(--bg-brand-disable)',      // #ffc2d6
    brandMuted: 'var(--bg-brand-muted)',          // Rgba(#ff3366, 0.15)

    // Grey backgrounds
    primary: 'var(--bg-primary)',                 // #161528
    secondary: 'var(--bg-secondary)',             // #2c304e
    disable: 'var(--bg-disable)',                 // #a9acbc
    tertiary: 'var(--bg-tertiary)',               // #f5f5f5
    white: 'var(--bg-white)',                     // #ffffff
    primaryOpacity: 'var(--bg-primary-opacity)',  // Rgba(#161528, 0.1)

    // Contextual backgrounds
    success: 'var(--bg-success)',                 // #24a148
    info: 'var(--bg-info)',                       // #5c98e5
    warning: 'var(--bg-warning)',                 // #e1af05
    danger: 'var(--bg-danger)',                   // #da1e28

    // Light backgrounds
    infoLight: 'var(--bg-info-light)',           // #eef1fe
    dangerLight: 'var(--bg-danger-light)',       // #fce9ea
    successLight: 'var(--bg-success-light)',     // #e9f6ed
    calmLight: 'var(--bg-calm-light)',           // #e7f3f4
    highlightLight: 'var(--bg-highlight-light)', // #f4edff
    disableLight: 'var(--bg-disable-light)',     // #f5f5f5
    tertiaryLight: 'var(--bg-tertiary-light)',   // #fafcff

    // Lighter backgrounds
    infoLighter: 'var(--bg-info-lighter)',       // #eff5fc
    infoLightest: 'var(--bg-info-lightest)',     // #f6faff
    warningLighter: 'var(--bg-warning-lighter)', // #fcf7e6
    dangerLighter: 'var(--bg-danger-lighter)',   // #fbe8e9
    successLighter: 'var(--bg-success-lighter)', // #eef8f2
    disableLighter: 'var(--bg-disable-lighter)', // #f5f5f5
    tertiaryLighter: 'var(--bg-tertiary-lighter)', // #fafcff

    // Special backgrounds
    tooltip: 'var(--tooltip-bg)',                // #2c304e for Fyle

    // Toggle backgrounds
    toggleChecked: 'var(--bg-brand-primary)',    // #ff3366
    toggleUnchecked: 'var(--bg-disable)'         // #a9acbc
  },

  // ==================== TEXT COLORS ====================
  text: {
    // Brand text
    brandPrimary: 'var(--text-brand-primary)',   // #ff3366
    brandSecondary: 'var(--text-brand-secondary)', // #ffc2d6

    // Standard text
    primary: 'var(--text-primary)',              // #161528
    secondary: 'var(--text-secondary)',          // #2c304e
    tertiary: 'var(--text-tertiary)',            // #414562
    white: 'var(--text-white)',                  // #ffffff
    disable: 'var(--text-disable)',              // #a9acbc
    placeholder: 'var(--text-placeholder)',      // #a9acbc
    label: 'var(--text-label)',                  // #5a5d72
    muted: 'var(--text-muted)',                  // #5a5d72

    // Contextual text
    success: 'var(--text-success)',              // #24a148
    info: 'var(--text-info)',                    // #556ef2
    warning: 'var(--text-warning)',              // #e1af05
    danger: 'var(--text-danger)',                // #da1e28
    highlight: 'var(--text-highlight)',          // #8e46ff
    calm: 'var(--text-calm)',                    // #077e8c
    pending: 'var(--text-pending)'               // #d88600
  },

  // ==================== BORDERS ====================
  borders: {
    // Brand borders
    brand: 'var(--border-brand)',                // #ff3366

    // Standard borders
    primary: 'var(--border-primary)',            // #2c304e
    secondary: 'var(--border-secondary)',        // #dfdfe2
    tertiary: 'var(--border-tertiary)',          // #ececee
    white: 'var(--border-white)',                // #ffffff

    // Contextual borders
    info: 'var(--border-info)',                  // #5c98e5
    warning: 'var(--border-warning)',            // #e1af05
    success: 'var(--border-success)',            // #24a148
    danger: 'var(--border-danger)',              // #da1e28

    // Light borders
    dangerLight: 'var(--border-danger-light)',   // #f5c0c3
    highlightLight: 'var(--border-highlight-light)', // #dbc5ff
    successLight: 'var(--border-success-light)', // #d9ebe1
    calmLight: 'var(--border-calm-light)',       // #c9e1e4
    infoLight: 'var(--border-info-light)',       // #d9def8

    // Lighter borders
    infoLighter: 'var(--border-info-lighter)',   // Rgba(#5c98e5, 0.1)
    warningLighter: 'var(--border-warning-lighter)', // Rgba(#e1af05, 0.1)
    successLighter: 'var(--border-success-lighter)', // Rgba(#24a148, 0.1)
    dangerLighter: 'var(--border-danger-lighter)', // Rgba(#da1e28, 0.1)

    // Special
    manate: 'var(--border-manate)'               // #8c8fa6
  },

  // ==================== BUTTON STYLES ====================
  buttons: {
    // Primary button
    primaryBg: 'var(--btn-primary-bg)',                           // Linear gradient
    primaryHoverBg: 'var(--btn-primary-hover-bg)',               // Linear gradient
    primaryTextColor: 'var(--btn-primary-text-color)',           // #ffffff
    primaryHoverTextColor: 'var(--btn-primary-hover-text-color)', // #ffffff
    primaryDisableTextColor: 'var(--btn-primary-disable-text-color)', // #ffffff

    // Secondary button
    secondaryBg: 'var(--btn-secondary-bg)',                       // Var(--gradient-dark-xs-start)
    secondaryTextColor: 'var(--btn-secondary-text-color)',       // #ffffff
    secondaryHoverBg: 'var(--btn-secondary-hover-bg)',           // Var(--gradient-dark-xs-start)
    secondaryHoverTextColor: 'var(--btn-secondary-hover-text-color)', // #ffffff

    // Outline secondary button
    outlineSecondaryBg: 'var(--btn-outline-secondary-bg)',       // #ffffff
    outlineSecondaryBorderColor: 'var(--btn-outline-secondary-border-color)', // #dfdfe2
    outlineSecondaryTextColor: 'var(--btn-outline-secondary-text-color)', // Var(--text-secondary)
    outlineSecondaryHoverTextColor: 'var(--btn-outline-secondary-hover-text-color)', // Var(--text-secondary)
    outlineSecondaryHoverBorderColor: 'var(--btn-outline-secondary-hover-border-color)', // #dfdfe2
    outlineSecondaryHoverBg: 'var(--btn-outline-secondary-hover-bg)', // #ffffff

    // Tertiary (text) button
    tertiaryTextColor: 'var(--btn-tertiary-text-color)',         // Var(--text-brand-primary)
    tertiaryHoverTextColor: 'var(--btn-tertiary-hover-text-color)', // Var(--text-brand-primary)
    tertiaryHoverBg: 'var(--btn-tertiary-hover-bg)',             // #ffffff

    // Shadows
    ctaShadow: 'var(--btn-cta-shadow)'                            // 0px 4px 4px rgba(44, 48, 78, 0.1)
  },

  // ==================== GRADIENTS ====================
  gradients: {
    // Vibrant gradients
    vibrantLgStart: 'var(--gradient-vibrant-lg-start)',         // #ff3366
    vibrantLgEnd: 'var(--gradient-vibrant-lg-end)',             // #fe5196
    vibrantSmStart: 'var(--gradient-vibrant-sm-start)',         // #ff758c
    vibrantSmEnd: 'var(--gradient-vibrant-sm-end)',             // #ff7eb3

    // Dark gradients
    darkXsStart: 'var(--gradient-dark-xs-start)',               // #2c304e
    darkXsEnd: 'var(--gradient-dark-xs-end)',                   // Rgba(44, 48, 78, 0.40)
    darkSmStart: 'var(--gradient-dark-sm-start)',               // #383a51
    darkSmEnd: 'var(--gradient-dark-sm-end)',                   // #2b2e47

    // Light gradients
    lightStart: 'var(--gradient-light-start)',                  // #e1eeff
    lightEnd: 'var(--gradient-light-end)',                      // #ffe4fb
    lightSmStart: 'var(--gradient-light-sm-start)',             // #e1eeff
    lightSmEnd: 'var(--gradient-light-sm-end)',                 // #ffe4fb

    // Brand gradient
    brandStart: 'var(--gradient-brand-start)',                  // #ff3366
    brandEnd: 'var(--gradient-brand-end)'                       // #fe5196
  },

  // ==================== SPACING & SIZES ====================
  spacing: {
    0: 'var(--spacing-0)',
    2: 'var(--spacing-2)',
    4: 'var(--spacing-4)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    14: 'var(--spacing-14)',
    16: 'var(--spacing-16)',
    18: 'var(--spacing-18)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    28: 'var(--spacing-28)',
    32: 'var(--spacing-32)',
    40: 'var(--spacing-40)',
    48: 'var(--spacing-48)',
    56: 'var(--spacing-56)',
    72: 'var(--spacing-72)'
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    none: 'var(--border-radius-none)',
    '3xs': 'var(--border-radius-3xs)',
    '2xs': 'var(--border-radius-2xs)',
    xs: 'var(--border-radius-xs)',
    sm: 'var(--border-radius-sm)',
    md: 'var(--border-radius-md)',
    lg: 'var(--border-radius-lg)',
    xl: 'var(--border-radius-xl)',
    '2xl': 'var(--border-radius-2xl)',
    full: 'var(--border-radius-full)'
  },

  // ==================== SHADOWS ====================
  shadows: {
    dropdown: 'var(--dropdown-shadow)',                          // Rgba(44, 48, 78, 0.1)
    filterHover: 'var(--filter-hover-shadow)',                   // Rgba(44, 48, 78, 0.03)
    btnCta: 'var(--btn-cta-shadow)'                              // 0px 4px 4px rgba(44, 48, 78, 0.1)
  },

  // ==================== ICONS ====================
  icons: {
    brandPrimary: 'var(--icon-brand-primary)',                   // #ff3366
    brandDisable: 'var(--icon-brand-disable)',                   // #ffc2d6
    secondary: 'var(--icon-secondary)',                           // #2c304e
    tertiary: 'var(--icon-tertiary)',                            // #5a5d72
    disable: 'var(--icon-disable)',                              // #a9acbc
    white: 'var(--icon-white)',                                  // #ffffff
    success: 'var(--icon-success)',                              // #24a148
    danger: 'var(--icon-danger)',                                // #da1e28
    info: 'var(--icon-info)',                                    // #5c98e5
    warning: 'var(--icon-warning)',                              // #e1af05
    muted: 'var(--icon-muted)'                                   // #a9acbc
  },

  // ==================== TABLE ====================
  table: {
    // Header styles
    headerBg: 'var(--lv-table-default-bg)',                      // #f5f5f5
    headerTextColor: 'var(--lv-table-header-text-color)',        // #2c304e
    headerBorderColor: 'var(--lv-table-header-border-color)',    // #dfdfe2

    // Body styles
    borderColor: 'var(--lv-table-border-color)',                 // #ececee
    hoverBg: 'var(--lv-table-hover-bg)',                         // brand-specific
    listItemBg: 'var(--lv-table-list-item-bg)',                  // #ffffff
  },

  // ==================== TOGGLE ====================
  toggle: {
    textYes: 'var(--toggle-text-yes)',                           // 'Yes'
    textNo: 'var(--toggle-text-no)',                             // 'No'
    circleTranslate: 'var(--toggle-circle-translate)',           // 28px
    width: '50px',                                                // Default toggle width
    height: '20px',                                               // Default toggle height
    circleSize: '14px'                                            // Default circle size
  }
};

export default FyleCSSVars;