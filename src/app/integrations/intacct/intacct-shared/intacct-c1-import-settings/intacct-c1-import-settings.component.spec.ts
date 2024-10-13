import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IntacctC1ImportSettingsComponent } from './intacct-c1-import-settings.component';
import { SiImportSettingService } from 'src/app/core/services/si/si-configuration/si-import-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import {
  importSettings,
  sageIntacctFields,
  fyleFields,
  configuration,
  locationEntityMapping,
  settingsWithDependentFields,
  sageIntacctFieldsSortedByPriorityForC1,
  importSettingsWithProjectMapping,
  expenseFieldsExpectedForC1,
  costCodeFieldValue,
  costTypeFieldValue
} from '../../intacct.fixture';
import { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';
import { ImportSettingGet, ImportSettingPost, ImportSettings } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';

describe('IntacctC1ImportSettingsComponent', () => {
  let component: IntacctC1ImportSettingsComponent;
  let fixture: ComponentFixture<IntacctC1ImportSettingsComponent>;
  let router: Router;
  let mappingService: jasmine.SpyObj<SiMappingsService>;
  let importSettingService: jasmine.SpyObj<SiImportSettingService>;
  let connectorService: jasmine.SpyObj<IntacctConnectorService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let toastService: jasmine.SpyObj<IntegrationsToastService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let workspaceService: jasmine.SpyObj<SiWorkspaceService>;
  let helperService: jasmine.SpyObj<HelperService>;

  beforeEach(async () => {
    const mappingServiceSpy = jasmine.createSpyObj('SiMappingsService', [
      'getSageIntacctFields',
      'getFyleFields',
      'getConfiguration',
      'refreshSageIntacctDimensions',
      'refreshFyleDimensions'
    ]);
    const importSettingServiceSpy = jasmine.createSpyObj('SiImportSettingService', ['getImportSettings', 'postImportSettings']);
    const connectorServiceSpy = jasmine.createSpyObj('IntacctConnectorService', ['getLocationEntityMapping']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['trackTimeSpent', 'intacctUpdateEvent', 'integrationsOnboardingCompletion']);
    const workspaceServiceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getIntacctOnboardingState', 'setIntacctOnboardingState']);
    const helperServiceSpy = jasmine.createSpyObj('HelperService', [
      'disableFormField',
      'enableFormField',
      'markControllerAsRequired',
      'clearValidatorAndResetValue'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ IntacctC1ImportSettingsComponent ],
      imports: [ SharedModule, RouterModule.forRoot([]), HttpClientTestingModule, ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: SiMappingsService, useValue: mappingServiceSpy },
        { provide: SiImportSettingService, useValue: importSettingServiceSpy },
        { provide: IntacctConnectorService, useValue: connectorServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        { provide: SiWorkspaceService, useValue: workspaceServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntacctC1ImportSettingsComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    mappingService = TestBed.inject(SiMappingsService) as jasmine.SpyObj<SiMappingsService>;
    importSettingService = TestBed.inject(SiImportSettingService) as jasmine.SpyObj<SiImportSettingService>;
    connectorService = TestBed.inject(IntacctConnectorService) as jasmine.SpyObj<IntacctConnectorService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    toastService = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    workspaceService = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;

    spyOn(router, 'navigate');
    spyOnProperty(router, 'url').and.returnValue('/onboarding');
    mappingService.getSageIntacctFields.and.returnValue(of(sageIntacctFields));
    mappingService.getFyleFields.and.returnValue(of(fyleFields));
    mappingService.getConfiguration.and.returnValue(of(configuration));
    importSettingService.getImportSettings.and.returnValue(of(importSettings));
    connectorService.getLocationEntityMapping.and.returnValue(of(locationEntityMapping));
    storageService.get.and.returnValue('123');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {

    it('should initialize component with correct data', () => {
      component.ngOnInit();
      expect(component.isLoading).toBeFalse();
      expect(component.sageIntacctFields).toEqual(sageIntacctFieldsSortedByPriorityForC1);
      expect(component.fyleFields).toEqual(fyleFields);
      expect(component.importSettings).toEqual(importSettings);
    });

    it('should handle employee field mapping for EMPLOYEE', () => {
      const employeeConfig = { ...configuration, employee_field_mapping: 'EMPLOYEE' };
      mappingService.getConfiguration.and.returnValue(of(employeeConfig as IntacctConfiguration));

      component.ngOnInit();
      expect(component.intacctCategoryDestination).toBe('EXPENSE_TYPE');
    });

    it('should handle employee field mapping for non-EMPLOYEE', () => {
      component.ngOnInit();
      expect(component.intacctCategoryDestination).toBe('GL_ACCOUNT');
    });

    it('should initialize all form controls', () => {
      component.ngOnInit();
      expect(component.importSettingsForm.get('importVendorAsMerchant')).toBeDefined();
      expect(component.importSettingsForm.get('importCategories')).toBeDefined();
      expect(component.importSettingsForm.get('importTaxCodes')).toBeDefined();
      expect(component.importSettingsForm.get('costCodes')).toBeDefined();
      expect(component.importSettingsForm.get('dependentFieldImportToggle')).toBeDefined();
      expect(component.importSettingsForm.get('workspaceId')).toBeDefined();
      expect(component.importSettingsForm.get('costTypes')).toBeDefined();
      expect(component.importSettingsForm.get('isDependentImportEnabled')).toBeDefined();
      expect(component.importSettingsForm.get('sageIntacctTaxCodes')).toBeDefined();
      expect(component.importSettingsForm.get('expenseFields')).toBeDefined();
      expect(component.importSettingsForm.get('importCodeField')).toBeDefined();
      expect(component.importSettingsForm.get('importCodeFields')).toBeDefined();
    });
  });

  describe('Form Initialization', () => {

    it('should generate the correct expense fields', () => {
      importSettingService.getImportSettings.and.returnValue(of(
        importSettingsWithProjectMapping as ImportSettingGet
      ));
      spyOn<any>(component, 'createFormGroup').and.callThrough();
      component.ngOnInit();

      expect(component.importSettingsForm.get('expenseFields')?.value).toEqual(expenseFieldsExpectedForC1);
    });

    it('should handle dependent fields correctly', () => {
      importSettingService.getImportSettings.and.returnValue(of(settingsWithDependentFields as ImportSettingGet));

      component.ngOnInit();
      expect(component.importSettingsForm.get('isDependentImportEnabled')!.value).toBeTrue();
      expect(component.importSettingsForm.get('costCodes')).toBeDefined();
      expect(component.importSettingsForm.get('costTypes')).toBeDefined();
    });
  });

  describe('Save', () => {
    beforeEach(() => {
      importSettingService.postImportSettings.and.returnValue(of(importSettings));
    });

    it('should handle post onboarding state', () => {
      component.ngOnInit();

      workspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.COMPLETE);
      component.isOnboarding = false;

      component.save();

      expect(importSettingService.postImportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      expect(trackingService.trackTimeSpent).toHaveBeenCalledWith(TrackingApp.INTACCT, Page.IMPORT_SETTINGS_INTACCT, jasmine.any(Date));
      expect(trackingService.intacctUpdateEvent).toHaveBeenCalledWith(
        IntacctUpdateEvent.ADVANCED_SETTINGS_INTACCT,
        {
          phase: ProgressPhase.POST_ONBOARDING,
          oldState: importSettings,
          newState: importSettings
        }
      );
      expect(component.saveInProgress).toBeFalse();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle onboarding state', () => {
      component.ngOnInit();

      workspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.IMPORT_SETTINGS);
      component.isOnboarding = true;

      component.save();

      expect(importSettingService.postImportSettings).toHaveBeenCalled();
      expect(trackingService.integrationsOnboardingCompletion).toHaveBeenCalledWith(TrackingApp.INTACCT, IntacctOnboardingState.IMPORT_SETTINGS, 3, jasmine.any(Object));
      expect(workspaceService.setIntacctOnboardingState).toHaveBeenCalledWith(IntacctOnboardingState.ADVANCED_CONFIGURATION);
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/advanced_settings']);
    });

    it('should handle save error', () => {
      component.ngOnInit();

      importSettingService.postImportSettings.and.returnValue(throwError(() => new Error('Error')));

      component.save();

      expect(importSettingService.postImportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
      expect(component.saveInProgress).toBeFalse();
    });
  });
});