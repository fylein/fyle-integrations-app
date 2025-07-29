import { Component } from '@angular/core';
import { ThemeService } from 'src/core/services/theme.service';
import { SupportedBrand } from 'src/themes';

@Component({
  selector: 'app-theme-demo',
  template: `
    <div class="theme-demo">
      <h2>Theme Switching Demo</h2>

      <div class="theme-controls">
        <h3>Current Theme: {{ getCurrentBrand() }} - {{ getCurrentBrandPreset().displayName }}</h3>

        <div class="button-group">
          <button
            class="p-button p-button-primary"
            [class.active]="isBrandActive('fyle')"
            (click)="switchTheme('fyle')">
            Switch to Fyle Theme
          </button>

          <button
            class="p-button p-button-secondary"
            [class.active]="isBrandActive('co')"
            (click)="switchTheme('co')">
            Switch to Co Theme
          </button>

          <button
            class="p-button p-button-outline"
            (click)="toggleTheme()">
            Toggle Theme
          </button>
        </div>
      </div>

      <div class="component-showcase">
        <h3>PrimeNG Components Preview</h3>

        <!-- Button Examples -->
        <div class="showcase-section">
          <h4>Button Variants</h4>
          <div class="button-showcase">
            <button class="p-button p-button-primary">Primary Button</button>
            <button class="p-button secondary-sm">Secondary Small</button>
            <button class="p-button outline-sm">Outline Small</button>
            <button class="p-button primary-outline">Primary Outline</button>
            <button class="p-button danger-outline">Danger Outline</button>
            <span class="btn-text-primary">Text Button</span>
          </div>

          <div class="button-info">
            <h5>Current Brand Button Colors:</h5>
            <p><strong>Primary BG:</strong> {{ getCurrentBrandPreset().components.button.primary.base.background }}</p>
            <p><strong>Primary Hover:</strong> {{ getCurrentBrandPreset().components.button.primary.hover.background }}</p>
            <p><strong>Secondary BG:</strong> {{ getCurrentBrandPreset().components.button.secondary.base.background }}</p>
          </div>
        </div>

        <!-- Input Examples -->
        <div class="showcase-section">
          <h4>Input Fields</h4>
          <input type="text" class="p-inputtext" placeholder="Sample input text" />
        </div>

        <!-- CSS Variables Demo -->
        <div class="showcase-section">
          <h4>Applied CSS Variables (Dynamic)</h4>
          <div class="css-vars-demo">
            <button (click)="showCSSVariables()" class="p-button outline-sm">Show CSS Variables</button>
            <div class="css-vars-list" *ngIf="showVars">
              <p><strong>--preset-primary:</strong> <span [style.background-color]="getComputedCSSVar('--preset-primary')" class="color-box-inline">{{ getComputedCSSVar('--preset-primary') }}</span></p>
              <p><strong>--preset-btn-primary-background:</strong> <span [style.background-color]="getComputedCSSVar('--preset-btn-primary-background')" class="color-box-inline">{{ getComputedCSSVar('--preset-btn-primary-background') }}</span></p>
              <p><strong>--preset-btn-primary-hover-background:</strong> <span [style.background-color]="getComputedCSSVar('--preset-btn-primary-hover-background')" class="color-box-inline">{{ getComputedCSSVar('--preset-btn-primary-hover-background') }}</span></p>
            </div>
          </div>
        </div>

        <!-- Toast Test -->
        <div class="showcase-section">
          <h4>Toast Notifications</h4>
          <button class="p-button">Show Success Toast</button>
          <button class="p-button">Show Error Toast</button>
        </div>
      </div>

      <div class="theme-info">
        <h3>Current Brand Colors</h3>
        <div class="color-details">
          <p><strong>Primary:</strong> {{ getCurrentBrandColors().primary }}</p>
          <p><strong>Success:</strong> {{ getCurrentBrandColors().success }}</p>
          <p><strong>Warning:</strong> {{ getCurrentBrandColors().warning }}</p>
          <p><strong>Danger:</strong> {{ getCurrentBrandColors().danger }}</p>
        </div>
        <div class="color-preview">
          <div class="color-box" [style.background-color]="getCurrentBrandColors().primary">
            Primary
          </div>
          <div class="color-box" [style.background-color]="getCurrentBrandColors().success">
            Success
          </div>
          <div class="color-box" [style.background-color]="getCurrentBrandColors().warning">
            Warning
          </div>
          <div class="color-box" [style.background-color]="getCurrentBrandColors().danger">
            Danger
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .theme-controls {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 8px;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .button-group .p-button.active {
      box-shadow: 0 0 0 2px var(--primary-500, #007ad9);
    }

    .component-showcase {
      margin-bottom: 2rem;
    }

    .showcase-section {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--surface-50, #f9f9f9);
      border-radius: 6px;
    }

    .showcase-section h4 {
      margin-bottom: 1rem;
      color: var(--text-color, #333);
    }

    .button-showcase {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .button-showcase .p-button,
    .button-showcase .btn-text-primary {
      margin: 0;
    }

    .button-info {
      background: var(--surface-200, #e5e5e5);
      padding: 1rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
    }

    .button-info h5 {
      margin: 0 0 0.5rem 0;
      font-family: inherit;
    }

    .button-info p {
      margin: 0.25rem 0;
    }

    .showcase-section .p-inputtext {
      margin-right: 1rem;
      margin-bottom: 0.5rem;
    }

    .theme-info {
      padding: 1rem;
      background: var(--surface-100, #f0f0f0);
      border-radius: 6px;
    }

    .color-details {
      margin-bottom: 1rem;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .color-details p {
      margin: 0.25rem 0;
    }

    .color-preview {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .color-box {
      padding: 1rem;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      text-align: center;
      min-width: 100px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }

    .color-box-inline {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 2px;
      margin-left: 8px;
      vertical-align: middle;
      border: 1px solid #ccc;
    }

    .css-vars-demo {
      margin-top: 1rem;
    }

    .css-vars-list {
      margin-top: 1rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .css-vars-list p {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
    }
  `]
})
export class ThemeDemoComponent {
  showVars = false;

  constructor(private themeService: ThemeService) {}

  switchTheme(brand: SupportedBrand): void {
    this.themeService.switchToBrand(brand);
  }

  toggleTheme(): void {
    this.themeService.toggleBrand();
  }

  getCurrentBrand(): SupportedBrand {
    return this.themeService.getCurrentBrand();
  }

  getCurrentBrandPreset() {
    return this.themeService.getCurrentBrandPreset();
  }

  getCurrentBrandColors() {
    return this.themeService.getCurrentBrandColors();
  }

  isBrandActive(brand: SupportedBrand): boolean {
    return this.themeService.isBrandActive(brand);
  }

  showCSSVariables(): void {
    this.showVars = !this.showVars;
  }

  getComputedCSSVar(varName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(varName) || 'Not set';
  }
}