# Design Token Mapping: Tailwind → PrimeNG

## Overview
This document provides the mapping strategy for converting existing Tailwind CSS custom properties to PrimeNG design tokens, maintaining brand consistency while leveraging the new theming system.

## Mapping Strategy

### Primitive Tokens (Color Palette)

#### Fyle Brand Colors
```typescript
// Current Tailwind Variables → PrimeNG Primitive Tokens
const fylePrimitiveTokens = {
  fyle: {
    primary: '#FF3366',      // --mandatory-field-color
    primaryLight: '#FFC2D6', // --cta-disabled
    primaryDark: '#fe5196',  // --gradient-vibrant-lg-end
    
    // Neutral Colors
    white: '#FFFFFF',        // --white
    gray50: '#FAFCFF',      // --configuration-bg
    gray100: '#F5F5F5',     // --disabled-bg-color
    gray200: '#ECECEE',     // --separator
    gray300: '#DFDFE2',     // --box-color
    gray400: '#A9ACBC',     // --placeholder
    gray500: '#5A5D72',     // --faded-text-color
    gray600: '#414562',     // --sub-text-color
    gray900: '#161528',     // --normal-text-color
    
    // Semantic Colors
    success: '#24A148',      // --success-toast
    danger: '#DA1E28',       // --alert-toast
    info: '#5C98E5',         // --info
    warning: '#E1AF05',      // --icon-warning
    
    // Special Colors
    hyperlink: '#0062FF',    // --hyperlink-color
    pink: '#D23669'          // --pink
  }
};
```

#### Co Brand Colors
```typescript
const coPrimitiveTokens = {
  co: {
    primary: '#0070a8',      // --mandatory-field-color
    primaryLight: '#0070A8', // --cta-disabled
    primaryDark: '#0070A8',  // --gradient-vibrant-lg-end
    
    // Neutral Colors (mostly same as Fyle)
    white: '#FFFFFF',
    gray50: '#f4f4f4',      // --bg-tertiary-lighter
    gray100: '#F5F5F5',
    gray200: '#ECECEE',
    gray300: '#DFDFE2',
    gray400: '#A9ACBC',
    gray500: '#6e6e6e',     // --faded-text-color (different from Fyle)
    gray600: '#414562',
    gray900: '#161528',
    
    // Semantic Colors (mostly same as Fyle)
    success: '#24A148',
    danger: '#DA1E28',
    info: '#5C98E5',
    warning: '#E1AF05',
    
    // Special Colors
    hyperlink: '#0062FF',
    pink: '#0070A8'         // --pink (different from Fyle)
  }
};
```

### Semantic Tokens

#### Core Semantic Mappings
```typescript
const semanticTokens = {
  primary: {
    color: '{brand.primary}',           // --mandatory-field-color
    contrastColor: '#FFFFFF',
    hoverColor: '{brand.primaryDark}',
    activeColor: '{brand.primaryDark}',
    50: '{gray.50}',
    100: '{gray.100}',
    // ... continue with full palette
    500: '{brand.primary}',
    900: '{brand.primaryDark}'
  },
  
  text: {
    color: '{gray.900}',               // --normal-text-color
    secondaryColor: '{gray.600}',      // --sub-text-color
    mutedColor: '{gray.500}',          // --faded-text-color
    placeholderColor: '{gray.400}',    // --placeholder
  },
  
  background: {
    surface: '{white}',                // Base background
    alt: '{gray.50}',                  // --configuration-bg
    emphasis: '{gray.100}',            // --disabled-bg-color
  },
  
  border: {
    color: '{gray.300}',               // --box-color
    subtle: '{gray.200}',              // --separator
  }
};
```

### Component Tokens Mapping

#### Button Component Tokens
```typescript
const buttonTokens = {
  button: {
    // Primary Button
    root: {
      background: '{primary.color}',              // --btn-primary-bg
      borderColor: '{primary.color}',
      color: '{primary.contrastColor}',           // --btn-primary-text-color
      borderRadius: '4px',
      paddingX: '1rem',                           // 16px
      paddingY: '0.625rem',                       // 10px
      fontSize: '0.875rem',                       // 14px
      fontWeight: '400'
    },
    
    colorScheme: {
      light: {
        root: {
          hoverBackground: '{primary.hoverColor}', // --btn-primary-hover-bg
          hoverBorderColor: '{primary.hoverColor}',
          hoverColor: '{primary.contrastColor}',   // --btn-primary-hover-text-color
          
          disabledBackground: '{primary.50}',      // --btn-primary-disable-bg
          disabledBorderColor: '{primary.50}',
          disabledColor: '{text.mutedColor}'       // --btn-primary-disable-text-color
        },
        
        // Secondary variant
        secondary: {
          background: '{background.alt}',          // --btn-secondary-bg
          borderColor: '{border.color}',
          color: '{text.color}',                   // --btn-secondary-text-color
          
          hoverBackground: '{background.emphasis}', // --btn-secondary-hover-bg
          hoverBorderColor: '{border.color}',
          hoverColor: '{text.color}'               // --btn-secondary-hover-text-color
        },
        
        // Outline variant
        outlined: {
          background: 'transparent',               // --btn-outline-primary-bg
          borderColor: '{primary.color}',          // --btn-outline-primary-border-color
          color: '{primary.color}',                // --btn-outline-primary-text-color
          
          hoverBackground: '{primary.color}',      // --btn-outline-primary-hover-bg
          hoverBorderColor: '{primary.color}',     // --btn-outline-primary-hover-border-color
          hoverColor: '{primary.contrastColor}'    // --btn-outline-primary-hover-text-color
        }
      }
    }
  }
};
```

#### Form Input Component Tokens
```typescript
const inputTokens = {
  inputtext: {
    root: {
      background: '{background.surface}',         // --input-default-bg
      borderColor: '{border.color}',              // --input-default-border
      color: '{text.color}',                      // --input-default-text
      borderRadius: '4px',
      padding: '0.5rem 0.75rem',                  // 8px 12px
      fontSize: '0.875rem',                       // 14px
      
      placeholderColor: '{text.placeholderColor}', // --input-default-placeholder-text
      
      focusedBorderColor: '{primary.color}',      // --input-focused-border
      focusedBackground: '{background.surface}',   // --input-focused-bg
      
      disabledBackground: '{background.emphasis}', // --input-disabled-bg
      disabledBorderColor: '{border.subtle}',     // --input-disabled-border
      disabledColor: '{text.mutedColor}',         // --input-disabled-text
      
      errorBorderColor: '{semantic.danger}',      // --input-error-border
      errorBackground: '{background.surface}',     // --input-error-bg
      errorColor: '{text.color}'                  // --input-error-text
    }
  }
};
```

#### Dropdown Component Tokens
```typescript
const dropdownTokens = {
  dropdown: {
    root: {
      background: '{background.surface}',         // --select-default-bg
      borderColor: '{border.color}',              // --select-default-border
      color: '{text.color}',                      // --select-default-text
      borderRadius: '4px',
      padding: '0.5rem 0.75rem',                  // 8px 12px
      
      focusedBorderColor: '{primary.color}',      // --select-focused-border
      
      disabledBackground: '{background.emphasis}', // --select-disabled-bg
      disabledBorderColor: '{border.subtle}',     // --select-disabled-border
      disabledColor: '{text.mutedColor}'          // --select-disabled-text
    },
    
    overlay: {
      background: '{background.surface}',
      borderColor: '{border.color}',
      borderRadius: '0.5rem',                     // 8px
      shadow: '0px 2px 10px rgba(44, 48, 78, 0.1)'
    },
    
    item: {
      focusBackground: '{background.alt}',        // --dd-menu-item-hover-bg
      color: '{text.color}',                      // --dd-menu-item-default-text-color
      focusColor: '{text.color}',                 // --dd-menu-item-hover-text-color
      padding: '0.5rem 0.75rem',                  // 8px 12px
      borderRadius: '4px'
    }
  }
};
```

#### Toast Component Tokens
```typescript
const toastTokens = {
  toast: {
    root: {
      borderRadius: '4px',
      padding: '1rem',
      fontSize: '0.875rem'
    },
    
    success: {
      background: '{semantic.success}',           // --toast-success-bg
      borderColor: '{semantic.success}',
      color: '{background.surface}',              // --toast-text-color
      iconColor: '{background.surface}'           // --toast-success-icon-color
    },
    
    error: {
      background: '{semantic.danger}',            // --toast-error-bg
      borderColor: '{semantic.danger}',
      color: '{background.surface}',
      iconColor: '{background.surface}'           // --toast-error-icon-color
    },
    
    info: {
      background: '{semantic.info}',              // --toast-info-bg
      borderColor: '{semantic.info}',
      color: '{background.surface}',
      iconColor: '{background.surface}'           // --toast-info-icon-color
    }
  }
};
```

### Typography Tokens

#### Font Family Mapping
```typescript
const typographyTokens = {
  fontFamily: {
    primary: 'var(--font-primary)',              // Brand-specific fonts
    // Fyle: "aktiv-grotesk", sans-serif
    // Co: "Optimist"
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem'     // 24px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.7'
  }
};
```

### Spacing and Layout Tokens

#### Spacing System
```typescript
const spacingTokens = {
  spacing: {
    '0': '0px',
    '1': '2px',
    '2': '4px',
    '3': '6px',
    '4': '8px',
    '5': '10px',
    '6': '12px',
    '7': '14px',
    '8': '16px',
    '9': '18px',
    '10': '20px',
    '12': '24px',
    '16': '32px',
    '20': '40px',
    '24': '48px',
    '32': '64px'
  },
  
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '50%'
  },
  
  borderWidth: {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px'
  }
};
```

## Brand-Specific Preset Structure

### Fyle Preset
```typescript
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const FylePreset = definePreset(Aura, {
  primitive: fylePrimitiveTokens,
  semantic: {
    ...semanticTokens,
    primary: {
      ...semanticTokens.primary,
      color: '{fyle.primary}'
    }
  },
  components: {
    ...buttonTokens,
    ...inputTokens,
    ...dropdownTokens,
    ...toastTokens
  },
  css: ({ dt }) => `
    .p-component {
      font-family: ${dt('fontFamily.primary')};
    }
    
    /* Brand-specific icon overrides */
    .pi-times {
      content: url('./assets/icons/cross-medium.svg');
    }
    
    .pi-search {
      content: url('./assets/icons/search-medium.svg');
    }
  `
});
```

### Co Preset
```typescript
export const CoPreset = definePreset(Aura, {
  primitive: coPrimitiveTokens,
  semantic: {
    ...semanticTokens,
    primary: {
      ...semanticTokens.primary,
      color: '{co.primary}'
    }
  },
  components: {
    ...buttonTokens,
    ...inputTokens,
    ...dropdownTokens,
    ...toastTokens
  },
  css: ({ dt }) => `
    .p-component {
      font-family: ${dt('fontFamily.primary')};
    }
    
    /* Brand-specific icon overrides */
    .pi-times {
      content: url('./assets/icons/co/grv-close-medium.svg');
    }
    
    .pi-search {
      content: url('./assets/icons/co/grv-search-medium.svg');
    }
  `
});
```

## CSS Layer Integration Strategy

### Proper Layer Ordering
```scss
@layer reset, primeng, tailwind-components, tailwind-utilities, brand-overrides;

// Reset layer for base styles
@layer reset {
  /* CSS reset styles */
}

// PrimeNG layer for component styles
@layer primeng {
  /* PrimeNG design token styles will be injected here */
}

// Tailwind layers
@layer tailwind-components {
  /* Tailwind component utilities */
}

@layer tailwind-utilities {
  /* Tailwind utility classes */
}

// Brand-specific overrides
@layer brand-overrides {
  /* Icon overrides and other brand-specific styles */
}
```

## Migration Checklist

### High Priority Mappings ✅
- [ ] Primary brand colors (`--mandatory-field-color`)
- [ ] Text colors (primary, secondary, muted)
- [ ] Background colors (surface, alt, emphasis)
- [ ] Button variants (primary, secondary, outline)
- [ ] Form input states (default, focused, disabled, error)
- [ ] Typography (font family, sizes, weights)

### Medium Priority Mappings
- [ ] Dropdown and select components
- [ ] Toast notification variants
- [ ] Border and spacing tokens
- [ ] Icon system integration
- [ ] Data table styling
- [ ] Calendar component tokens

### Low Priority Mappings
- [ ] Progress spinners
- [ ] Skeleton loaders
- [ ] Tooltip styling
- [ ] Advanced component states

## Implementation Notes

### Token Naming Strategy
- **Preserve Semantics**: Maintain meaningful token names
- **Brand Agnostic**: Use semantic names that work for both brands
- **Consistent Hierarchy**: Follow PrimeNG's three-tier system (primitive → semantic → component)

### Compatibility Considerations
- **CSS Custom Properties**: Maintain backward compatibility with existing Tailwind variables
- **Dynamic Switching**: Ensure theme switching continues to work seamlessly
- **Performance**: Minimize CSS bundle size impact

### Testing Strategy
- **Visual Regression**: Compare before/after screenshots
- **Cross-Brand**: Test theme switching functionality
- **Component Coverage**: Verify all PrimeNG components render correctly
- **Integration Tests**: Ensure all app flows work correctly

---

**Status**: Comprehensive mapping strategy defined for Tailwind → PrimeNG migration.
**Next Step**: Implement brand preset files and begin component migration. 