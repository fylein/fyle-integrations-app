# QBD-Direct Items Feature Documentation

## Executive Summary
This document outlines the implementation of **Items** feature for QBD-Direct (QuickBooks Desktop Connector). The feature allows users to import **Products/Services** from QuickBooks Desktop as **Categories** in Fyle, following the same pattern as the existing `import_account_as_category` feature with the naming convention `import_items_as_category`.

---

# Current vs. Expected Behaviour

## Current Behavior
- QBD-Direct only supports importing **Accounts** as Categories via `import_account_as_category: boolean`
- Category mapping shows only "Account" option
- Dashboard integration only tracks account imports
- Export settings has no restriction warnings for items (since feature doesn't exist)
- Base mapping component displays only account-based options

## Expected Behavior
- QBD-Direct will support importing **Products/Services (Items)** as Categories via `import_items_as_category: boolean`
- Category mapping will show "Item,Account" when items are enabled, "Account" when disabled
- Dashboard will track both account and items imports
- Export settings will show warnings when switching to Journal Entry with items enabled
- Base mapping component will display enhanced options based on items setting
- Feature will be controlled by feature flags and conditional display logic
- Items feature will be **disabled** when either export type is Journal Entry (same restriction as QBO)

## Business Rules
- Items can only be imported when **both** export types are **NOT** Journal Entry
- When enabled, mapping shows both Items and Accounts for category selection
- Warning system activates when switching to Journal Entry with items enabled
- Feature follows same UI/UX patterns as existing account import feature

---

# References

## Existing QBO Implementation
- **File**: `src/app/core/models/qbo/db/workspace-general-setting.model.ts:13`
- **Property**: `import_items: boolean`
- **Location**: Direct property in workspace general settings

## QBD-Direct Reference Pattern
- **File**: `src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model.ts:6-9`
- **Property**: `import_account_as_category: boolean` 
- **Location**: Nested in `import_settings` object
- **Form Control**: `importCategories` maps to `import_account_as_category`
- **Usage Pattern**: Used in base mapping for chart of accounts selection

## Branding Content (Already Configured)
- **Files**: 
  - `src/app/branding/c1-content-config.ts:66-67`
  - `src/app/branding/fyle-contents-config.ts:66-67`
- **Content**: 
  ```typescript
  importItemsLabel: 'Import products/services from QuickBooks Desktop',
  importItemsSubLabel: 'Products/services from QuickBooks Desktop will be imported as categories in ' + brandingConfig.brandName + '.',
  ```

---

# Affected Routes

## QBD-Direct Onboarding
- `/integrations/qbd-direct/onboarding/import_settings`
- `/integrations/qbd-direct/onboarding/export_settings` 
- `/integrations/qbd-direct/onboarding/advanced_settings`

## QBD-Direct Main Application
- `/integrations/qbd-direct/main/dashboard`
- `/integrations/qbd-direct/main/import_settings`
- `/integrations/qbd-direct/main/export_settings`
- `/integrations/qbd-direct/main/mapping/category` (base mapping)

## Mapping Routes (Enhanced Display)
- `/integrations/qbd-direct/main/mapping/category` - Will show "Item,Account" vs "Account"
- All other mapping routes remain unchanged but may reference items setting

---

# Folder Structure

```yaml
- src/
  - app/
    - core/
      - models/
        - qbd-direct/
          - qbd-direct-configuration/
            - qbd-direct-import-settings.model.ts # UPDATED - Add import_items_as_category
            - qbd-direct-import-settings.model.spec.ts # UPDATED - Add items tests
    - integrations/
      - qbd-direct/
        - qbd-direct-onboarding/ # UPDATED - Items toggle in onboarding flow
        - qbd-direct-shared/
          - qbd-direct-import-settings/
            - qbd-direct-import-settings.component.ts # UPDATED - Add export settings loading
            - qbd-direct-import-settings.component.html # UPDATED - Add items toggle
            - qbd-direct-import-settings.component.spec.ts # UPDATED - Add items tests
          - qbd-direct-export-settings/
            - qbd-direct-export-settings.component.ts # UPDATED - Add items warning system
            - qbd-direct-export-settings.component.spec.ts # UPDATED - Add warning tests
        - qbd-direct-main/
          - qbd-direct-dashboard/
            - qbd-direct-dashboard.component.ts # UPDATED - Add isImportItemsEnabled
            - qbd-direct-dashboard.component.html # UPDATED - Pass items flag to dashboard-export-section
            - qbd-direct-dashboard.component.spec.ts # UPDATED - Add items integration tests
          - qbd-direct-mapping/
            - qbd-direct-base-mapping/
              - qbd-direct-base-mapping.component.ts # UPDATED - Add displayName logic for items
              - qbd-direct-base-mapping.component.spec.ts # UPDATED - Add items display tests
    - branding/
      - c1-branding-config.ts # UPDATED - Enable importItems feature flag
      - fyle-branding-config.ts # UPDATED - Enable importItems feature flag
      - c1-content-config.ts # ALREADY CONFIGURED - Items content exists
      - fyle-contents-config.ts # ALREADY CONFIGURED - Items content exists
```

---

# Routes

```yaml
- /integrations/qbd-direct/ -
  - onboarding/
    - import_settings/ # Items toggle with Journal Entry restrictions
    - export_settings/ # Warning system for Journal Entry conflicts
    - advanced_settings/
  - main/
    - dashboard/ # Items integration tracking
    - import_settings/ # Items toggle with Journal Entry restrictions  
    - export_settings/ # Warning system for Journal Entry conflicts
    - mapping/
      - category/ # Enhanced display: "Item,Account" vs "Account"
      - project/
      - cost_center/
      - merchant/
```

---

# Modules

| Module Name | Type | Description |
|-------------|------|-------------|
| QbdDirectSharedModule | Updated | Import settings component updated with items toggle and export settings integration |
| QbdDirectMainModule | Updated | Dashboard and base mapping components updated with items logic |
| QbdDirectOnboardingModule | Updated | Onboarding flow updated with items configuration |

---

# Components

| Component Name | Type | Description | Implementation Details |
|----------------|------|-------------|----------------------|
| QbdDirectImportSettingsComponent | Updated | Add items toggle with conditional display | - Load export settings via forkJoin<br/>- Add items toggle HTML section<br/>- Conditional display based on Journal Entry restrictions<br/>- Form control: `importItems` mapping to `import_items_as_category` |
| QbdDirectExportSettingsComponent | Updated | Add warning system for Journal Entry conflicts | - Load import settings to check items status<br/>- Add `isImportItemsEnabled` property<br/>- Update `replaceContentBasedOnConfiguration` method<br/>- Show warning when switching to Journal Entry with items enabled |
| QbdDirectBaseMappingComponent | Updated | Enhanced display name logic for category mapping | - Add `isImportItemsEnabled` property<br/>- Update display name logic: "Item,Account" vs "Account"<br/>- Load import settings in `setupPage()` method<br/>- Apply display logic for CATEGORY source field |
| QbdDirectDashboardComponent | Updated | Integrate items tracking | - Add `isImportItemsEnabled` property<br/>- Load import settings in dashboard setup<br/>- Pass items flag to dashboard-export-section component |

---

# Other Details

## Data Model Updates

### QdbDirectImportSetting Type
```typescript
// BEFORE
export type QdbDirectImportSetting = {
    import_account_as_category: boolean,
    import_vendor_as_merchant: boolean,
    chart_of_accounts: string[],
    import_code_fields: string[]
}

// AFTER  
export type QdbDirectImportSetting = {
    import_account_as_category: boolean,
    import_items_as_category: boolean,    // ← NEW PROPERTY
    import_vendor_as_merchant: boolean,
    chart_of_accounts: string[],
    import_code_fields: string[]
}
```

### Form Mapping Updates
```typescript
// Add in mapAPIResponseToFormGroup method
importItems: new FormControl(importSettings?.import_settings?.import_items_as_category ?? false),
```

### Payload Construction Updates
```typescript
// Add in constructPayload method
import_settings: {
    import_account_as_category: importSettingsForm.get('importCategories')?.value,
    import_items_as_category: importSettingsForm.get('importItems')?.value,  // ← NEW
    // ... other properties
}
```

## UI Implementation Details

### Items Toggle HTML
```html
<!-- Insert after line 58 in qbd-direct-import-settings.component.html -->
<div class="tw-rounded-lg tw-border-border-tertiary tw-border tw-mt-24-px" 
     *ngIf="brandingFeatureConfig.featureFlags.importSettings.importItems && 
            exportSettings.reimbursable_expense_export_type !== QbdDirectReimbursableExpensesObject.JOURNAL_ENTRY && 
            exportSettings.credit_card_expense_export_type !== QbdDirectCorporateCreditCardExpensesObject.JOURNAL_ENTRY">
    <app-configuration-toggle-field
        [form]="importSettingForm"
        [label]="brandingContent.importItemsLabel"
        [subLabel]="brandingContent.importItemsSubLabel"
        [formControllerName]="'importItems'"
        [iconPath]="'arrow-tail-down'">
    </app-configuration-toggle-field>
</div>
```

### Warning System Logic
```typescript
// In export settings component
if ((updatedConfiguration === QBDReimbursableExpensesObject.JOURNAL_ENTRY || updatedConfiguration === QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY) && this.isImportItemsEnabled) {
    return `${content} <br><br>Also, Products/services previously imported as categories in ${brandingConfig.brandName} will be disabled.`;
}
```

### Display Name Logic
```typescript
// In base mapping component
if (this.destinationField === AccountingField.ACCOUNT && this.sourceField === FyleField.CATEGORY) {
    this.displayName = this.isImportItemsEnabled ? 
        `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}` : 
        AccountingDisplayName.ACCOUNT;
}
```

## API Query Parameter Handling

### Critical Implementation Requirement
For category mappings, the frontend must pass the items setting to mapping APIs via query parameters so the backend can filter the returned destination options appropriately.

### Frontend API Call Updates

#### **Base Mapping Component Updates**
```typescript
// File: src/app/integrations/qbd-direct/qbd-direct-main/qbd-direct-mapping/qbd-direct-base-mapping/qbd-direct-base-mapping.component.ts

// EXISTING METHOD (for reference)
destinationOptionsWatcher(detailAccountType?: string[]): void {
    this.detailAccountType = detailAccountType;
    this.mappingService.getPaginatedDestinationAttributes(this.destinationField, undefined, this.displayName, '', detailAccountType).subscribe((responses) => {
        this.destinationOptions = responses.results as QbdDirectDestinationAttribute[];
        this.isLoading = false;
    });
}

// ← NO CHANGES NEEDED - The displayName parameter is already being passed!
// When this.displayName = "Item,Account" vs "Account", the backend will receive display_name__in parameter
```

#### **The Key Change: Display Name Logic**
```typescript
// File: src/app/integrations/qbd-direct/qbd-direct-main/qbd-direct-mapping/qbd-direct-base-mapping/qbd-direct-base-mapping.component.ts

private setupPage(): void {
    this.sourceField = decodeURIComponent(this.route.snapshot.params.source_field.toUpperCase());
    forkJoin([
        this.exportSettingService.getQbdExportSettings(),
        this.importSettingService.getImportSettings(),
        this.mappingService.getMappingSettings()
    ]).subscribe((responses) => {
        this.reimbursableExpenseObject = responses[0].reimbursable_expense_export_type;
        this.cccExpenseObject = responses[0].credit_card_expense_export_type;
        this.employeeFieldMapping = (responses[0].employee_field_mapping as unknown as FyleField);
        this.nameInJE = responses[0].name_in_journal_entry;
        
        // ← NEW: Extract items setting
        this.isImportItemsEnabled = responses[1].import_settings.import_items_as_category;
        
        this.chartOfAccounts = responses[1].import_settings.import_account_as_category ? 
            responses[1].import_settings.chart_of_accounts.map((item: string) => item.replace(/\s+/g, '')) : 
            QbdDirectImportSettingModel.getChartOfAccountTypesList().map((item: string) => item.replace(/\s+/g, ''));

        this.destinationField = this.getDestinationField(responses[0], responses[2].results);

        // ← NEW: Set display name based on items setting
        if (this.destinationField === AccountingField.ACCOUNT && this.sourceField === FyleField.CATEGORY) {
            this.displayName = this.isImportItemsEnabled ? 
                `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}` : 
                AccountingDisplayName.ACCOUNT;
        } else {
            this.displayName = undefined;
        }

        if (this.sourceField === 'CORPORATE_CARD') {
            this.getCCCAccountOptions();
        } else if (this.sourceField === 'CATEGORY') {
            this.getAccountOptions();
        } else {
            this.destinationOptionsWatcher();
        }
    });
}

// The existing destinationOptionsWatcher method already passes this.displayName
// No changes needed to the API call!
```

### Mapping Service - NO CHANGES NEEDED

The existing `getPaginatedDestinationAttributes` method already supports the `display_name` parameter:

```typescript
// File: src/app/core/services/common/mapping.service.ts

getPaginatedDestinationAttributes(
    attributeType: string | string[], 
    value?: string, 
    display_name?: string,  // ← ALREADY EXISTS
    appName?: string, 
    detailed_account_type?: string[], 
    categories?: string[], 
    destinationIds?: string[]
): Observable<PaginatedDestinationAttribute> {
    // ... existing implementation
    
    if (display_name) {
        params.display_name__in = display_name;  // ← ALREADY IMPLEMENTED
    }
    
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/paginated_destination_attributes/`, params);
}
```

### Backend API Coordination Required

#### **API Endpoint** (Already Exists)
```
GET /workspaces/{workspace_id}/mappings/paginated_destination_attributes/
```

**Existing Query Parameter:**
- `display_name__in=Account` - Returns only accounts
- `display_name__in=Item,Account` - Should return both accounts and items

**Backend Logic Required:**
```python
# Pseudo-code for backend handling
def get_paginated_destination_attributes(request):
    display_name_filter = request.GET.get('display_name__in')
    
    if display_name_filter and 'Item' in display_name_filter:
        # Return both accounts and items
        accounts = get_accounts()
        items = get_items()  # ← NEW: Add items query
        return accounts + items
    else:
        # Return only accounts (existing behavior)
        return get_accounts()
```

### Dashboard Error Section - Already Handled

The dashboard error section already follows the same pattern:

```typescript
// File: src/app/shared/components/dashboard/dashboard-error-section/dashboard-error-section.component.ts

getDestinationOptionsV1(errorType: AccountingErrorType): void {
    if (this.destinationField === AccountingField.ACCOUNT && this.appName === AppName.QBD_DIRECT) {
        this.detailAccountType = this.chartOfAccounts.map((item: string) => item.replace(/\s+/g, ''));
        
        // ← NEW: Add items logic for QBD-Direct (similar to existing QBO logic)
        this.displayName = this.isImportItemsEnabled ? 
            `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}` : 
            AccountingDisplayName.ACCOUNT;
    } else {
        this.displayName = undefined;
        this.detailAccountType = undefined;
    }

    this.mappingService.getPaginatedDestinationAttributes(this.destinationField, undefined, this.displayName, this.appName, this.detailAccountType).subscribe((response: any) => {
        this.destinationOptions = response.results;
        this.setErrors(errorType);
    });
}
```

### Key Insight: Minimal Changes Required!

The QBD-Direct implementation is **much simpler** than initially documented because:

1. **API Method Already Exists**: `getPaginatedDestinationAttributes` already supports `display_name` parameter
2. **Query Parameter Already Supported**: `display_name__in` is already implemented in the service
3. **Pattern Already Established**: QBO already uses this exact pattern
4. **No Service Changes**: No changes needed to `MappingService`

### Implementation Checklist (Simplified)

#### **Frontend Changes Required:**
- [ ] Add `isImportItemsEnabled` property to base mapping component
- [ ] Load import settings in `setupPage()` method  
- [ ] Add display name logic for CATEGORY mapping
- [ ] Update dashboard error section with items logic

#### **Backend Changes Required:**
- [ ] Update `/mappings/paginated_destination_attributes/` endpoint
- [ ] Handle `display_name__in=Item,Account` parameter
- [ ] Return items + accounts when items are included in display name
- [ ] Ensure items have correct `attribute_type` and structure

#### **No Changes Needed:**
- ✅ `MappingService.getPaginatedDestinationAttributes()` method
- ✅ Query parameter structure
- ✅ API endpoint URL
- ✅ Frontend API call pattern

### Testing Requirements

#### **Frontend Testing:**
```typescript
it('should set displayName to "Item,Account" when items are enabled for category mapping', () => {
    component.isImportItemsEnabled = true;
    component.destinationField = AccountingField.ACCOUNT;
    component.sourceField = FyleField.CATEGORY;
    
    component.setupPage();
    
    expect(component.displayName).toBe('Item,Account');
});

it('should pass displayName to getPaginatedDestinationAttributes', () => {
    component.displayName = 'Item,Account';
    component.destinationOptionsWatcher(['Expense']);
    
    expect(mockMappingService.getPaginatedDestinationAttributes).toHaveBeenCalledWith(
        'ACCOUNT',
        undefined,
        'Item,Account',  // ← Key parameter
        '',
        ['Expense']
    );
});
```

#### **Backend Testing:**
- Test endpoint returns accounts only when `display_name__in=Account`
- Test endpoint returns accounts + items when `display_name__in=Item,Account`
- Test items have correct structure and `attribute_type`
- Test search functionality works with items included

## Feature Flag Configuration
```typescript
// In branding config files
importSettings: {
    allowImportCode: true,
    importItems: true,  // ← ENABLE FOR QBD-DIRECT
    importVendorsAsMerchants: true,
    importProjects: false,
    importCodeSettings: false
},
```

## Testing Strategy

### Unit Tests Required
- Model form mapping and payload construction
- Component conditional display logic
- Export settings warning system
- Base mapping display name logic
- Dashboard integration

### Integration Tests Required
- End-to-end flow from import settings to mapping
- API integration with new property
- Warning system workflow
- Journal Entry restriction validation

### Manual Testing Checklist
- [ ] Items toggle appears when both export types are NOT Journal Entry
- [ ] Items toggle hidden when either export type IS Journal Entry
- [ ] Items setting saves correctly
- [ ] Mapping shows "Item,Account" when enabled
- [ ] Warning appears when switching to Journal Entry with items enabled
- [ ] Dashboard integrates items flag correctly
- [ ] Feature flag controls visibility
- [ ] Branding content displays correctly

## Backend Coordination Required
- Add `import_items_as_category` field to import settings API model
- Update GET/POST `/import_settings` endpoints
- Provide Items data endpoint for mapping
- Update mapping endpoints to support Items display
- Implement Journal Entry validation logic

## Key Differences from QBO Implementation
| Aspect | QBO | QBD-Direct |
|--------|-----|------------|
| **Property Name** | `import_items` | `import_items_as_category` |
| **Location** | `workspace_general_settings` | `import_settings` |
| **Export Restrictions** | ❌ Not available with Journal Entry | ❌ Not available with Journal Entry |
| **Warning System** | ✅ Warns about Journal Entry conflicts | ✅ Warns about Journal Entry conflicts |

---

# Rollout Plan

## Phase 1: Development & Testing (Week 1-2)
- Backend API updates
- Frontend implementation following existing patterns
- Comprehensive unit and integration testing
- Manual testing completion

## Phase 2: Feature Flag Rollout (Week 3)
- **Phase 2.1**: Deploy with feature flag `importItems: false` (disabled)
- **Phase 2.2**: Enable for beta customers with `importItems: true`
- **Phase 2.3**: Monitor usage and error rates

## Phase 3: Full Production Rollout (Week 4)
- Enable `importItems: true` for all customers
- Monitor adoption metrics and user feedback
- Support team training on new feature

## Rollback Strategy
- Feature flag can be immediately disabled if issues arise
- Backward compatibility ensures existing functionality unaffected
- Database changes are additive (no data loss risk)

---

# Challenges faced

## Design & Requirements Gaps
- **Journal Entry Restrictions**: Initial analysis missed that QBD-Direct also has Journal Entry export types that conflict with items feature
- **Export Settings Integration**: Need to load export settings in import settings component for conditional display
- **Display Name Logic**: Complex mapping display changes when items are enabled

## Technical Implementation Challenges
- **Circular Dependencies**: Import settings component now needs export settings data
- **Form Validation**: Ensuring proper validation when toggling items on/off
- **API Coordination**: Backend changes required for complete feature implementation

## Testing Complexities
- **Export Type Combinations**: Testing all combinations of export types and items settings
- **Warning System**: Ensuring warning appears at correct times without false positives
- **Integration Testing**: Full flow testing requires both backend and frontend changes

## Migration Considerations
- **Backward Compatibility**: Ensuring existing QBD-Direct installations continue working
- **Feature Flag Management**: Coordinating feature rollout across different customer segments
- **Data Consistency**: Ensuring items setting correctly reflects in all components

## Risk Mitigation Applied
- Following proven patterns from existing `import_account_as_category` implementation
- Comprehensive testing strategy including unit, integration, and manual testing
- Phased rollout with feature flags for controlled release
- Strong backward compatibility guarantees 