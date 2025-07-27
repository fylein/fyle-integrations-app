# 🎨 Co CSS Variables System - Usage Guide

## ✅ **Co Brand CSS Variables Mapping**

The Co brand now has its own comprehensive CSS variables mapping system, organized by category for easy access to all CSS custom properties defined in `src/assets/themes/co/c1dl.scss`.

## 📁 **New File Structure**

```
src/themes/
├── fyle-css-vars.ts    ← Fyle brand CSS variables
├── co-css-vars.ts      ← 🆕 Co brand CSS variables  
├── fyle-preset.ts      ← Uses FyleCSSVars
├── co-preset.ts        ← ✅ Updated to use CoCSSVars
├── theme.types.ts      ← Type definitions
└── index.ts            ← ✅ Exports both CSS variable systems
```

## 🎯 **How to Use Co CSS Variables**

### **1. Import the Co CSS Variables**

```typescript
import { CoCSSVars } from 'src/themes/co-css-vars';

// or via index
import { CoCSSVars, getBrandCSSVars } from 'src/themes';

// or get dynamically
const coVars = getBrandCSSVars('co');
```

### **2. Easy Category-Based Access**

```typescript
// ✅ BACKGROUNDS - Co brand color palette
CoCSSVars.backgrounds.brandPrimary     // 'var(--bg-brand-primary)' #0070a8
CoCSSVars.backgrounds.white            // 'var(--bg-white)' #ffffff
CoCSSVars.backgrounds.tertiary         // 'var(--bg-tertiary)' #f7f7f7
CoCSSVars.backgrounds.danger           // 'var(--bg-danger)' #e60012

// ✅ TEXT COLORS - Co brand text colors  
CoCSSVars.text.brandPrimary           // 'var(--text-brand-primary)' #0070a8
CoCSSVars.text.primary                // 'var(--text-primary)' #1a1a1a
CoCSSVars.text.danger                 // 'var(--text-danger)' #e60012
CoCSSVars.text.white                  // 'var(--text-white)' #ffffff

// ✅ BORDERS - Co brand border colors
CoCSSVars.borders.brand               // 'var(--border-brand)' #0070a8
CoCSSVars.borders.secondary           // 'var(--border-secondary)' #e6e6e6
CoCSSVars.borders.danger              // 'var(--border-danger)' #e60012

// ✅ BUTTONS - Co-specific button styles
CoCSSVars.buttons.primaryBg           // 'var(--btn-primary-bg)'
CoCSSVars.buttons.secondaryTextColor  // 'var(--btn-secondary-text-color)'
CoCSSVars.buttons.tertiaryHoverBg     // 'var(--btn-tertiary-hover-bg)'

// ✅ SPACING - Consistent spacing values
CoCSSVars.spacing[16]                 // 'var(--spacing-16)' 16px
CoCSSVars.spacing[8]                  // 'var(--spacing-8)' 8px
```

## 🔥 **Co vs Fyle Differences**

### **Brand Colors:**
```typescript
// Fyle (Pink/Red brand)
FyleCSSVars.backgrounds.brandPrimary  // 'var(--bg-brand-primary)' #ff3366

// Co (Blue brand)  
CoCSSVars.backgrounds.brandPrimary    // 'var(--bg-brand-primary)' #0070a8
```

### **Button System:**
```typescript
// Co has more button variants than Fyle
CoCSSVars.buttons.primaryBg           // Standard primary
CoCSSVars.buttons.secondaryBg         // Secondary (dark)
CoCSSVars.buttons.outlinePrimaryBg    // Primary outline
CoCSSVars.buttons.outlineSecondaryBg  // Secondary outline
CoCSSVars.buttons.dangerBg            // ✅ Co has dedicated danger buttons
CoCSSVars.buttons.dangerOutlineBg     // ✅ Co has danger outline buttons

// Text button variations
CoCSSVars.buttons.tertiaryTextColor          // Brand-colored text button
CoCSSVars.buttons.tertiaryNeutralTextColor   // ✅ Co has neutral text buttons
CoCSSVars.buttons.tertiaryDangerTextColor    // ✅ Co has danger text buttons
```

## 🏗️ **Available Categories**

| Category | Properties | Co-Specific Features |
|----------|------------|---------------------|
| **backgrounds** | 25+ background colors | More granular light/lighter variants |
| **text** | 15+ text colors | `brandHover`, `brandPressed`, `mutedLight` |
| **borders** | 20+ border colors | More contextual border variations |
| **buttons** | 50+ button styles | **Danger buttons**, **Neutral variants**, **Pressed states** |
| **spacing** | 0-72px values | Same as Fyle |
| **borderRadius** | none to full | Co uses more 12px radius values |
| **icons** | All icon colors | Co-specific icon variations |
| **links** | Link states | `hover`, `pressed`, `visited` states |

## 🔥 **Real Example: Co Button Definition**

### **Before (Hardcoded Values):**
```typescript
primary: {
  base: {
    color: '#FFFFFF',           // ❌ Hardcoded
    background: '#0070a8',      // ❌ Hardcoded  
    paddingX: '16px',           // ❌ Hardcoded
  }
}
```

### **After (Co CSS Variables):**
```typescript
primary: {
  base: {
    color: CoCSSVars.buttons.primaryTextColor,      // ✅ 'var(--btn-primary-text-color)'
    background: CoCSSVars.buttons.primaryBg,        // ✅ 'var(--btn-primary-bg)'
    paddingX: CoCSSVars.spacing[16],                // ✅ 'var(--spacing-16)'
  }
}
```

## 🚀 **Co-Specific Features**

### **1. Enhanced Button System**
Co has more sophisticated button states than Fyle:

```typescript
// ✅ Co has pressed states
CoCSSVars.buttons.primaryPressedBg          // Active press state
CoCSSVars.buttons.outlinePrimaryPressedBg   // Pressed outline state

// ✅ Co has dedicated danger button system
CoCSSVars.buttons.dangerBg                  // Solid danger button
CoCSSVars.buttons.dangerOutlineBg           // Outline danger button  
CoCSSVars.buttons.tertiaryDangerTextColor   // Text danger button

// ✅ Co has neutral text buttons
CoCSSVars.buttons.tertiaryNeutralTextColor  // Neutral colored text buttons
```

### **2. More Granular Color System**
```typescript
// ✅ Co has brand interaction states
CoCSSVars.text.brandHover                   // Hover state color
CoCSSVars.text.brandPressed                 // Pressed state color
CoCSSVars.borders.brandHover                // Border hover state
CoCSSVars.borders.brandPressed              // Border pressed state

// ✅ Co has more background variations
CoCSSVars.backgrounds.infoLighter           // Lighter than light
CoCSSVars.backgrounds.infoLightest          // Lightest variation
```

### **3. Enhanced Border Radius**
```typescript
// Co uses consistent 12px radius for many elements
CoCSSVars.borderRadius.md                   // 12px
CoCSSVars.borderRadius.lg                   // 12px  
CoCSSVars.borderRadius.xl                   // 12px
CoCSSVars.borderRadius['2xl']               // 12px
```

## 💡 **Dynamic Brand Selection**

```typescript
// Get CSS variables for any brand dynamically
function getButtonStyle(brand: 'fyle' | 'co') {
  const cssVars = getBrandCSSVars(brand);
  
  return {
    color: cssVars.buttons.primaryTextColor,
    background: cssVars.buttons.primaryBg,
    padding: `${cssVars.spacing[10]} ${cssVars.spacing[16]}`
  };
}

// Usage
const fyleButtonStyle = getButtonStyle('fyle');
const coButtonStyle = getButtonStyle('co');
```

## 🎯 **Migration Benefits**

| **Old Approach** | **New Co CSS Variables** |
|------------------|--------------------------|
| `color: '#0070a8'` | `color: CoCSSVars.text.brandPrimary` |
| `background: '#1a1a1a'` | `background: CoCSSVars.backgrounds.primary` |
| `borderColor: '#e6e6e6'` | `borderColor: CoCSSVars.borders.secondary` |
| `padding: '16px 12px'` | `padding: CoCSSVars.spacing[16] + ' ' + CoCSSVars.spacing[12]` |

**Result: Both Fyle and Co now have direct connections to their respective design system sources!** 🎉

## 🛠️ **Usage in Components**

```typescript
import { CoCSSVars } from 'src/themes';

// ✅ For Co-specific components
const coButtonStyle = {
  backgroundColor: CoCSSVars.buttons.primaryBg,
  color: CoCSSVars.buttons.primaryTextColor,
  border: `1px solid ${CoCSSVars.borders.brand}`,
  borderRadius: CoCSSVars.borderRadius.md,
  padding: `${CoCSSVars.spacing[10]} ${CoCSSVars.spacing[16]}`
};

// ✅ For brand-agnostic components
function createButton(brand: 'fyle' | 'co') {
  const vars = getBrandCSSVars(brand);
  
  return {
    backgroundColor: vars.buttons.primaryBg,
    color: vars.buttons.primaryTextColor,
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`
  };
}
```

**Your Co preset is now directly connected to the Co design system source!** 🎯 