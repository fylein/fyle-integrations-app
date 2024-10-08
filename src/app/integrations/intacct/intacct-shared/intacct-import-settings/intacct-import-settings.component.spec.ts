import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { IntacctImportSettingsComponent } from './intacct-import-settings.component';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';

import { configuration, fyleFields, groupedDestinationAttributes, importSettings, intacctImportCodeConfig, locationEntityMapping, sageIntacctFields } from '../../intacct.fixture';
import { IntacctCategoryDestination, IntacctOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Org } from 'src/app/core/models/org/org.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationEntityMapping } from 'src/app/core/models/intacct/db/location-entity-mapping.model';
import { IntacctSharedModule } from '../intacct-shared.module';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { ImportSettingGet } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';

describe('IntacctImportSettingsComponent', () => {
  let component: IntacctImportSettingsComponent;
  let fixture: ComponentFixture<IntacctImportSettingsComponent>;
  let siImportSettingService: jasmine.SpyObj<SiImportSettingService>;
  let siMappingsService: jasmine.SpyObj<SiMappingsService>;
  let intacctConnectorService: jasmine.SpyObj<IntacctConnectorService>;
  let orgService: jasmine.SpyObj<OrgService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let toastService: jasmine.SpyObj<IntegrationsToastService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let siWorkspaceService: jasmine.SpyObj<SiWorkspaceService>;
  let router: Router;

  beforeEach(async () => {
    const siImportSettingServiceSpy = jasmine.createSpyObj('SiImportSettingService', ['getImportSettings', 'postImportSettings', 'getImportCodeFieldConfig']);
    const siMappingsServiceSpy = jasmine.createSpyObj('SiMappingsService', ['getSageIntacctFields', 'getFyleFields', 'getGroupedDestinationAttributes', 'getConfiguration', 'refreshSageIntacctDimensions', 'refreshFyleDimensions']);
    const intacctConnectorServiceSpy = jasmine.createSpyObj('IntacctConnectorService', ['getLocationEntityMapping']);
    const orgServiceSpy = jasmine.createSpyObj('OrgService', ['getCachedOrg']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['integrationsOnboardingCompletion', 'intacctUpdateEvent', 'trackTimeSpent']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get']);
    const siWorkspaceServiceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getIntacctOnboardingState', 'setIntacctOnboardingState']);

    await TestBed.configureTestingModule({
      declarations: [IntacctImportSettingsComponent],
      imports: [SharedModule, IntacctSharedModule, ReactiveFormsModule, RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: SiImportSettingService, useValue: siImportSettingServiceSpy },
        { provide: SiMappingsService, useValue: siMappingsServiceSpy },
        { provide: IntacctConnectorService, useValue: intacctConnectorServiceSpy },
        { provide: OrgService, useValue: orgServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SiWorkspaceService, useValue: siWorkspaceServiceSpy },
        provideRouter([])
        // HelperService
      ]
    })
      .compileComponents();

    siImportSettingService = TestBed.inject(SiImportSettingService) as jasmine.SpyObj<SiImportSettingService>;
    siMappingsService = TestBed.inject(SiMappingsService) as jasmine.SpyObj<SiMappingsService>;
    intacctConnectorService = TestBed.inject(IntacctConnectorService) as jasmine.SpyObj<IntacctConnectorService>;
    orgService = TestBed.inject(OrgService) as jasmine.SpyObj<OrgService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    toastService = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    siWorkspaceService = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOnProperty(router, 'url').and.returnValue('/onboarding');
    siImportSettingService.getImportSettings.and.returnValue(of(importSettings));
    siImportSettingService.getImportCodeFieldConfig.and.returnValue(of(intacctImportCodeConfig));
    siMappingsService.getSageIntacctFields.and.returnValue(of(sageIntacctFields));
    siMappingsService.getFyleFields.and.returnValue(of(fyleFields));
    siMappingsService.getGroupedDestinationAttributes.and.returnValue(of(groupedDestinationAttributes));
    siMappingsService.getConfiguration.and.returnValue(of(configuration));
    intacctConnectorService.getLocationEntityMapping.and.returnValue(of(locationEntityMapping));
    orgService.getCachedOrg.and.returnValue({ created_at: new Date() } as Org);
    siWorkspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.IMPORT_SETTINGS);
    storageService.get.and.returnValue(366);

    fixture = TestBed.createComponent(IntacctImportSettingsComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set initial loading state', () => {
      expect(component.isLoading).toBeFalsy();
    });

    it('should fetch and set all required data', () => {
      expect(siMappingsService.getSageIntacctFields).toHaveBeenCalled();
      expect(siMappingsService.getFyleFields).toHaveBeenCalled();
      expect(siMappingsService.getGroupedDestinationAttributes).toHaveBeenCalledWith(['TAX_DETAIL']);
      expect(siImportSettingService.getImportSettings).toHaveBeenCalled();
      expect(siMappingsService.getConfiguration).toHaveBeenCalled();
      expect(intacctConnectorService.getLocationEntityMapping).toHaveBeenCalled();
      expect(siImportSettingService.getImportCodeFieldConfig).toHaveBeenCalled();
    });

    it('should correctly transform and set sageIntacctFields', () => {
      expect(component.sageIntacctFields).toEqual([
        {
          attribute_type: 'PROJECT',
          display_name: 'Project'
        },
        {
          attribute_type: 'CUSTOMER',
          display_name: 'Customer'
        },
        {
          attribute_type: 'ITEM',
          display_name: 'Item'
        }
      ] as ExpenseField[]);
    });

    it('should set Fyle fields with custom field option', () => {
      expect(component.fyleFields).toEqual(fyleFields as ExpenseField[]);
    });

    it('should set intacctCategoryDestination based on configuration', () => {
      expect(component.intacctCategoryDestination).toEqual(IntacctCategoryDestination.GL_ACCOUNT);

      const updatedConfig = {...configuration, reimbursable_expenses_object: 'EXPENSE_REPORT'};
      siMappingsService.getConfiguration.and.returnValue(of(updatedConfig as IntacctConfiguration));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.intacctCategoryDestination).toEqual(IntacctCategoryDestination.EXPENSE_TYPE);
    });

    describe('Form Group Initialization', () => {
      it('should initialize the form with correct controls', () => {
        expect(component.importSettingsForm.get('importVendorAsMerchant')).toBeTruthy();
        expect(component.importSettingsForm.get('importCategories')).toBeTruthy();
        expect(component.importSettingsForm.get('importTaxCodes')).toBeTruthy();
        expect(component.importSettingsForm.get('costCodes')).toBeTruthy();
        expect(component.importSettingsForm.get('dependentFieldImportToggle')).toBeTruthy();
        expect(component.importSettingsForm.get('workspaceId')).toBeTruthy();
        expect(component.importSettingsForm.get('costTypes')).toBeTruthy();
        expect(component.importSettingsForm.get('isDependentImportEnabled')).toBeTruthy();
        expect(component.importSettingsForm.get('sageIntacctTaxCodes')).toBeTruthy();
        expect(component.importSettingsForm.get('expenseFields')).toBeTruthy();
        expect(component.importSettingsForm.get('searchOption')).toBeTruthy();
        expect(component.importSettingsForm.get('importCodeField')).toBeTruthy();
        expect(component.importSettingsForm.get('importCodeFields')).toBeTruthy();
      });

      it('should initialize form with correct values', () => {
        expect(component.importSettingsForm.get('importVendorAsMerchant')?.value).toEqual(importSettings.configurations.import_vendors_as_merchants || null || null);
        expect(component.importSettingsForm.get('importCategories')?.value).toEqual(importSettings.configurations.import_categories || null);
        expect(component.importSettingsForm.get('importTaxCodes')?.value).toEqual(importSettings.configurations.import_tax_codes || null);
        expect(component.importSettingsForm.get('workspaceId')?.value).toEqual(366);
        expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeFalsy();
        expect(component.importSettingsForm.get('searchOption')?.value).toEqual('');
        expect(component.importSettingsForm.get('importCodeField')?.value).toEqual(importSettings.configurations.import_code_fields);
      });

      it('should initialize expenseFields FormArray correctly', () => {
        const expenseFieldsArray = component.importSettingsForm.get('expenseFields') as FormArray;
        expect(expenseFieldsArray.length).toBeGreaterThan(0);

        const testForFields = (control: AbstractControl<any, any>) => {
          expect(control.get('source_field')).toBeTruthy();
          expect(control.get('destination_field')).toBeTruthy();
          expect(control.get('import_to_fyle')).toBeTruthy();
          expect(control.get('is_custom')).toBeTruthy();
          expect(control.get('source_placeholder')).toBeTruthy();
        };
        expenseFieldsArray.controls.forEach(testForFields);
      });
    });

    describe('Dependent Fields Setup', () => {
      it('should handle dependent fields when project mapping exists', fakeAsync(() => {
        const importSettingsWithProject = {...importSettings, mapping_settings: [{
          source_field: 'PROJECT',
          destination_field: 'PROJECT',
          import_to_fyle: true
        }]} as ImportSettingGet;
        siImportSettingService.getImportSettings.and.returnValue(of(importSettingsWithProject));

        fixture.detectChanges();
        tick();

        expect(component.costCodeFieldOption.length).toBe(1);
        expect(component.costTypeFieldOption.length).toBe(1);
      }));

      it('should handle dependent field settings', () => {
        const settingsWithDependentFields = {...importSettings, dependent_field_settings: {
          is_import_enabled: true,
          cost_code_field_name: 'COST_CODE',
          cost_code_placeholder: 'Enter Cost Code',
          cost_type_field_name: 'COST_TYPE',
          cost_type_placeholder: 'Enter Cost Type'
        }} as ImportSettingGet;
        siImportSettingService.getImportSettings.and.returnValue(of(settingsWithDependentFields));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeTrue();
        expect(component.importSettingsForm.get('costCodes')?.value).toEqual({
          attribute_type: 'COST_CODE',
          display_name: 'COST_CODE',
          source_placeholder: 'Enter Cost Code',
          is_dependent: true
        });
        expect(component.importSettingsForm.get('costTypes')?.value).toEqual({
          attribute_type: 'COST_TYPE',
          display_name: 'COST_TYPE',
          source_placeholder: 'Enter Cost Type',
          is_dependent: true
        });
      });
    });
  });
});