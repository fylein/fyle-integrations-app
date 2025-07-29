// Theme presets for Fyle Integrations App
export { FylePreset } from './fyle-preset';
export { CoPreset } from './co-preset';

// CSS Variables mapping - organized access to all CSS custom properties
export { FyleCSSVars } from './fyle-css-vars';
export { CoCSSVars } from './co-css-vars';

// Theme utilities and types
export * from './theme.types';

// Preset utilities
import { FylePreset } from './fyle-preset';
import { CoPreset } from './co-preset';
import { FyleCSSVars } from './fyle-css-vars';
import { CoCSSVars } from './co-css-vars';
import { SupportedBrand } from './theme.types';

/**
 * Get preset by brand ID
 * @param brandId The brand to get preset for
 * @returns Brand-specific preset object
 */
export function getPresetByBrand(brandId: SupportedBrand) {
  const presets = {
    fyle: FylePreset,
    co: CoPreset
  };

  return presets[brandId];
}

/**
 * Get all available presets
 * @returns Object with all brand presets
 */
export function getAllPresets() {
  return {
    fyle: FylePreset,
    co: CoPreset
  };
}

/**
 * Get color palette for a specific brand
 * @param brandId The brand to get colors for
 * @returns Brand-specific color palette
 */
export function getBrandColors(brandId: SupportedBrand) {
  const preset = getPresetByBrand(brandId);
  return preset.colors;
}

/**
 * Get CSS variables mapping for a specific brand
 * @param brandId The brand to get CSS variables for
 * @returns Organized CSS variables mapping
 */
export function getBrandCSSVars(brandId: SupportedBrand) {
  const cssVars = {
    fyle: FyleCSSVars,
    co: CoCSSVars
  };

  return cssVars[brandId];
}

/**
 * Quick access to commonly used CSS variables by category for both brands
 * Usage examples:
 *
 * Fyle brand:
 * - FyleCSSVars.backgrounds.brandPrimary  // 'var(--bg-brand-primary)'
 * - FyleCSSVars.buttons.primaryBg         // 'var(--btn-primary-bg)'
 * - FyleCSSVars.text.brandPrimary         // 'var(--text-brand-primary)'
 *
 * Co brand:
 * - CoCSSVars.backgrounds.brandPrimary    // 'var(--bg-brand-primary)'
 * - CoCSSVars.buttons.primaryBg           // 'var(--btn-primary-bg)'
 * - CoCSSVars.text.brandPrimary           // 'var(--text-brand-primary)'
 *
 * Or use the utility function:
 * - getBrandCSSVars('fyle').backgrounds.brandPrimary
 * - getBrandCSSVars('co').buttons.primaryBg
 */
export const CSSVars = {
  fyle: FyleCSSVars,
  co: CoCSSVars
};