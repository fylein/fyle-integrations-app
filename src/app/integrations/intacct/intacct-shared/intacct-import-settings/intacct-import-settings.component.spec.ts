/* eslint-disable dot-notation */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { configuration, costCodeFieldValue, costTypeFieldValue, fyleFields, groupedDestinationAttributes, importSettings, importSettingsWithProject, intacctImportCodeConfig, locationEntityMapping, sageIntacctFields, sageIntacctFieldsSortedByPriority, settingsWithDependentFields } from '../../intacct.fixture';
import { IntacctCategoryDestination, IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Org } from 'src/app/core/models/org/org.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IntacctSharedModule } from '../intacct-shared.module';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
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
  let routerUrlSpy: jasmine.Spy<(this: Router) => string>;

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
    routerUrlSpy = spyOnProperty(router, 'url').and.returnValue('/onboarding');
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

  describe('Component Initialization', () => {
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
      expect(component.sageIntacctFields).toEqual(sageIntacctFieldsSortedByPriority);
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
        siImportSettingService.getImportSettings.and.returnValue(of(importSettingsWithProject));

        fixture.detectChanges();
        tick();

        expect(component.costCodeFieldOption.length).toBe(1);
        expect(component.costTypeFieldOption.length).toBe(1);
      }));

      it('should handle dependent field settings', () => {
        siImportSettingService.getImportSettings.and.returnValue(of(settingsWithDependentFields));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeTrue();
        expect(component.importSettingsForm.get('costCodes')?.value).toEqual(costCodeFieldValue);
        expect(component.importSettingsForm.get('costTypes')?.value).toEqual(costTypeFieldValue);
      });
    });
  });

  describe('Save', () => {
    it('should successfully save import settings during onboarding', fakeAsync(() => {
      siWorkspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.IMPORT_SETTINGS);
      routerUrlSpy.and.returnValue('/onboarding');
      siImportSettingService.postImportSettings.and.returnValue(of(importSettings));

      component.ngOnInit();
      tick();

      component.save();
      tick();

      expect(siImportSettingService.postImportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      expect(trackingService.integrationsOnboardingCompletion).toHaveBeenCalledWith(
        TrackingApp.INTACCT,
        IntacctOnboardingState.IMPORT_SETTINGS,
        3,
        jasmine.any(Object)
      );
      expect(siWorkspaceService.setIntacctOnboardingState).toHaveBeenCalledWith(IntacctOnboardingState.ADVANCED_CONFIGURATION);
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/advanced_settings']);
      expect(component.saveInProgress).toBeFalse();
    }));

    it('should successfully save import settings post-onboarding', fakeAsync(() => {
      siWorkspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.COMPLETE);
      routerUrlSpy.and.returnValue('/settings');
      siImportSettingService.postImportSettings.and.returnValue(of(importSettings));

      component.ngOnInit();
      tick();

      component.save();
      tick();

      expect(siImportSettingService.postImportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      expect(trackingService.intacctUpdateEvent).toHaveBeenCalledWith(
        IntacctUpdateEvent.ADVANCED_SETTINGS_INTACCT,
        {
          phase: ProgressPhase.POST_ONBOARDING,
          oldState: component.importSettings,
          newState: importSettings
        }
      );
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.saveInProgress).toBeFalse();
    }));

    it('should handle error when saving import settings', fakeAsync(() => {
      siImportSettingService.postImportSettings.and.returnValue(throwError(() => new Error()));

      component.ngOnInit();
      tick();

      component.save();
      tick();

      expect(siImportSettingService.postImportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(
        ToastSeverity.ERROR,
        'Error saving import settings, please try again later'
      );
      expect(component.saveInProgress).toBeFalse();
    }));

    it('should track time spent when saving settings', fakeAsync(() => {
      const mockStartTime = new Date();
      component['sessionStartTime'] = mockStartTime;
      siImportSettingService.postImportSettings.and.returnValue(of(importSettings));

      component.ngOnInit();
      tick();

      component.save();
      tick();

      expect(trackingService.trackTimeSpent).toHaveBeenCalledWith(
        TrackingApp.INTACCT,
        Page.IMPORT_SETTINGS_INTACCT,
        mockStartTime
      );
    }));
  });
});