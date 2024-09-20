import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QboImportSettingsComponent } from './qbo-import-settings.component';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { 
  mockImportSettings, 
  mockFyleExpenseFields, 
  mockQboFields, 
  mockGeneralSettings,
  mockTaxCodeDestinationAttribute,
  mockImportCodeFieldConfig,
  mockWorkspaceGeneralSettings,
  mockQBOCredential
} from 'src/app/integrations/qbo/qbo.fixture';
import { DefaultImportFields, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';

describe('QboImportSettingsComponent', () => {
  let component: QboImportSettingsComponent;
  let fixture: ComponentFixture<QboImportSettingsComponent>;
  let qboHelperServiceSpy: jasmine.SpyObj<QboHelperService>;
  let importSettingServiceSpy: jasmine.SpyObj<QboImportSettingsService>;
  let qboConnectorServiceSpy: jasmine.SpyObj<QboConnectorService>;
  let mappingServiceSpy: jasmine.SpyObj<MappingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;

  beforeEach(async () => {
    const qboHelperServiceSpyObj = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const helperServiceSpyObj = jasmine.createSpyObj('HelperService', ['markControllerAsRequired']);
    const importSettingServiceSpyObj = jasmine.createSpyObj('QboImportSettingsService', ['getImportSettings', 'postImportSettings', 'getQBOFields', 'getImportCodeFieldConfig']);
    const qboConnectorServiceSpyObj = jasmine.createSpyObj('QboConnectorService', ['getQBOCredentials']);
    const mappingServiceSpyObj = jasmine.createSpyObj('MappingService', ['getFyleFields', 'getDestinationAttributes']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpyObj = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const workspaceServiceSpyObj = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'setOnboardingState']);

    await TestBed.configureTestingModule({
      declarations: [ QboImportSettingsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: QboHelperService, useValue: qboHelperServiceSpyObj },
        { provide: QboImportSettingsService, useValue: importSettingServiceSpyObj },
        { provide: QboConnectorService, useValue: qboConnectorServiceSpyObj },
        { provide: MappingService, useValue: mappingServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: IntegrationsToastService, useValue: toastServiceSpyObj },
        { provide: WorkspaceService, useValue: workspaceServiceSpyObj },
        { provide: HelperService, useValue: helperServiceSpyObj }
      ]
    }).compileComponents();

    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    importSettingServiceSpy = TestBed.inject(QboImportSettingsService) as jasmine.SpyObj<QboImportSettingsService>;
    qboConnectorServiceSpy = TestBed.inject(QboConnectorService) as jasmine.SpyObj<QboConnectorService>;
    mappingServiceSpy = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboImportSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      importSettingServiceSpy.getImportSettings.and.returnValue(of(mockImportSettings));
      mappingServiceSpy.getFyleFields.and.returnValue(of(mockFyleExpenseFields));
      workspaceServiceSpy.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettings));
      qboConnectorServiceSpy.getQBOCredentials.and.returnValue(of(mockQBOCredential));
      mappingServiceSpy.getDestinationAttributes.and.returnValue(of(mockTaxCodeDestinationAttribute));
      importSettingServiceSpy.getQBOFields.and.returnValue(of(mockQboFields));
      importSettingServiceSpy.getImportCodeFieldConfig.and.returnValue(of(mockImportCodeFieldConfig));
      spyOn(component as any, 'setupFormWatchers');
      spyOn(component, 'updateImportCodeFieldConfig');
      spyOn(component as any, 'initializeCustomFieldForm');
      Object.defineProperty(routerSpy, 'url', { value: '/integrations/qbo/onboarding/import_settings' });
    });

    it('should setup the page correctly', () => {
      component.ngOnInit();
      expect(component.isLoading).toBeFalse();
      expect(importSettingServiceSpy.getImportSettings).toHaveBeenCalled();
      expect(mappingServiceSpy.getFyleFields).toHaveBeenCalledWith('v1');
      expect(workspaceServiceSpy.getWorkspaceGeneralSettings).toHaveBeenCalled();
      expect(qboConnectorServiceSpy.getQBOCredentials).toHaveBeenCalled();
      expect(mappingServiceSpy.getDestinationAttributes).toHaveBeenCalled();
      expect(importSettingServiceSpy.getQBOFields).toHaveBeenCalled();
      expect(importSettingServiceSpy.getImportCodeFieldConfig).toHaveBeenCalled();
      expect(component.isOnboarding).toBeTrue();
      expect(component.updateImportCodeFieldConfig).toHaveBeenCalled();
      expect(component['setupFormWatchers']).toHaveBeenCalled();
      expect(component['initializeCustomFieldForm']).toHaveBeenCalledWith(false);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      component.importSettingForm = new FormBuilder().group({
        importCategories: [false],
        importCodeFields: [[]]
      });
      component.qboImportCodeFieldCodeConfig = {
        [DefaultImportFields.ACCOUNT]: false
      };
      spyOn(QBOImportSettingModel, 'constructPayload').and.returnValue({} as any);
    });

    it('should save import settings successfully', () => {
      importSettingServiceSpy.postImportSettings.and.returnValue(of({} as any));
      component.isOnboarding = true;
      component.save();
      expect(component.isSaveInProgress).toBeFalse();
      expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      expect(workspaceServiceSpy.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.ADVANCED_CONFIGURATION);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/advanced_settings']);
    });

    it('should handle error when saving import settings', () => {
      importSettingServiceSpy.postImportSettings.and.returnValue(throwError('Error'));
      component.save();
      expect(component.isSaveInProgress).toBeFalse();
      expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
    });
  });

  describe('saveFyleExpenseField', () => {
    beforeEach(() => {
      component.customFieldForm = new FormBuilder().group({
        attribute_type: ['TEST_FIELD'],
        source_placeholder: ['Test Placeholder']
      });
      component.fyleFields = [];
      component.importSettingForm = new FormBuilder().group({
        expenseFields: new FormBuilder().array([
          new FormBuilder().group({
            source_field: [''],
            destination_field: ['TEST_DESTINATION'],
            import_to_fyle: [true],
            is_custom: [true]
          })
        ])
      });
    });

      it('should save custom Fyle expense field', () => {
        component.customFieldControl = (component.importSettingForm.get('expenseFields') as FormArray).at(0) as FormGroup;
        component.saveFyleExpenseField();
        expect(component.fyleFields.length).toBe(2);
        expect(component.showCustomFieldDialog).toBeFalse();
          });
        });

  describe('refreshDimensions', () => {
    it('should call refreshQBODimensions', () => {
      qboHelperServiceSpy.refreshQBODimensions.and.returnValue(of({}));
      component.refreshDimensions();
      expect(qboHelperServiceSpy.refreshQBODimensions).toHaveBeenCalled();
    });
  });

  describe('navigateToPreviousStep', () => {
    it('should navigate to export settings', () => {
      component.navigateToPreviousStep();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/export_settings']);
    });
  });

  describe('updateImportCodeFields', () => {
    beforeEach(() => {
      component.importSettingForm = new FormBuilder().group({
        importCodeFields: [[]]
      });
      component.qboImportCodeFieldCodeConfig = {};
    });

    it('should add field when enabled', () => {
      component.updateImportCodeFields(true, 'TEST_FIELD');
      expect(component.importSettingForm.get('importCodeFields')?.value).toContain('TEST_FIELD');
    });

    it('should remove field when disabled', () => {
      component.importSettingForm.get('importCodeFields')?.setValue(['TEST_FIELD']);
      component.qboImportCodeFieldCodeConfig['TEST_FIELD'] = true;
      component.updateImportCodeFields(false, 'TEST_FIELD');
      expect(component.importSettingForm.get('importCodeFields')?.value).not.toContain('TEST_FIELD');
    });
  });

  // Add more test cases for other methods and edge cases
});