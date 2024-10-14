/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  blankMapping,
  customFieldFormValue
} from '../../intacct.fixture';
import { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';
import { ImportSettingGet, ImportSettingPost, ImportSettings } from 'src/app/core/models/intacct/intacct-configuration/import-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IntacctOnboardingState, IntacctUpdateEvent, Page, ProgressPhase, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { MappingSourceField } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';

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
      declarations: [IntacctC1ImportSettingsComponent],
      imports: [SharedModule, RouterModule.forRoot([]), HttpClientTestingModule, ReactiveFormsModule],
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

  describe('Watchers', () => {
    let isDependentImportEnabledValueChangeSpy: jasmine.Spy;
    let blankExpenseField: FormGroup;
    let costCodesValueChangeSubscription: jasmine.Spy;
    let costTypesValueChangeSubscription: jasmine.Spy;

    beforeEach(() => {
      component.ngOnInit();

      isDependentImportEnabledValueChangeSpy = spyOn(component.importSettingsForm.controls.isDependentImportEnabled.valueChanges, 'subscribe').and.callThrough();
      blankExpenseField = component['createFormGroup'](blankMapping);
      costCodesValueChangeSubscription = spyOn(component.importSettingsForm.controls.costCodes.valueChanges, 'subscribe');
      costTypesValueChangeSubscription = spyOn(component.importSettingsForm.controls.costTypes.valueChanges, 'subscribe');

      spyOn(blankExpenseField.valueChanges, 'subscribe').and.callThrough();
    });

    describe('dependentFieldWatchers', () => {
      beforeEach(() => {
        component['dependentFieldWatchers']();
      });

      it('should setup watchers for dependent fields', () => {
        expect(component.importSettingsForm.controls.isDependentImportEnabled.valueChanges.subscribe).toHaveBeenCalled();
        expect(component.importSettingsForm.controls.costCodes.valueChanges.subscribe).toHaveBeenCalled();
        expect(component.importSettingsForm.controls.costTypes.valueChanges.subscribe).toHaveBeenCalled();
      });

      it('should handle isDependentImportEnabled being set', () => {
        component.importSettingsForm.get('isDependentImportEnabled')?.setValue(true);

        expect(helperService.enableFormField).toHaveBeenCalledWith(component.importSettingsForm, 'costCodes');
        expect(helperService.enableFormField).toHaveBeenCalledWith(component.importSettingsForm, 'costTypes');
        expect(helperService.markControllerAsRequired).toHaveBeenCalledWith(component.importSettingsForm, 'costCodes');
        expect(helperService.markControllerAsRequired).toHaveBeenCalledWith(component.importSettingsForm, 'costTypes');
        expect(component.dependentImportFields[0].isDisabled).toBeFalse();
        expect(component.dependentImportFields[1].isDisabled).toBeFalse();
      });

      it('should handle isDependentImportEnabled being unset', () => {
        component.importSettingsForm.get('isDependentImportEnabled')?.setValue(false);

        expect(helperService.disableFormField).toHaveBeenCalledWith(component.importSettingsForm, 'costCodes');
        expect(helperService.disableFormField).toHaveBeenCalledWith(component.importSettingsForm, 'costTypes');
        expect(helperService.clearValidatorAndResetValue).toHaveBeenCalledWith(component.importSettingsForm, 'costCodes');
        expect(helperService.clearValidatorAndResetValue).toHaveBeenCalledWith(component.importSettingsForm, 'costTypes');
        expect(component.dependentImportFields[0].isDisabled).toBeTrue();
        expect(component.dependentImportFields[1].isDisabled).toBeTrue();
      });
    });

    describe('dependentCostFieldsWatchers', () => {
      beforeEach(() => {
        component['dependentCostFieldsWatchers']('costCodes');
        component['dependentCostFieldsWatchers']('costTypes');
      });

      it('should setup watchers for cost fields', () => {
        expect(component.importSettingsForm.controls.costCodes.valueChanges.subscribe).toHaveBeenCalled();
        expect(component.importSettingsForm.controls.costTypes.valueChanges.subscribe).toHaveBeenCalled();
      });

      it('should handle custom field selection for costCodes', () => {
        component.importSettingsForm.controls.costCodes.setValue({ attribute_type: 'custom_field' });

        expect(component.customFieldType).toBe('costCodes');
        expect(component.customFieldControl).toBe(component.importSettingsForm.controls.costCodes);
      });

      it('should handle custom field selection for costTypes', () => {
        component.importSettingsForm.controls.costTypes.setValue({ attribute_type: 'custom_field' });

        expect(component.customFieldType).toBe('costTypes');
        expect(component.customFieldControl).toBe(component.importSettingsForm.controls.costTypes);
      });

      it('should handle non-custom field selection', () => {
        component.importSettingsForm.controls.costCodes.setValue({ attribute_type: 'some_field' });
        expect(component.dependentImportFields[0].isDisabled).toBeTrue();
      });
    });

    describe('importSettingWatcher', () => {
      beforeEach(() => {
        (component.importSettingsForm.get('expenseFields') as FormArray).controls = [blankExpenseField];
        component['importSettingWatcher']();
      });

      it('should setup watchers for expense fields', () => {
        expect(blankExpenseField.valueChanges.subscribe).toHaveBeenCalled();
      });

      it('should handle custom field selection in expense fields', () => {
        spyOn(blankExpenseField, 'patchValue').and.callThrough();
        blankExpenseField.patchValue({ source_field: 'custom_field' });

        expect(component.customFieldControl).toBe(blankExpenseField);
        expect(blankExpenseField.patchValue).toHaveBeenCalledWith(blankMapping);
      });
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('expenseFieldsGetter should return FormArray', () => {
      expect(component.expenseFieldsGetter instanceof FormArray).toBeTrue();
    });

    it('navigateToPreviousStep should navigate to export settings', () => {
      component.navigateToPreviousStep();
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/export_settings']);
    });

    it('refreshDimensions should call refresh methods and display toast', () => {
      mappingService.refreshSageIntacctDimensions.and.returnValue(of({}));
      mappingService.refreshFyleDimensions.and.returnValue(of({}));

      component.refreshDimensions();

      expect(mappingService.refreshSageIntacctDimensions).toHaveBeenCalled();
      expect(mappingService.refreshFyleDimensions).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage Intacct');
    });

    it('removeFilter should reset source_field and import_to_fyle', () => {
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['controls']);
      mockFormGroup.controls = {
        source_field: jasmine.createSpyObj('AbstractControl', ['patchValue']),
        import_to_fyle: jasmine.createSpyObj('AbstractControl', ['patchValue'])
      };
      component.removeFilter(mockFormGroup);
      expect(mockFormGroup.controls.source_field.patchValue).toHaveBeenCalledWith('');
      expect(mockFormGroup.controls.import_to_fyle.patchValue).toHaveBeenCalledWith(false);
    });

    it('hasDuplicateOption should return true for valid control', () => {
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['controls']);
      mockFormGroup.controls = {
        testControl: { valid: true }
      };
      expect(component.hasDuplicateOption(mockFormGroup, 0, 'testControl')).toBeTrue();
    });

    it('showOrHideAddButton should return correct boolean', () => {
      component.sageIntacctFields = [{ attribute_type: 'TEST' } as ExpenseField];
      (component.importSettingsForm.get('expenseFields') as FormArray).clear();

      expect(component.showOrHideAddButton()).toBeTrue();

      (component.importSettingsForm.get('expenseFields') as FormArray).push(component['createFormGroup']({} as any));

      expect(component.showOrHideAddButton()).toBeFalse();
    });

    it('showPreviewDialog should set isDialogVisible', () => {
      component.showPreviewDialog(true);
      expect(component.isDialogVisible).toBeTrue();
    });

    it('showWarningForDependentFields should set showDependentFieldWarning', () => {
      component.showWarningForDependentFields();
      expect(component.showDependentFieldWarning).toBeTrue();
    });

    it('acceptDependentFieldWarning should handle warning acceptance', () => {
      const mockExpenseField = component['createFormGroup']({ source_field: MappingSourceField.PROJECT } as any);
      (component.importSettingsForm.get('expenseFields') as FormArray).push(mockExpenseField);
      component.acceptDependentFieldWarning({ hasAccepted: false } as ConfigurationWarningOut);
      expect(component.showDependentFieldWarning).toBeFalse();
      expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeTrue();
      expect(component.importSettingsForm.get('costCodes')?.disabled).toBeTrue();
      expect(component.importSettingsForm.get('costTypes')?.disabled).toBeTrue();
    });

    it('addExpenseField should add a new expense field', () => {
      const initialLength = (component.importSettingsForm.get('expenseFields') as FormArray).length;
      component.addExpenseField();
      expect((component.importSettingsForm.get('expenseFields') as FormArray).length).toBe(initialLength + 1);
    });

    it('closeModel should reset customFieldForm and close dialog', () => {
      component.customFieldForm.patchValue({ attribute_type: 'TEST' });
      component.showDialog = true;
      component.closeModel();
      expect(component.customFieldForm.value).toEqual({ attribute_type: null, display_name: null, source_placeholder: null });
      expect(component.showDialog).toBeFalse();
    });

    it('saveCustomField should call saveDependentCustomField when customFieldType is set', () => {
      spyOn(component, 'saveDependentCustomField');
      component.customFieldType = 'TEST';
      component.saveCustomField();
      expect(component.saveDependentCustomField).toHaveBeenCalled();
    });

    it('saveCustomField should call saveFyleExpenseField when customFieldType is not set', () => {
      spyOn(component, 'saveFyleExpenseField');
      component.customFieldType = '';
      component.saveCustomField();
      expect(component.saveFyleExpenseField).toHaveBeenCalled();
    });

    describe('saveDependentCustomField', () => {
      beforeEach(() => {
        component.customFieldForm.patchValue(customFieldFormValue);
        component.customFieldControl = component.importSettingsForm.get('costCodes') as any;
      });

      it('should update form for costCodes', () => {
        component.customFieldType = 'costCodes';
        component.saveDependentCustomField();
        expect(component.costCodeFieldOption[component.costCodeFieldOption.length - 1])
          .toEqual(jasmine.objectContaining(customFieldFormValue));
        expect(component.importSettingsForm.get('costCodes')?.value)
          .toEqual(jasmine.objectContaining(customFieldFormValue));
      });

      it('should update form for non-costCodes', () => {
        component.customFieldType = 'costTypes';
        component.saveDependentCustomField();

        expect(component.costCategoryOption[component.costCodeFieldOption.length - 1])
          .toEqual(jasmine.objectContaining(customFieldFormValue));
        expect(component.importSettingsForm.get('costTypes')?.value)
          .toEqual(jasmine.objectContaining(customFieldFormValue));
      });
    });

    it('saveFyleExpenseField should update fyleFields and expenseFields', () => {
      component.customFieldForm.patchValue(customFieldFormValue);

      const mockExpenseField = component['createFormGroup']({
        destination_field: "CUSTOMER",
        import_to_fyle: false,
        is_custom: false,
        source_field: "",
        source_placeholder: null
      });
      component.customFieldControl = mockExpenseField;

      component.saveFyleExpenseField();

      const customerExpenseField = (component.importSettingsForm.get('expenseFields') as FormArray)
        .controls.filter(field => (
          field.get('destination_field')?.value ===
          component.customFieldControl.get('destination_field')?.value
        ))[0];

      expect(customerExpenseField.value).toEqual(jasmine.objectContaining({
        destination_field: "CUSTOMER",
        source_field: "TEST",
        source_placeholder: "TEST_PLACEHOLDER"
      }));
      expect(component.fyleFields[component.fyleFields.length - 2])
        .toEqual(jasmine.objectContaining(customFieldFormValue));
      expect(component.fyleFields[component.fyleFields.length - 1]).toEqual(component.customFieldOption[0]);
    });
  });
});