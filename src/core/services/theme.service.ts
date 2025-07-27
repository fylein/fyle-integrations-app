import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SupportedBrand, getBrandColors, getPresetByBrand } from '../../themes';
import { brandingConfig } from 'src/app/branding/branding-config';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentBrand: SupportedBrand = 'fyle';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }

  /**
   * Initialize theme based on branding configuration
   */
  private initializeTheme(): void {
    // Get brand from existing branding config
    const brandId = brandingConfig.brandId as SupportedBrand;
    this.switchToBrand(brandId);
  }

  /**
   * Switch to a specific brand theme
   * @param brandId The brand to switch to ('fyle' or 'co')
   */
  switchToBrand(brandId: SupportedBrand): void {
    this.currentBrand = brandId;

    // Set data-theme attribute for CSS selectors (works with existing Tailwind + CSS system)
    this.document.documentElement.setAttribute('data-theme', brandId);

    // Apply preset styles as CSS custom properties
    this.applyPresetStyles(brandId);
  }

  /**
   * Apply preset styles as CSS custom properties
   * @param brandId The brand to apply styles for
   */
  private applyPresetStyles(brandId: SupportedBrand): void {
    const preset = getPresetByBrand(brandId);
    const root = this.document.documentElement;

    // Apply color tokens as CSS custom properties
    Object.entries(preset.colors).forEach(([key, value]) => {
      root.style.setProperty(`--preset-${key}`, value);
    });

    // Apply button component styles as CSS custom properties
    const buttonStyles = preset.components.button;

    // Primary button styles
    this.applyButtonVariantStyles(root, 'primary', buttonStyles.primary);
    this.applyButtonVariantStyles(root, 'secondary', buttonStyles.secondary);
    this.applyButtonVariantStyles(root, 'outline', buttonStyles.outline);
    this.applyButtonVariantStyles(root, 'primary-outline', buttonStyles.primaryOutline);
    this.applyButtonVariantStyles(root, 'danger-outline', buttonStyles.dangerOutline);

    // Text button styles
    Object.entries(buttonStyles.text.primary).forEach(([prop, value]) => {
      root.style.setProperty(`--preset-btn-text-${this.kebabCase(prop)}`, value as string);
    });

    Object.entries(buttonStyles.text.primaryHover).forEach(([prop, value]) => {
      root.style.setProperty(`--preset-btn-text-hover-${this.kebabCase(prop)}`, value as string);
    });
  }

  /**
   * Apply button variant styles as CSS custom properties
   * @param root Document root element
   * @param variant Button variant name
   * @param styles Button variant styles
   */
  private applyButtonVariantStyles(root: HTMLElement, variant: string, styles: any): void {
    if (styles.base) {
      Object.entries(styles.base).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-btn-${variant}-${this.kebabCase(prop)}`, value as string);
      });
    }

    if (styles.hover) {
      Object.entries(styles.hover).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-btn-${variant}-hover-${this.kebabCase(prop)}`, value as string);
      });
    }

    if (styles.disabled) {
      Object.entries(styles.disabled).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-btn-${variant}-disabled-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  /**
   * Convert camelCase to kebab-case
   * @param str String to convert
   * @returns kebab-case string
   */
  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Get the color palette for the current brand
   * @returns Current brand's color palette
   */
  getCurrentBrandColors() {
    return getBrandColors(this.currentBrand);
  }

  /**
   * Get the design preset for the current brand
   * @returns Current brand's design preset
   */
  getCurrentBrandPreset() {
    return getPresetByBrand(this.currentBrand);
  }

  /**
   * Get the color palette for a specific brand
   * @param brandId The brand to get colors for
   * @returns Brand-specific color palette
   */
  getBrandColors(brandId: SupportedBrand) {
    return getBrandColors(brandId);
  }

  /**
   * Get current active brand
   */
  getCurrentBrand(): SupportedBrand {
    return this.currentBrand;
  }

  /**
   * Check if a specific brand is currently active
   * @param brandId Brand to check
   */
  isBrandActive(brandId: SupportedBrand): boolean {
    return this.currentBrand === brandId;
  }

  /**
   * Toggle between brands (useful for testing)
   */
  toggleBrand(): void {
    const newBrand: SupportedBrand = this.currentBrand === 'fyle' ? 'co' : 'fyle';
    this.switchToBrand(newBrand);
  }
}