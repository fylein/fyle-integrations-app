# Fyle Transloco Helper


Translation management made easy with auto-complete, hover insights, live preview and many more.

---

## 🚀 **How It Works**

### **1. Hover for Instant Insights**
```html
{{ 'userProfile.save' | transloco }}
     ↑ Hover here
```

**Shows:**
- ✅ Common: "Save Profile"
- 🔄 Fyle: "Save User Profile"
- 🔵 Capital One: "Save Account"
- 📝 **[Edit Translation]** - Click to modify

### **2. Live Translation Preview**
Toggle the 👁️ eye icon in your status bar to see translations inline:

**Before (Preview OFF):**
```html
{{ 'common.buttons.save' | transloco }}
```

**After (Preview ON):**
```html
{{ 'common.buttons.save' | transloco }} → "Save"
```

### **3. Intelligent Auto-Complete**
When editing JSON translation files, get smart suggestions:

```json
{
  "userProfile": {
    "save": "Save Profile",
    "edit": "Edit Profile", 
    "delete": "█"  ← Type here for suggestions
  }
}
```

**Suggestions appear:**
- 💡 "Delete Profile" (90%) - Same component pattern
- 💡 "Remove Profile" (75%) - Similar action
- 💡 "Delete User" (60%) - Based on history

---

## 🎨 **Visual Features**

### **Status Bar Integration**
- **👁️ Translation Preview** - Toggle inline translation display
- **❌ 5 Missing** - Click to see detailed missing translations
- **Real-time updates** - Always shows current status

### **Smart Hover Tooltips**
- **Color-coded themes** for easy identification
- **Override indicators** (🔄 for theme overrides)
- **Clickable edit links** for instant modifications
- **Source file information**

---

## 🔧 **Supported File Types**

### **HTML Templates**
- `{{ 'key' | transloco }}` - Interpolation
- `[placeholder]="'key' | transloco"` - Property binding
- `'key' | transloco: { params }` - Parameterized translations

### **TypeScript Components**
- `this.translocoService.translate('key')` - Service calls
- `this.translocoService.translate('key', { params })` - With parameters
- `.translate('key')` - Generic method calls

### **JSON Translation Files**
- `src/assets/i18n/en.json` - Common translations
- `src/assets/i18n/fyle/en.json` - Fyle theme overrides
- `src/assets/i18n/co/en.json` - Capital One theme overrides

---

## ⚡ **Quick Start**

1. **Install the extension** in VS Code
2. **Open your Angular project** with Transloco
3. **Hover over translation keys** to see values instantly
4. **Click the eye icon** in status bar to toggle preview mode
5. **Check missing translations** by clicking the status bar counter
6. **Start typing in JSON files** to get intelligent suggestions

---

## 🎯 **Commands**

| Command | Description |
|---------|-------------|
| `Refresh Translations Cache` | Reload all translation files |
| `Show Translation Files Status` | View loaded translation files |
| `Toggle Translation Preview` | Show/hide inline translation values |
| `Analyze Translation Coverage` | Run comprehensive coverage analysis |
| `Show Missing Translations` | View detailed missing translation report |
| `Create Translation` | Add new translation with smart suggestions |

---

## 🔮 **Coming Soon**

- 🤖 **AI-Powered Translations** - GPT integration for automatic suggestions
- 🔍 **Advanced Search** - Find translations across all themes
- 📈 **Usage Analytics** - Track which translations are most used
