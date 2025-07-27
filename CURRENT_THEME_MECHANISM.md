# Current Theme Switching Mechanism

## Overview
The Fyle Integrations App uses a sophisticated theming system that supports multiple brands (Fyle and Co) with dynamic switching capabilities.

## Architecture

### 1. Brand Configuration System

#### Main Configuration (`src/app/branding/branding-config.ts`)
```typescript
export const brandingConfig: BrandingConfiguration = config as BrandingConfiguration;

const featureConfigs: FeatureConfiguration = {
    fyle: fyleFeatureConfig,
    co: c1FeatureConfig
};

// Dynamic brand selection based on brandingConfig.brandId
export const brandingFeatureConfig = featureConfigs[brandingConfig.brandId];
```

#### Brand-Specific Configurations
- **Fyle Brand**: `src/app/branding/fyle/branding-config.ts`
- **Co Brand**: `src/app/branding/c1/branding-config.ts`

Each brand configuration includes:
- Feature flags and capabilities
- KB article URLs
- Demo video links
- Style configurations

### 2. CSS Theme Implementation

#### Theme Structure (`src/assets/themes/theme.scss`)
```scss
@layer base {
    [data-theme='fyle'] {
        --mandatory-field-color: #FF3366;
        --font-primary: "aktiv-grotesk", sans-serif;
        --gradient-vibrant-lg-start: #ff3366;
        --gradient-vibrant-lg-end: #fe5196;
        // ... 30+ brand-specific variables
    }
    
    [data-theme='co'] {
        --mandatory-field-color: #0070a8;
        --font-primary: "Optimist";
        --gradient-vibrant-lg-start: #ff3366;
        --gradient-vibrant-lg-end: #0070A8;
        // ... 30+ brand-specific variables
    }
}
```

#### Theme Variables by Category

**Core Colors:**
- `--mandatory-field-color`: Primary brand color (Fyle: #FF3366, Co: #0070a8)
- `--white`: Base white color
- `--normal-text-color`: Primary text color
- `--sub-text-color`: Secondary text color

**Background Colors:**
- `--configuration-bg`: Page background
- `--disabled-bg-color`: Disabled element background
- `--info-section`: Information section background

**Semantic Colors:**
- `--success-toast`: Success notification color
- `--alert-toast`: Error notification color
- `--hyperlink-color`: Link color

**Typography:**
- `--font-primary`: Primary font family (Fyle: "aktiv-grotesk", Co: "Optimist")

### 3. Tailwind CSS Integration

#### Variable Mapping (`tailwind.config.js`)
The theme variables are seamlessly integrated with Tailwind CSS through custom properties:

```javascript
const customColors = {
  'mandatory-field-color': 'var(--mandatory-field-color)',
  'normal-text-color': 'var(--normal-text-color)',
  'sub-text-color': 'var(--sub-text-color)',
  // ... 500+ mapped variables
};

const componentVariables = {
  'btn-primary-bg': 'var(--btn-primary-bg)',
  'btn-primary-text-color': 'var(--btn-primary-text-color)',
  // ... component-specific variables
};
```

#### Component Token System
Comprehensive token system covering:
- **Buttons**: Primary, secondary, outline, danger variants
- **Forms**: Inputs, selects, checkboxes, radios
- **Data Display**: Tables, cards, lists
- **Feedback**: Toasts, alerts, tooltips
- **Navigation**: Tabs, breadcrumbs, menus

### 4. Icon System Integration

#### Brand-Specific Icon Overrides
```scss
[data-theme='fyle'] {
    .pi-times { content: url('./assets/icons/cross-medium.svg') !important; }
    .pi-search { content: url('./assets/icons/search-medium.svg') !important; }
    .p-checkbox .p-checkbox-box .p-icon { content: url('./assets/icons/check.svg') !important; }
}

[data-theme='co'] {
    .pi-times { content: url('./assets/icons/co/grv-close-medium.svg') !important; }
    .pi-search { content: url('./assets/icons/co/grv-search-medium.svg') !important; }
    .p-checkbox .p-checkbox-box .p-icon { content: url('./assets/icons/co/grv-checkmark-small.svg') !important; }
}
```

#### Asset Organization
```
src/assets/
├── icons/
│   ├── fyle-specific-icons.svg
│   └── co/
│       └── grv-prefixed-icons.svg
├── logos/
│   ├── fyle-logo.png
│   └── co-logo.png
└── themes/
    ├── theme.scss
    ├── fyle/
    │   └── fdl.scss
    └── co/
        └── c1dl.scss
```

### 5. Dynamic Theme Application

#### Theme Switching Logic
The theme is applied based on the build configuration and branding setup:

1. **Build Time**: Brand configuration is determined during build
2. **Runtime**: `data-theme` attribute is set on document root
3. **CSS Variables**: Automatically switch based on attribute selector

#### Brand Detection Flow
```typescript
// Simplified flow
1. Load brand configuration from config.json
2. Set brandingConfig.brandId ('fyle' or 'co')
3. Apply corresponding data-theme attribute
4. CSS variables automatically switch
5. Component styles update dynamically
```

### 6. Integration Points

#### Branding Service (`src/core/services/common/branding.service.ts`)
- Initializes branding configuration
- Manages theme switching logic
- Provides brand-specific configurations

#### Component Integration
Components access branding through:
```typescript
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

// Use brand-specific configuration
const brandName = brandingConfig.brandName;
const features = brandingFeatureConfig.featureFlags;
```

## Current Challenges for PrimeNG Migration

### CSS Specificity Issues
- Heavy use of `!important` for icon overrides
- Complex cascade requirements
- PrimeNG internal styles may conflict

### Brand Switching Complexity
- Two distinct brand identities
- Different font families
- Unique icon sets
- Varying color schemes

### Tailwind Integration
- Need to maintain existing token system
- CSS layers may conflict with PrimeNG layers
- Custom properties must align with design tokens

## Migration Considerations

### Compatibility Requirements
1. **Maintain Existing API**: Components should continue working without changes
2. **Brand Switching**: Theme switching must remain seamless
3. **Asset Management**: Icon and logo systems must be preserved
4. **Performance**: No degradation in loading or switching speed

### Integration Strategy
1. **CSS Layers**: Use proper layer ordering for cascade control
2. **Design Tokens**: Map existing variables to PrimeNG tokens
3. **Brand Presets**: Create Fyle and Co presets extending base themes
4. **Service Layer**: Enhance branding service for PrimeNG integration

### Success Criteria
- [ ] Identical visual appearance before/after migration
- [ ] Seamless brand switching functionality
- [ ] No breaking changes to component APIs
- [ ] Improved maintainability and consistency
- [ ] Reduced CSS bundle size
- [ ] Better design token organization

---

**Current Status**: Well-architected theming system ready for PrimeNG integration.
**Key Insight**: The existing CSS custom property system aligns well with PrimeNG's design token approach. 