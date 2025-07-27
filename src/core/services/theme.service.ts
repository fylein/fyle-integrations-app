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
    this.applyCheckboxStyles(root, preset.components.checkbox);
    this.applyMultiselectStyles(root, preset.components.multiselect);
    this.applyDropdownStyles(root, preset.components.dropdown);
    this.applyDatepickerStyles(root, preset.components.datepicker);
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

  private applyCheckboxStyles(root: HTMLElement, checkboxStyles: any): void {
    // Base checkbox styles
    if (checkboxStyles.height) {
      root.style.setProperty('--preset-checkbox-height', checkboxStyles.height);
    }
    if (checkboxStyles.width) {
      root.style.setProperty('--preset-checkbox-width', checkboxStyles.width);
    }

    // Checkbox box styles
    if (checkboxStyles.box) {
      Object.entries(checkboxStyles.box).forEach(([prop, value]) => {
        if (prop !== 'hover' && prop !== 'highlight') {
          root.style.setProperty(`--preset-checkbox-box-${this.kebabCase(prop)}`, value as string);
        }
      });

      // Checkbox box hover styles
      if (checkboxStyles.box.hover) {
        Object.entries(checkboxStyles.box.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-checkbox-box-hover-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Checkbox box highlight styles
      if (checkboxStyles.box.highlight) {
        Object.entries(checkboxStyles.box.highlight).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-checkbox-box-highlight-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Checkbox icon styles
    if (checkboxStyles.icon) {
      Object.entries(checkboxStyles.icon).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-checkbox-icon-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Checkbox check icon styles (for pi-check)
    if (checkboxStyles.checkIcon) {
      Object.entries(checkboxStyles.checkIcon).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-checkbox-check-icon-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Multiselect checkbox styles
    if (checkboxStyles.multiselect) {
      Object.entries(checkboxStyles.multiselect).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-checkbox-multiselect-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyMultiselectStyles(root: HTMLElement, multiselectStyles: any): void {
    // Base multiselect styles
    const baseProps = ['height', 'display', 'alignItems', 'width', 'border', 'borderColor', 'borderRadius', 'paddingRight'];
    baseProps.forEach(prop => {
      if (multiselectStyles[prop]) {
        root.style.setProperty(`--preset-multiselect-${this.kebabCase(prop)}`, multiselectStyles[prop]);
      }
    });

    // Trigger styles
    if (multiselectStyles.trigger) {
      Object.entries(multiselectStyles.trigger).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-multiselect-trigger-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Label styles
    if (multiselectStyles.label) {
      Object.entries(multiselectStyles.label).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-multiselect-label-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Focus styles
    if (multiselectStyles.focus) {
      Object.entries(multiselectStyles.focus).forEach(([prop, value]) => {
        if (prop !== 'enabled') {
          root.style.setProperty(`--preset-multiselect-focus-${this.kebabCase(prop)}`, value as string);
        }
      });

      if (multiselectStyles.focus.enabled) {
        Object.entries(multiselectStyles.focus.enabled).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-focus-enabled-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Panel styles
    if (multiselectStyles.panel) {
      Object.entries(multiselectStyles.panel).forEach(([prop, value]) => {
        if (prop !== 'header') {
          root.style.setProperty(`--preset-multiselect-panel-${this.kebabCase(prop)}`, value as string);
        }
      });

      if (multiselectStyles.panel.header) {
        Object.entries(multiselectStyles.panel.header).forEach(([prop, value]) => {
          if (prop !== 'checkbox') {
            root.style.setProperty(`--preset-multiselect-panel-header-${this.kebabCase(prop)}`, value as string);
          }
        });

        if (multiselectStyles.panel.header.checkbox) {
          Object.entries(multiselectStyles.panel.header.checkbox).forEach(([prop, value]) => {
            root.style.setProperty(`--preset-multiselect-header-checkbox-${this.kebabCase(prop)}`, value as string);
          });
        }
      }
    }

    // Filter container and close styles
    ['filterContainer', 'close'].forEach(component => {
      if (multiselectStyles[component]) {
        Object.entries(multiselectStyles[component]).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-${this.kebabCase(component)}-${this.kebabCase(prop)}`, value as string);
        });
      }
    });

    // Placeholder styles
    if (multiselectStyles.placeholder) {
      Object.entries(multiselectStyles.placeholder).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-multiselect-placeholder-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Item styles
    if (multiselectStyles.item) {
      const itemBaseProps = ['fontSize', 'color', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'];
      itemBaseProps.forEach(prop => {
        if (multiselectStyles.item[prop]) {
          root.style.setProperty(`--preset-multiselect-item-${this.kebabCase(prop)}`, multiselectStyles.item[prop]);
        }
      });

      // Item highlight styles
      if (multiselectStyles.item.highlight) {
        Object.entries(multiselectStyles.item.highlight).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-item-highlight-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item hover styles
      if (multiselectStyles.item.hover) {
        Object.entries(multiselectStyles.item.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-item-hover-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item focus styles
      if (multiselectStyles.item.focus) {
        Object.entries(multiselectStyles.item.focus).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-item-focus-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item general hover styles
      if (multiselectStyles.item.generalHover) {
        Object.entries(multiselectStyles.item.generalHover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-multiselect-item-general-hover-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Empty message styles
    if (multiselectStyles.emptyMessage) {
      Object.entries(multiselectStyles.emptyMessage).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-multiselect-empty-message-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyDropdownStyles(root: HTMLElement, dropdownStyles: any): void {
    // Base dropdown styles
    const baseProps = ['height', 'width', 'transform', 'border', 'borderColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderRadius'];
    baseProps.forEach(prop => {
      if (dropdownStyles[prop]) {
        root.style.setProperty(`--preset-dropdown-${this.kebabCase(prop)}`, dropdownStyles[prop]);
      }
    });

    // Disabled styles
    if (dropdownStyles.disabled) {
      Object.entries(dropdownStyles.disabled).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-disabled-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Trigger styles
    if (dropdownStyles.trigger) {
      Object.entries(dropdownStyles.trigger).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-trigger-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Focus styles
    if (dropdownStyles.focus) {
      Object.entries(dropdownStyles.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Hover styles
    if (dropdownStyles.hover) {
      Object.entries(dropdownStyles.hover).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-hover-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Placeholder styles
    if (dropdownStyles.placeholder) {
      Object.entries(dropdownStyles.placeholder).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-placeholder-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Panel styles
    if (dropdownStyles.panel) {
      if (dropdownStyles.panel.items) {
        Object.entries(dropdownStyles.panel.items).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-panel-items-${this.kebabCase(prop)}`, value as string);
        });
      }
      if (dropdownStyles.panel.header) {
        Object.entries(dropdownStyles.panel.header).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-panel-header-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Header styles (separate from panel.header)
    if (dropdownStyles.header) {
      Object.entries(dropdownStyles.header).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-header-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Item styles
    if (dropdownStyles.item) {
      const itemBaseProps = ['fontSize', 'color', 'borderRadius', 'minHeight', 'display', 'alignItems', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
      itemBaseProps.forEach(prop => {
        if (dropdownStyles.item[prop]) {
          root.style.setProperty(`--preset-dropdown-item-${this.kebabCase(prop)}`, dropdownStyles.item[prop]);
        }
      });

      // Item highlight styles
      if (dropdownStyles.item.highlight) {
        Object.entries(dropdownStyles.item.highlight).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-item-highlight-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item focus styles
      if (dropdownStyles.item.focus) {
        Object.entries(dropdownStyles.item.focus).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-item-focus-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item hover styles
      if (dropdownStyles.item.hover) {
        Object.entries(dropdownStyles.item.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-item-hover-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Item group styles
      if (dropdownStyles.item.group) {
        Object.entries(dropdownStyles.item.group).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-dropdown-item-group-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Empty message styles
    if (dropdownStyles.emptyMessage) {
      Object.entries(dropdownStyles.emptyMessage).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-empty-message-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Divider styles
    if (dropdownStyles.divider) {
      Object.entries(dropdownStyles.divider).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-divider-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Calendar input styles
    if (dropdownStyles.calendarInput) {
      Object.entries(dropdownStyles.calendarInput).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-calendar-input-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Filter icon styles
    if (dropdownStyles.filterIcon) {
      Object.entries(dropdownStyles.filterIcon).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-dropdown-filter-icon-${this.kebabCase(prop)}`, value as string);
      });
    }
  }

  private applyDatepickerStyles(root: HTMLElement, datepickerStyles: any): void {
    // Base datepicker styles
    if (datepickerStyles.padding) {
      root.style.setProperty('--preset-datepicker-padding', datepickerStyles.padding);
    }

    // Header styles
    if (datepickerStyles.header) {
      Object.entries(datepickerStyles.header).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-header-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Title styles
    if (datepickerStyles.title) {
      const titleBaseProps = ['fontSize', 'fontFamily', 'color'];
      titleBaseProps.forEach(prop => {
        if (datepickerStyles.title[prop]) {
          root.style.setProperty(`--preset-datepicker-title-${this.kebabCase(prop)}`, datepickerStyles.title[prop]);
        }
      });

      // Title hover styles
      if (datepickerStyles.title.hover) {
        Object.entries(datepickerStyles.title.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-datepicker-title-hover-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Month styles
    if (datepickerStyles.month) {
      Object.entries(datepickerStyles.month).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-month-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Navigation styles
    if (datepickerStyles.nav && datepickerStyles.nav.focus) {
      Object.entries(datepickerStyles.nav.focus).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-nav-focus-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Day header styles
    if (datepickerStyles.dayHeader) {
      Object.entries(datepickerStyles.dayHeader).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-day-header-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Cell styles
    if (datepickerStyles.cell) {
      Object.entries(datepickerStyles.cell).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-cell-${this.kebabCase(prop)}`, value as string);
      });
    }

    // Date styles
    if (datepickerStyles.date) {
      const dateBaseProps = ['fontSize', 'color', 'height', 'width'];
      dateBaseProps.forEach(prop => {
        if (datepickerStyles.date[prop]) {
          root.style.setProperty(`--preset-datepicker-date-${this.kebabCase(prop)}`, datepickerStyles.date[prop]);
        }
      });

      // Date focus styles
      if (datepickerStyles.date.focus) {
        Object.entries(datepickerStyles.date.focus).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-datepicker-date-focus-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Date highlight styles
      if (datepickerStyles.date.highlight) {
        Object.entries(datepickerStyles.date.highlight).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-datepicker-date-highlight-${this.kebabCase(prop)}`, value as string);
        });
      }

      // Date hover styles
      if (datepickerStyles.date.hover) {
        Object.entries(datepickerStyles.date.hover).forEach(([prop, value]) => {
          root.style.setProperty(`--preset-datepicker-date-hover-${this.kebabCase(prop)}`, value as string);
        });
      }
    }

    // Month picker styles
    if (datepickerStyles.monthpicker) {
      Object.entries(datepickerStyles.monthpicker).forEach(([prop, value]) => {
        if (prop === 'focus') {
          Object.entries(value as any).forEach(([focusProp, focusValue]) => {
            root.style.setProperty(`--preset-datepicker-monthpicker-focus-${this.kebabCase(focusProp)}`, focusValue as string);
          });
        } else {
          root.style.setProperty(`--preset-datepicker-monthpicker-${this.kebabCase(prop)}`, value as string);
        }
      });
    }

    // Year picker styles
    if (datepickerStyles.yearpicker) {
      Object.entries(datepickerStyles.yearpicker).forEach(([prop, value]) => {
        if (prop === 'focus') {
          Object.entries(value as any).forEach(([focusProp, focusValue]) => {
            root.style.setProperty(`--preset-datepicker-yearpicker-focus-${this.kebabCase(focusProp)}`, focusValue as string);
          });
        } else {
          root.style.setProperty(`--preset-datepicker-yearpicker-${this.kebabCase(prop)}`, value as string);
        }
      });
    }

    // Touch UI styles
    if (datepickerStyles.touchUi) {
      Object.entries(datepickerStyles.touchUi).forEach(([prop, value]) => {
        root.style.setProperty(`--preset-datepicker-touch-ui-${this.kebabCase(prop)}`, value as string);
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