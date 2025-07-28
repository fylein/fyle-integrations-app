/**
 * Co CSS Custom Properties Mapping
 *
 * This file provides organized access to all CSS custom properties
 * defined in src/assets/themes/co/c1dl.scss
 *
 * Usage: Instead of hardcoding hex values, reference these CSS variables
 * so that the preset stays in sync with the actual Co theme definitions.
 */

export const CoCSSVars = {
  // ==================== BACKGROUNDS ====================
  backgrounds: {
    // Brand backgrounds
    brandPrimary: 'var(--bg-brand-primary)',      // #0070a8 (blue-55)
    brandDisable: 'var(--bg-brand-disable)',      // Var(--bg-disable-lighter)
    brandMuted: 'var(--bg-brand-muted)',          // Rgba(#0070a8, 0.15)
    brandHover: 'var(--bg-brand-hover)',          // #0085cc (blue-65)
    brandPressed: 'var(--bg-brand-pressed)',      // #005885 (blue-75)

    // Grey backgrounds
    primary: 'var(--bg-primary)',                 // #1a1a1a (grey-95)
    secondary: 'var(--bg-secondary)',             // #f0f0f0 (grey-10)
    tertiary: 'var(--bg-tertiary)',               // #f7f7f7 (grey-05)
    disable: 'var(--bg-disable)',                 // #e6e6e6 (grey-15)
    white: 'var(--bg-white)',                     // #ffffff
    primaryOpacity: 'var(--bg-primary-opacity)',  // Rgba(#1a1a1a, 0.1)

    // Contextual backgrounds
    success: 'var(--bg-success)',                 // #00a651 (green-45)
    info: 'var(--bg-info)',                       // #0066cc (blue-45)
    warning: 'var(--bg-warning)',                 // #ffd633 (yellow-20)
    danger: 'var(--bg-danger)',                   // #e60012 (red-55)

    // Light backgrounds
    calmLight: 'var(--bg-calm-light)',           // #e6f7e6 (green-05)
    dangerLight: 'var(--bg-danger-light)',       // #ffe6e6 (red-10)
    disableLight: 'var(--bg-disable-light)',     // #f0f0f0 (grey-10)
    highlightLight: 'var(--bg-highlight-light)', // #e6f7e6 (green-05)
    infoLight: 'var(--bg-info-light)',           // #e6f2ff (blue-05)
    successLight: 'var(--bg-success-light)',     // #e6f7e6 (green-05)
    tertiaryLight: 'var(--bg-tertiary-light)',   // #f0f0f0 (grey-10)

    // Lighter backgrounds
    dangerLighter: 'var(--bg-danger-lighter)',   // #fff2f2 (red-05)
    disableLighter: 'var(--bg-disable-lighter)', // #f7f7f7 (grey-05)
    infoLighter: 'var(--bg-info-lighter)',       // #f0f0f0 (blue-10)
    infoLightest: 'var(--bg-info-lightest)',     // #e6f2ff (blue-05)
    successLighter: 'var(--bg-success-lighter)', // #e6f7e6 (green-05)
    tertiaryLighter: 'var(--bg-tertiary-lighter)', // #f7f7f7 (grey-05)
    warningLighter: 'var(--bg-warning-lighter)', // #fffce6 (yellow-05)

    // Special backgrounds
    tooltip: 'var(--tooltip-bg)',                // #5a5d72 for Co

    // Toggle backgrounds
    toggleChecked: 'var(--bg-brand-primary)',    // #0070a8
    toggleUnchecked: 'var(--bg-disable)'         // #d9d9d9
  },

  // ==================== TEXT COLORS ====================
  text: {
    // Brand text
    brandPrimary: 'var(--text-brand-primary)',   // #0070a8 (blue-55)
    brandSecondary: 'var(--text-brand-secondary)', // #0070a8 (blue-55)
    brandHover: 'var(--text-brand-hover)',       // #0085cc (blue-65)
    brandPressed: 'var(--text-brand-pressed)',   // #005885 (blue-75)

    // Standard text
    primary: 'var(--text-primary)',              // #1a1a1a (grey-95)
    secondary: 'var(--text-secondary)',          // #1a1a1a (grey-95)
    tertiary: 'var(--text-tertiary)',            // #808080 (grey-55)
    white: 'var(--text-white)',                  // #ffffff
    disable: 'var(--text-disable)',              // #cccccc (grey-20)
    placeholder: 'var(--text-placeholder)',      // #808080 (grey-55)
    label: 'var(--text-label)',                  // #333333 (grey-85)
    muted: 'var(--text-muted)',                  // #808080 (grey-55)
    mutedLight: 'var(--text-muted-light)',       // #999999 (grey-45)

    // Contextual text
    success: 'var(--text-success)',              // #00a651 (green-55)
    info: 'var(--text-info)',                    // #0070a8 (blue-55)
    warning: 'var(--text-warning)',              // #ffb300 (yellow-55)
    danger: 'var(--text-danger)',                // #e60012 (red-55)
    highlight: 'var(--text-highlight)',          // #00a651 (green-55)
    calm: 'var(--text-calm)'                     // #00a651 (green-55)
  },

  // ==================== BORDERS ====================
  borders: {
    // Brand borders
    brand: 'var(--border-brand)',                // #0070a8 (blue-55)
    brandHover: 'var(--border-brand-hover)',     // #0085cc (blue-65)
    brandPressed: 'var(--border-brand-pressed)', // #005885 (blue-75)

    // Standard borders
    primary: 'var(--border-primary)',            // #808080 (grey-55)
    secondary: 'var(--border-secondary)',        // #e6e6e6 (grey-15)
    tertiary: 'var(--border-tertiary)',          // #f7f7f7 (grey-05)
    neutral: 'var(--border-neutral)',            // #1a1a1a (grey-95)
    white: 'var(--border-white)',                // #ffffff
    disable: 'var(--border-disable)',            // #cccccc (grey-20)

    // Contextual borders
    info: 'var(--border-info)',                  // #0070a8 (blue-55)
    warning: 'var(--border-warning)',            // #ffb300 (yellow-55)
    success: 'var(--border-success)',            // #00a651 (green-55)
    danger: 'var(--border-danger)',              // #e60012 (red-55)

    // Light borders
    calmLight: 'var(--border-calm-light)',       // #e6f7e6 (green-10)
    dangerLight: 'var(--border-danger-light)',   // #ffcccc (red-15)
    dangerLighter: 'var(--border-danger-lighter)', // #ffe6e6 (red-10)
    highlightLight: 'var(--border-highlight-light)', // #ccf2cc (green-15)
    infoLight: 'var(--border-info-light)',       // #cce6ff (blue-15)
    infoLighter: 'var(--border-info-lighter)',   // #e6f2ff (blue-10)
    successLight: 'var(--border-success-light)', // #e6f7e6 (green-10)
    successLighter: 'var(--border-success-lighter)', // #f2fff2 (green-05)
    warningLighter: 'var(--border-warning-lighter)' // #fffce6 (yellow-05)
  },

  // ==================== BUTTON STYLES ====================
  buttons: {
    // Primary button
    primaryBg: 'var(--btn-primary-bg)',                           // Var(--bg-brand-primary)
    primaryTextColor: 'var(--btn-primary-text-color)',           // Var(--text-white)
    primaryHoverBg: 'var(--btn-primary-hover-bg)',               // Var(--bg-brand-hover)
    primaryHoverTextColor: 'var(--btn-primary-hover-text-color)', // Var(--text-white)
    primaryPressedBg: 'var(--btn-primary-pressed-bg)',           // Var(--bg-brand-pressed)
    primaryPressedTextColor: 'var(--btn-primary-pressed-text-color)', // Var(--text-white)
    primaryDisableBg: 'var(--btn-primary-disable-bg)',           // Var(--bg-disable-lighter)
    primaryDisableTextColor: 'var(--btn-primary-disable-text-color)', // Var(--text-disable)

    // Secondary button
    secondaryBg: 'var(--btn-secondary-bg)',                       // Var(--bg-primary)
    secondaryTextColor: 'var(--btn-secondary-text-color)',       // Var(--text-white)
    secondaryHoverBg: 'var(--btn-secondary-hover-bg)',           // #333333 (grey-85)
    secondaryHoverTextColor: 'var(--btn-secondary-hover-text-color)', // Var(--text-white)
    secondaryPressedBg: 'var(--btn-secondary-pressed-bg)',       // #4d4d4d (grey-75)
    secondaryPressedTextColor: 'var(--btn-secondary-pressed-text-color)', // Var(--text-white)
    secondaryDisableBg: 'var(--btn-secondary-disable-bg)',       // Var(--bg-disable-lighter)
    secondaryDisableTextColor: 'var(--btn-secondary-disable-text-color)', // Var(--text-disable)

    // Primary outline button
    outlinePrimaryBg: 'var(--btn-outline-primary-bg)',           // Transparent
    outlinePrimaryBorderColor: 'var(--btn-outline-primary-border-color)', // Var(--border-brand)
    outlinePrimaryTextColor: 'var(--btn-outline-primary-text-color)', // Var(--text-brand-primary)
    outlinePrimaryHoverBg: 'var(--btn-outline-primary-hover-bg)', // Var(--bg-info-lightest)
    outlinePrimaryHoverBorderColor: 'var(--btn-outline-primary-hover-border-color)', // Var(--border-brand-hover)
    outlinePrimaryHoverTextColor: 'var(--btn-outline-primary-hover-text-color)', // Var(--text-brand-hover)
    outlinePrimaryPressedBg: 'var(--btn-outline-primary-pressed-bg)', // Var(--bg-info-lighter)
    outlinePrimaryPressedBorderColor: 'var(--btn-outline-primary-pressed-border-color)', // Var(--border-brand-pressed)
    outlinePrimaryPressedTextColor: 'var(--btn-outline-primary-pressed-text-color)', // Var(--text-brand-pressed)
    outlinePrimaryDisableBorderColor: 'var(--btn-outline-primary-disable-border-color)', // #b3b3b3 (grey-25)
    outlinePrimaryDisableTextColor: 'var(--btn-outline-primary-disable-text-color)', // Var(--text-disable)

    // Secondary outline button
    outlineSecondaryBg: 'var(--btn-outline-secondary-bg)',       // Var(--bg-white)
    outlineSecondaryBorderColor: 'var(--btn-outline-secondary-border-color)', // Var(--border-neutral)
    outlineSecondaryTextColor: 'var(--btn-outline-secondary-text-color)', // Var(--text-primary)
    outlineSecondaryHoverBg: 'var(--btn-outline-secondary-hover-bg)', // Var(--bg-tertiary)
    outlineSecondaryHoverBorderColor: 'var(--btn-outline-secondary-hover-border-color)', // #333333 (grey-85)
    outlineSecondaryHoverTextColor: 'var(--btn-outline-secondary-hover-text-color)', // #333333 (grey-85)
    outlineSecondaryPressedBg: 'var(--btn-outline-secondary-pressed-bg)', // Var(--bg-tertiary-light)
    outlineSecondaryPressedBorderColor: 'var(--btn-outline-secondary-pressed-border-color)', // #4d4d4d (grey-75)
    outlineSecondaryPressedTextColor: 'var(--btn-outline-secondary-pressed-text-color)', // #4d4d4d (grey-75)
    outlineSecondaryDisableBorderColor: 'var(--btn-outline-secondary-disable-border-color)', // #b3b3b3 (grey-25)
    outlineSecondaryDisableTextColor: 'var(--btn-outline-secondary-disable-text-color)', // Var(--text-disable)

    // Tertiary (text) button - Brand
    tertiaryTextColor: 'var(--btn-tertiary-text-color)',         // Var(--text-brand-primary)
    tertiaryHoverBg: 'var(--btn-tertiary-hover-bg)',             // Var(--bg-info-lightest)
    tertiaryHoverTextColor: 'var(--btn-tertiary-hover-text-color)', // Var(--text-brand-hover)
    tertiaryPressedBg: 'var(--btn-tertiary-pressed-bg)',         // Var(--bg-info-lighter)
    tertiaryPressedTextColor: 'var(--btn-tertiary-pressed-text-color)', // Var(--text-brand-pressed)
    tertiaryDisableTextColor: 'var(--btn-tertiary-disable-text-color)', // Var(--text-disable)

    // Tertiary (text) button - Neutral
    tertiaryNeutralTextColor: 'var(--btn-tertiary-neutral-text-color)', // Var(--text-primary)
    tertiaryNeutralHoverBg: 'var(--btn-tertiary-neutral-hover-bg)', // Var(--bg-tertiary-lighter)
    tertiaryNeutralHoverTextColor: 'var(--btn-tertiary-neutral-hover-text-color)', // #333333 (grey-85)
    tertiaryNeutralPressedBg: 'var(--btn-tertiary-neutral-pressed-bg)', // Var(--bg-tertiary-light)
    tertiaryNeutralPressedTextColor: 'var(--btn-tertiary-neutral-pressed-text-color)', // #4d4d4d (grey-75)
    tertiaryNeutralDisableTextColor: 'var(--btn-tertiary-neutral-disable-text-color)', // Var(--text-disable)

    // Danger button
    dangerBg: 'var(--btn-danger-bg)',                             // Var(--bg-danger)
    dangerTextColor: 'var(--btn-danger-text-color)',             // Var(--text-white)
    dangerHoverBg: 'var(--btn-danger-hover-bg)',                 // #ff1a1a (red-65)
    dangerHoverTextColor: 'var(--btn-danger-hover-text-color)',   // Var(--text-white)
    dangerPressedBg: 'var(--btn-danger-pressed-bg)',             // #cc0000 (red-75)
    dangerPressedTextColor: 'var(--btn-danger-pressed-text-color)', // Var(--text-white)
    dangerDisableBg: 'var(--btn-danger-disable-bg)',             // Var(--bg-disable-lighter)
    dangerDisableTextColor: 'var(--btn-danger-disable-text-color)', // Var(--text-disable)

    // Danger outline button
    dangerOutlineBg: 'var(--btn-danger-outline-bg)',             // Var(--bg-white)
    dangerOutlineBorderColor: 'var(--btn-danger-outline-border-color)', // Var(--bg-danger)
    dangerOutlineTextColor: 'var(--btn-danger-outline-text-color)', // Var(--text-danger)
    dangerOutlineHoverBg: 'var(--btn-danger-outline-hover-bg)',   // Var(--border-danger-lighter)
    dangerOutlineHoverBorderColor: 'var(--btn-danger-outline-hover-border-color)', // #ff1a1a (red-65)
    dangerOutlineHoverTextColor: 'var(--btn-danger-outline-hover-text-color)', // #ff1a1a (red-65)
    dangerOutlinePressedBg: 'var(--btn-danger-outline-pressed-bg)', // Var(--bg-danger-light)
    dangerOutlinePressedBorderColor: 'var(--btn-danger-outline-pressed-border-color)', // #cc0000 (red-75)
    dangerOutlinePressedTextColor: 'var(--btn-danger-outline-pressed-text-color)', // #cc0000 (red-75)
    dangerOutlineDisableBorderColor: 'var(--btn-danger-outline-disable-border-color)', // #b3b3b3 (grey-25)
    dangerOutlineDisableTextColor: 'var(--btn-danger-outline-disable-text-color)', // Var(--text-disable)

    // Tertiary danger button
    tertiaryDangerTextColor: 'var(--btn-tertiary-danger-text-color)', // Var(--text-danger)
    tertiaryDangerHoverBg: 'var(--btn-tertiary-danger-hover-bg)', // #fff2f2 (red-05)
    tertiaryDangerHoverTextColor: 'var(--btn-tertiary-danger-hover-text-color)', // #ff1a1a (red-65)
    tertiaryDangerPressedBg: 'var(--btn-tertiary-danger-pressed-bg)', // #ffe6e6 (red-10)
    tertiaryDangerPressedTextColor: 'var(--btn-tertiary-danger-pressed-text-color)', // #cc0000 (red-75)
    tertiaryDangerDisableTextColor: 'var(--btn-tertiary-danger-disable-text-color)' // Var(--text-disable)
  },

  // ==================== SPACING & SIZES ====================
  spacing: {
    0: 'var(--spacing-0)',    // 0px
    2: 'var(--spacing-2)',    // 2px
    4: 'var(--spacing-4)',    // 4px
    6: 'var(--spacing-6)',    // 6px
    8: 'var(--spacing-8)',    // 8px
    10: 'var(--spacing-10)',  // 10px
    12: 'var(--spacing-12)',  // 12px
    14: 'var(--spacing-14)',  // 14px
    16: 'var(--spacing-16)',  // 16px
    18: 'var(--spacing-18)',  // 18px
    20: 'var(--spacing-20)',  // 20px
    24: 'var(--spacing-24)',  // 24px
    28: 'var(--spacing-28)',  // 28px
    32: 'var(--spacing-32)',  // 32px
    40: 'var(--spacing-40)',  // 40px
    48: 'var(--spacing-48)',  // 48px
    56: 'var(--spacing-56)',  // 56px
    72: 'var(--spacing-72)'   // 72px
  },

  sizes: {
    0: 'var(--size-0)',
    2: 'var(--size-2)',
    4: 'var(--size-4)',
    6: 'var(--size-6)',
    8: 'var(--size-8)',
    10: 'var(--size-10)',
    12: 'var(--size-12)',
    14: 'var(--size-14)',
    16: 'var(--size-16)',
    18: 'var(--size-18)',
    20: 'var(--size-20)',
    24: 'var(--size-24)',
    28: 'var(--size-28)',
    32: 'var(--size-32)',
    40: 'var(--size-40)',
    48: 'var(--size-48)',
    56: 'var(--size-56)',
    72: 'var(--size-72)'
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    none: 'var(--border-radius-none)',  // 0px
    '3xs': 'var(--border-radius-3xs)',  // 2px
    '2xs': 'var(--border-radius-2xs)',  // 4px
    xs: 'var(--border-radius-xs)',      // 6px
    sm: 'var(--border-radius-sm)',      // 8px
    md: 'var(--border-radius-md)',      // 12px
    lg: 'var(--border-radius-lg)',      // 12px
    xl: 'var(--border-radius-xl)',      // 12px
    '2xl': 'var(--border-radius-2xl)',  // 12px
    full: 'var(--border-radius-full)'   // 9999px
  },

  // ==================== BORDER WIDTHS ====================
  borderWidth: {
    1: 'var(--border-1)',               // 1px
    2: 'var(--border-2)'                // 2px
  },

  // ==================== ICONS ====================
  icons: {
    brandPrimary: 'var(--icon-brand-primary)',   // #0070a8 (blue-55)
    brandSecondary: 'var(--icon-brand-secondary)', // #4da6d9 (blue-35)
    brandDisable: 'var(--icon-brand-disable)',   // #e6f2ff (blue-10)

    primary: 'var(--icon-primary)',              // #1a1a1a (grey-95)
    secondary: 'var(--icon-secondary)',          // #333333 (grey-85)
    tertiary: 'var(--icon-tertiary)',            // #808080 (grey-55)
    disable: 'var(--icon-disable)',              // #cccccc (grey-20)
    muted: 'var(--icon-muted)',                  // #cccccc (grey-20)
    white: 'var(--icon-white)',                  // #ffffff

    success: 'var(--icon-success)',              // #00a651 (green-55)
    danger: 'var(--icon-danger)',                // #e60012 (red-55)
    info: 'var(--icon-info)',                    // #0070a8 (blue-55)
    warning: 'var(--icon-warning)',              // #ffb300 (yellow-55)
    link: 'var(--icon-link)'                     // #0070a8 (blue-55)
  },

  // ==================== TABLE ====================
  table: {
    // Header styles
    headerBg: 'var(--lv-table-default-bg)',                      // #f7f7f7 (grey-05)
    headerTextColor: 'var(--lv-table-header-text-color)',        // #333333 (grey-85)
    headerBorderColor: 'var(--lv-table-header-border-color)',    // #e6e6e6 (grey-15)

    // Body styles
    borderColor: 'var(--lv-table-border-color)',                 // #f7f7f7 (grey-05)
    hoverBg: 'var(--lv-table-hover-bg)',                         // rgba(12, 16, 19, 0.02)
    listItemBg: 'var(--lv-table-list-item-bg)',                  // #ffffff
  },

  // ==================== LINKS ====================
  links: {
    primary: 'var(--link-primary)',              // #0070a8 (blue-55)
    hover: 'var(--link-hover)',                  // #0085cc (blue-65)
    pressed: 'var(--link-pressed)',              // #005885 (blue-75)
    visited: 'var(--link-visited)'               // #9966cc (purple-55)
  },

  // ==================== ELEVATIONS ====================
  elevations: {
    overlaySubtle: 'var(--background-overlay-subtle)' // Rgba(black, 0.02)
  },

  // ==================== TOGGLE ====================
  toggle: {
    textYes: '"Yes"',                                             // Co doesn't have CSS var for text
    textNo: '"No"',                                               // Co doesn't have CSS var for text
    circleTranslate: 'var(--toggle-circle-translate)',           // 16px
    width: 'var(--toggle-width)',                                 // 38px
    height: 'var(--toggle-height)',                               // 22px
    circleSize: '18px'                                            // Co circle size
  }
};

export default CoCSSVars;