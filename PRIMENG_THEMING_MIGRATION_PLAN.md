# PrimeNG Theming Migration Plan

## Overview
This document outlines the migration plan from the current custom SCSS-based PrimeNG styling to the new design token-based theming system introduced in PrimeNG v17+.

## Current State Analysis

### Current Implementation
- **Custom SCSS Overrides**: Extensive component styling in `src/styles.scss` (~800 lines of PrimeNG overrides)
- **Multi-Brand Support**: Fyle and Co brands with different themes via `data-theme` attributes
- **Tailwind Integration**: Custom Tailwind configuration with brand-specific tokens
- **Asset Management**: Brand-specific icons and assets in `assets/` folder
- **Theme Files**: Separate theme files in `assets/themes/` for different brands

### Current Challenges
- High maintenance overhead for PrimeNG component styling
- Potential conflicts with PrimeNG updates
- Inconsistent theming approach (mix of Tailwind + custom SCSS)
- Linter errors in current SCSS file due to syntax issues

## Migration Strategy

### Phase 1: Preparation & Setup (Week 1-2)

#### 1.1 Environment Setup
- [ ] Update PrimeNG to latest version (v20+)
- [ ] Install required theming dependencies:
  ```bash
  npm install @primeuix/themes
  ```
- [ ] Update Angular configuration to support new theming system

#### 1.2 Analysis & Documentation
- [ ] Audit all current PrimeNG component customizations
- [ ] Document brand-specific styling requirements
- [ ] Map current Tailwind tokens to PrimeNG design tokens
- [ ] Create component inventory with current styling requirements

#### 1.3 Backup & Version Control
- [ ] Document current theme switching mechanism

### Phase 2: Core Theming Setup (Week 2-3)

#### 2.1 Configure PrimeNG Theming
- [ ] Update `src/main.ts` or app configuration to include PrimeNG theming:
  ```typescript
  import { ApplicationConfig } from '@angular/core';
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
  import { providePrimeNG } from 'primeng/config';
  import Aura from '@primeuix/themes/aura';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
          preset: Aura,
          options: {
            prefix: 'fyle',
            darkModeSelector: '[data-theme="dark"]',
            cssLayer: {
              name: 'primeng',
              order: 'tailwind-base, primeng, tailwind-components, tailwind-utilities'
            }
          }
        }
      })
    ]
  };
  ```

#### 2.2 Create Brand-Specific Presets
- [ ] Create Fyle brand preset extending base preset:
  ```typescript
  // src/themes/fyle-preset.ts
  import { definePreset } from '@primeuix/themes';
  
  export const FylePreset = definePreset(Aura, {
    semantic: {
      primary: {
        50: '{emerald.50}',
        100: '{emerald.100}',
        // ... map to Fyle brand colors
      }
    },
    components: {
      button: {
        // Fyle-specific button styling
      }
    }
  });
  ```

- [ ] Create Co brand preset:
  ```typescript
  // src/themes/co-preset.ts
  export const CoPreset = definePreset(Aura, {
    // Co brand specific tokens
  });
  ```

#### 2.3 Dynamic Theme Switching Service
- [ ] Create theme switching service:
  ```typescript
  // src/core/services/theme.service.ts
  import { Injectable } from '@angular/core';
  import { usePreset } from '@primeuix/themes';
  
  @Injectable({ providedIn: 'root' })
  export class ThemeService {
    switchToBrand(brandId: string) {
      // Logic to switch between Fyle/Co presets
    }
  }
  ```

### Phase 3: Component Migration (Week 3-5)

#### 3.1 Create Migration Priority List
**High Priority (Core Components)**:
- [ ] Buttons (p-button)
- [ ] Form Controls (p-inputtext, p-dropdown, p-checkbox)  
- [ ] Dialogs (p-dialog)
- [ ] Toast notifications (p-toast)

**Medium Priority**:
- [ ] Data tables (p-datatable)
- [ ] Calendar (p-calendar)
- [ ] Multi-select (p-multiselect)
- [ ] Toggle switches (p-inputswitch)

**Low Priority**:
- [ ] Progress spinners
- [ ] Tooltips
- [ ] Miscellaneous components

#### 3.2 Component-by-Component Migration

For each component:
- [ ] Remove custom SCSS overrides from `src/styles.scss`
- [ ] Map existing styles to design tokens
- [ ] Test with both Fyle and Co brands
- [ ] Update component usage if needed
- [ ] Add scoped tokens where necessary using `[dt]` property

#### 3.3 Icon System Migration
- [ ] Evaluate PrimeIcons vs custom icon system
- [ ] Create icon mapping for brand-specific icons
- [ ] Update icon references in components
- [ ] Maintain backward compatibility during transition

### Phase 4: Tailwind Integration (Week 5-6)

#### 4.1 Tailwind Configuration Update
- [ ] Update `tailwind.config.js` to work with PrimeNG design tokens
- [ ] Create CSS custom properties bridge between PrimeNG tokens and Tailwind
- [ ] Remove conflicting Tailwind utilities

#### 4.2 CSS Architecture Cleanup
- [ ] Organize remaining custom styles
- [ ] Use CSS layers for proper cascade control:
  ```scss
  @layer base, primeng, components, utilities;
  ```
- [ ] Clean up unused CSS variables and classes

### Phase 5: Brand Integration (Week 6-7)

#### 5.1 Branding Configuration Updates
- [ ] Update `src/app/branding/` configuration files
- [ ] Integrate design tokens with existing branding system
- [ ] Ensure brand switching works with new theming system

#### 5.2 Asset Management
- [ ] Update asset paths in design tokens
- [ ] Ensure brand-specific assets load correctly
- [ ] Test favicon and logo switching

### Phase 7: Documentation & Cleanup (Week 8-9)

#### 7.1 Documentation Updates
- [ ] Create theming guide for developers
- [ ] Document brand customization process
- [ ] Update README with new theming approach

#### 7.2 Code Cleanup
- [ ] Remove commented-out styles in `src/styles.scss`

## Implementation Guidelines

### Design Token Naming Convention
```typescript
// Follow PrimeNG convention with brand prefix
{
  primitive: {
    fyle: {
      primary: '#00d4aa', // Fyle green
      // ... other brand colors
    },
    co: {
      primary: '#1976d2', // Co blue
      // ... other brand colors
    }
  },
  semantic: {
    primary: {
      color: '{fyle.primary}' // or {co.primary} based on active brand
    }
  }
}
```

### Component Token Structure
```typescript
// Example for button component
{
  components: {
    button: {
      root: {
        background: '{primary.color}',
        borderRadius: '{border.radius.md}',
        padding: '0.75rem 1rem'
      },
      colorScheme: {
        light: {
          root: {
            color: '{primary.contrast.color}'
          }
        },
        dark: {
          root: {
            color: '{primary.contrast.color}'
          }
        }
      }
    }
  }
}
```