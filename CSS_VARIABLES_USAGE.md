# 🎨 CSS Variables System - Usage Guide

## ✅ **Problem Solved: Direct CSS Variable References**

Instead of hardcoding hex values, the preset now uses **direct CSS custom property references** from `fdl.scss`, ensuring perfect synchronization with your design system.

## 📁 **New File Structure**

```
src/themes/
├── fyle-css-vars.ts    ← 🆕 All CSS variables organized by category  
├── fyle-preset.ts      ← ✅ Updated to use CSS variables
├── co-preset.ts        ← ✅ Updated to use CSS variables
├── theme.types.ts      ← ✅ Type definitions
└── index.ts            ← ✅ Exports and utilities
```

## 🎯 **How to Use CSS Variables**

### **1. Import the Organized CSS Variables**

```typescript
import { FyleCSSVars } from 'src/themes/fyle-css-vars';

// or via index
import { FyleCSSVars, CSSVars } from 'src/themes';
```

### **2. Easy Category-Based Access**

```typescript
// ✅ BACKGROUNDS - Pick from 25+ background options
FyleCSSVars.backgrounds.brandPrimary     // 'var(--bg-brand-primary)'
FyleCSSVars.backgrounds.white            // 'var(--bg-white)'  
FyleCSSVars.backgrounds.tertiary         // 'var(--bg-tertiary)'
FyleCSSVars.backgrounds.danger           // 'var(--bg-danger)'

// ✅ TEXT COLORS - All text color variants
FyleCSSVars.text.brandPrimary           // 'var(--text-brand-primary)'
FyleCSSVars.text.secondary              // 'var(--text-secondary)'
FyleCSSVars.text.danger                 // 'var(--text-danger)'
FyleCSSVars.text.white                  // 'var(--text-white)'

// ✅ BORDERS - Complete border color system  
FyleCSSVars.borders.brand               // 'var(--border-brand)'
FyleCSSVars.borders.secondary           // 'var(--border-secondary)'
FyleCSSVars.borders.danger              // 'var(--border-danger)'

// ✅ BUTTONS - Pre-defined button styles
FyleCSSVars.buttons.primaryBg           // 'var(--btn-primary-bg)'
FyleCSSVars.buttons.secondaryTextColor  // 'var(--btn-secondary-text-color)'
FyleCSSVars.buttons.ctaShadow           // 'var(--btn-cta-shadow)'

// ✅ SPACING - Consistent spacing values
FyleCSSVars.spacing[16]                 // 'var(--spacing-16)'
FyleCSSVars.spacing[8]                  // 'var(--spacing-8)'

// ✅ SHADOWS & RADIUS
FyleCSSVars.shadows.dropdown            // 'var(--dropdown-shadow)'
FyleCSSVars.borderRadius['2xs']         // 'var(--border-radius-2xs)'
```

## 🔥 **Real Example: Button Definition**

### **Before (Hardcoded Values):**
```typescript
primary: {
  base: {
    color: '#FFFFFF',           // ❌ Hardcoded
    background: '#FF3366',      // ❌ Hardcoded  
    paddingX: '16px',           // ❌ Hardcoded
    boxShadow: 'none'           // ❌ Hardcoded
  }
}
```

### **After (CSS Variables):**
```typescript
primary: {
  base: {
    color: FyleCSSVars.buttons.primaryTextColor,      // ✅ 'var(--btn-primary-text-color)'
    background: FyleCSSVars.buttons.primaryBg,        // ✅ 'var(--btn-primary-bg)'
    paddingX: FyleCSSVars.spacing[16],                // ✅ 'var(--spacing-16)'
    boxShadow: FyleCSSVars.shadows.btnCta             // ✅ 'var(--btn-cta-shadow)'
  }
}
```

## 🏗️ **Available Categories**

| Category | Properties | Example Usage |
|----------|------------|---------------|
| **backgrounds** | 25+ background colors | `FyleCSSVars.backgrounds.brandPrimary` |
| **text** | 15+ text colors | `FyleCSSVars.text.secondary` |
| **borders** | 20+ border colors | `FyleCSSVars.borders.danger` |
| **buttons** | All button styles | `FyleCSSVars.buttons.primaryHoverBg` |
| **gradients** | Brand gradients | `FyleCSSVars.gradients.vibrantLgStart` |
| **spacing** | 0, 2, 4, 6...72 | `FyleCSSVars.spacing[24]` |
| **borderRadius** | none, 3xs...2xl, full | `FyleCSSVars.borderRadius.md` |
| **shadows** | dropdown, filter, cta | `FyleCSSVars.shadows.dropdown` |
| **icons** | All icon colors | `FyleCSSVars.icons.brandPrimary` |

## 💡 **Benefits of This System**

### **✅ Always In Sync**
- **Direct CSS variable references** ensure preset stays synchronized
- **No manual mapping** reduces errors and maintenance
- **Single source of truth** from `fdl.scss`

### **✅ Developer Experience**  
- **Organized by purpose**: Find colors by background, text, border, etc.
- **Autocomplete friendly**: TypeScript IntelliSense shows all options
- **Self-documenting**: Variable names explain their purpose

### **✅ Easy Maintenance**
- **Change once, update everywhere**: Modify `fdl.scss` → preset updates automatically
- **No hex hunting**: Find variables by category instead of remembering colors
- **Future-proof**: New CSS variables automatically available

## 🎯 **Migration Summary**

| **Old Approach** | **New Approach** |
|------------------|------------------|
| `color: '#FF3366'` | `color: FyleCSSVars.text.brandPrimary` |
| `background: '#F5F5F5'` | `background: FyleCSSVars.backgrounds.tertiary` |
| `borderColor: '#DFDFE2'` | `borderColor: FyleCSSVars.borders.secondary` |
| `boxShadow: '0 2px 4px...'` | `boxShadow: FyleCSSVars.shadows.btnCta` |

## 🚀 **Next Steps**

1. **Test the presets**: Verify button colors switch correctly between brands
2. **Expand usage**: Apply this pattern to other components (inputs, dropdowns, etc.)
3. **Create Co CSS vars**: If Co brand needs different variable structure
4. **Document components**: Add usage examples for each component type

**Your preset is now directly connected to the design system source of truth!** 🎉 