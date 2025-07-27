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

    // Apply component styles
    this.applyButtonStyles(root, preset.components.button);
    this.applyInputStyles(root, preset.components.input);
    this.applyTooltipStyles(root, preset.components.tooltip);
    this.applyToggleStyles(root, preset.components.toggle);
    this.applyRadioStyles(root, preset.components.radio);
    this.applyDialogStyles(root, preset.components.dialog);
  }

  private applyButtonStyles(root: HTMLElement, buttonStyles: any): void {
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

  private applyInputStyles(root: HTMLElement, inputStyles: any): void {
    // Basic input styles
    if (inputStyles.base) {
      Object.entries(inputStyles.base).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Input focus visible styles
    if (inputStyles.focusVisible) {
      Object.entries(inputStyles.focusVisible).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-focus-visible-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Input focus styles
    if (inputStyles.focus) {
      Object.entries(inputStyles.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Input disabled styles
    if (inputStyles.disabled) {
      Object.entries(inputStyles.disabled).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-disabled-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Input placeholder styles
    if (inputStyles.placeholder) {
      Object.entries(inputStyles.placeholder).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-placeholder-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Calendar input styles
    this.applyCalendarInputStyles(root, inputStyles.calendar);

    // Dropdown label input styles
    this.applyDropdownLabelStyles(root, inputStyles.dropdownLabel);

    // Chips input styles
    if (inputStyles.chips?.focus) {
      Object.entries(inputStyles.chips.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-chips-input-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Input container focus styles
    if (inputStyles.container?.focus) {
      Object.entries(inputStyles.container.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-input-container-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Dropdown filter styles
    if (inputStyles.dropdownFilter) {
      Object.entries(inputStyles.dropdownFilter).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-filter-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyCalendarInputStyles(root: HTMLElement, calendarStyles: any): void {
    if (!calendarStyles) {
return;
}

    Object.entries(calendarStyles).forEach(([prop, value]) => {
      if (prop !== 'focus' && prop !== 'placeholder') {
        root.style.setProperty(`--preset-calendar-input-${this.kebabCase(prop)}`, value as string);
      }
    });

    // Calendar input focus styles
    if (calendarStyles.focus) {
      Object.entries(calendarStyles.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-calendar-input-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Calendar input placeholder styles
    if (calendarStyles.placeholder) {
      Object.entries(calendarStyles.placeholder).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-calendar-input-placeholder-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyDropdownLabelStyles(root: HTMLElement, dropdownLabelStyles: any): void {
    if (!dropdownLabelStyles) {
return;
}

    Object.entries(dropdownLabelStyles).forEach(([prop, value]) => {
      if (prop !== 'input') {
        root.style.setProperty(`--preset-dropdown-label-${this.kebabCase(prop)}`, value as string);
      }
    });

    // Dropdown label input specific styles
    if (dropdownLabelStyles.input) {
      Object.entries(dropdownLabelStyles.input).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-label-input-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyTooltipStyles(root: HTMLElement, tooltipStyles: any): void {
    // Tooltip text styles
    if (tooltipStyles.text) {
      Object.entries(tooltipStyles.text).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-tooltip-text-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Tooltip arrow styles
    if (tooltipStyles.arrow) {
      Object.entries(tooltipStyles.arrow).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-tooltip-arrow-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Tooltip bottom specific styles
    if (tooltipStyles.bottom) {
      Object.entries(tooltipStyles.bottom).forEach(([prop, value]) => {
        if (prop === 'arrow') {
          // Handle nested arrow styles
          Object.entries(value as any).forEach(([arrowProp, arrowValue]) => {
            root.style.setProperty(`--preset-tooltip-bottom-arrow-${this.kebabCase(arrowProp)}`, arrowValue as string);
          });
        } else {
          root.style.setProperty(`--preset-tooltip-bottom-${this.kebabCase(prop)}`, value as string);
        }
      });
    }
  }

  private applyToggleStyles(root: HTMLElement, toggleStyles: any): void {
    // Base toggle styles
    if (toggleStyles.height) {
      root.style.setProperty('--preset-toggle-height', toggleStyles.height);
    }
    if (toggleStyles.width) {
      root.style.setProperty('--preset-toggle-width', toggleStyles.width);
    }

    // Toggle circle styles
    if (toggleStyles.circle) {
      Object.entries(toggleStyles.circle).forEach(([prop, value]) => {
        if (value !== undefined && value !== null) {
          root.style.setProperty(`--preset-toggle-circle-${this.kebabCase(prop)}`, value as string);
        }
      });
    }

    // Toggle checked state styles
    if (toggleStyles.checked) {
      // Handle nested circle transform
      if (toggleStyles.checked.circle?.transform) {
        root.style.setProperty('--preset-toggle-checked-circle-transform', toggleStyles.checked.circle.transform);
      }

      // Handle other checked properties
      if (toggleStyles.checked.background) {
        root.style.setProperty('--preset-toggle-checked-background', toggleStyles.checked.background);
      }
      if (toggleStyles.checked.width) {
        root.style.setProperty('--preset-toggle-checked-width', toggleStyles.checked.width);
      }
      if (toggleStyles.checked.height) {
        root.style.setProperty('--preset-toggle-checked-height', toggleStyles.checked.height);
      }
    }

    // Toggle unchecked state styles
    if (toggleStyles.unchecked) {
      Object.entries(toggleStyles.unchecked).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-toggle-unchecked-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Toggle focus styles
    if (toggleStyles.focus) {
      Object.entries(toggleStyles.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-toggle-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Toggle text styles
    if (toggleStyles.text) {
      Object.entries(toggleStyles.text).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-toggle-text-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyRadioStyles(root: HTMLElement, radioStyles: any): void {
    // Base radio styles
    if (radioStyles.width) {
      root.style.setProperty('--preset-radio-width', radioStyles.width);
    }
    if (radioStyles.height) {
      root.style.setProperty('--preset-radio-height', radioStyles.height);
    }

    // Radio box styles
    if (radioStyles.box) {
      Object.entries(radioStyles.box).forEach(([prop, value]) => {
        if (prop !== 'hover' && prop !== 'highlight') {
          root.style.setProperty(`--preset-radio-box-${this.kebabCase(prop)}`, value as string);
        }
      });

      // Radio box hover styles
      if (radioStyles.box.hover) {
        Object.entries(radioStyles.box.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-radio-box-hover-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Radio box highlight styles
      if (radioStyles.box.highlight) {
        Object.entries(radioStyles.box.highlight).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-radio-box-highlight-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Radio icon styles
    if (radioStyles.icon) {
      Object.entries(radioStyles.icon).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-radio-icon-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyDialogStyles(root: HTMLElement, dialogStyles: any): void {
    // Dialog content styles
    if (dialogStyles.content) {
      Object.entries(dialogStyles.content).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dialog-content-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Dialog header styles
    if (dialogStyles.header) {
      Object.entries(dialogStyles.header).forEach(([prop, value]) => {
        if (prop !== 'title' && prop !== 'button') {
          root.style.setProperty(`--preset-dialog-header-${this.kebabCase(prop)}`, value as string);
        }
      });

      // Dialog header title styles
      if (dialogStyles.header.title) {
        Object.entries(dialogStyles.header.title).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dialog-title-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Dialog header button styles
      if (dialogStyles.header.button) {
        Object.entries(dialogStyles.header.button).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dialog-header-button-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Dialog top-right positioning styles
    if (dialogStyles.topRight) {
      Object.entries(dialogStyles.topRight).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dialog-top-right-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Dialog close icon styles
    if (dialogStyles.closeIcon) {
      Object.entries(dialogStyles.closeIcon).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dialog-close-icon-${this.kebabCase(prop)}`, value as string);
      });
    }
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