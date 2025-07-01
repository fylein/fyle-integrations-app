/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  mockTaxCodeDestinationAttribute,
  mockImportCodeFieldConfig,
  mockWorkspaceGeneralSettings,
  mockQBOCredential,
  mockImportCodeSelectorOptions
} from 'src/app/integrations/qbo/qbo.fixture';
import { DefaultImportFields, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';

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
  let translocoService: jasmine.SpyObj<TranslocoService>;
  beforeEach(async () => {
    const qboHelperServiceSpyObj = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const helperServiceSpyObj = jasmine.createSpyObj('HelperService', ['markControllerAsRequired']);
    const importSettingServiceSpyObj = jasmine.createSpyObj('QboImportSettingsService', ['getImportSettings', 'postImportSettings', 'getQBOFields', 'getImportCodeFieldConfig', 'getImportCodeField', 'constructPayload', 'getCustomFieldOption', 'getChartOfAccountTypesList', 'mapAPIResponseToFormGroup']);
    const qboConnectorServiceSpyObj = jasmine.createSpyObj('QboConnectorService', ['getQBOCredentials']);
    const mappingServiceSpyObj = jasmine.createSpyObj('MappingService', ['getFyleFields', 'getDestinationAttributes']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpyObj = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const workspaceServiceSpyObj = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'setOnboardingState']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

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
        { provide: HelperService, useValue: helperServiceSpyObj },
        { provide: TranslocoService, useValue: translocoServiceSpy }
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
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboImportSettingsComponent);
    component = fixture.componentInstance;

    component.importSettingForm = new FormBuilder().group({
      importCategories: [false],
      importCodeFields: [[]],
      taxCode: [false],
      defaultTaxCode: [''],
      chartOfAccountTypes: [['Expense', 'Other Expense']],
      importCategoryCode: [''],
      expenseFields: new FormArray([])
    });

    component.customFieldForm = new FormBuilder().group({
      attribute_type: [''],
      display_name: [''],
      source_placeholder: ['']
    });
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

    it('should set isTaxGroupSyncAllowed to true for non-US country', () => {
      const nonUSCredential = { ...mockQBOCredential, country: 'CA' };
      qboConnectorServiceSpy.getQBOCredentials.and.returnValue(of(nonUSCredential));

      component.ngOnInit();

      expect(component.isTaxGroupSyncAllowed).toBeTrue();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      component.qboImportCodeFieldCodeConfig = {
        [DefaultImportFields.ACCOUNT]: false
      };
      importSettingServiceSpy.constructPayload.and.returnValue({} as any);
    });

    it('should save import settings successfully', () => {
      importSettingServiceSpy.postImportSettings.and.returnValue(of({} as any));
      translocoService.translate.and.returnValue('Import settings saved successfully');
      component.isOnboarding = true;
      component.save();
      expect(component.isSaveInProgress).toBeFalse();
      expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      expect(workspaceServiceSpy.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.ADVANCED_CONFIGURATION);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/advanced_settings']);
    });

    it('should handle error when saving import settings', () => {
      translocoService.translate.and.returnValue('Error saving import settings, please try again later');
      importSettingServiceSpy.postImportSettings.and.returnValue(throwError('Error'));
      component.save();
      expect(component.isSaveInProgress).toBeFalse();
      expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
    });
  });

  describe('saveFyleExpenseField', () => {
    beforeEach(() => {
      component.customFieldForm.patchValue({
        attribute_type: 'TEST_FIELD',
        source_placeholder: 'Test Placeholder'
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
        component.customFieldOption = [{ attribute_type: 'custom_field', display_name: 'Test Field', source_placeholder: null, is_dependent: false }];

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

  describe('closeModel', () => {
    beforeEach(() => {
      component.customFieldForm.patchValue({
        attribute_type: 'EMPLOYEE',
        source_placeholder: 'Anish'
      });
      component.showCustomFieldDialog = true;
    });

    it('should reset the form and close the dialog', () => {
      component.closeModel();

      expect(component.customFieldForm.get('attribute_type')?.value).toBeNull();
      expect(component.customFieldForm.get('source_placeholder')?.value).toBeNull();
      expect(component.showCustomFieldDialog).toBeFalse();
    });
  });

  describe('showPreviewDialog', () => {
    it('should set isPreviewDialogVisible to true when called with true', () => {
      component.isPreviewDialogVisible = false;
      component.showPreviewDialog(true);
      expect(component.isPreviewDialogVisible).toBeTrue();
    });

    it('should set isPreviewDialogVisible to false when called with false', () => {
      component.isPreviewDialogVisible = true;
      component.showPreviewDialog(false);
      expect(component.isPreviewDialogVisible).toBeFalse();
    });
  });

  describe('closeDialog', () => {
    it('should set isPreviewDialogVisible to false', () => {
      // Arrange
      component.isPreviewDialogVisible = true;

      // Act
      component.closeDialog();

      // Assert
      expect(component.isPreviewDialogVisible).toBeFalse();
    });
  });

  describe('getImportCodeSelectorOptions', () => {
    beforeEach(() => {
      component.importCodeSelectorOptions = mockImportCodeSelectorOptions;
    });

    it('should return correct options for a given destination field', () => {
      const accountOptions = component.getImportCodeSelectorOptions('ACCOUNT');
      expect(accountOptions).toEqual([
        { label: 'Import Codes + Names', value: true, subLabel: '4567 Meals & Entertainment' },
        { label: 'Import Names only', value: false, subLabel: 'Meals & Entertainment' }
      ]);
    });
  });

  describe('updateImportCodeFieldConfig', () => {
    beforeEach(() => {
      component.importSettingForm.patchValue({
        importCategories: true,
        importCodeFields: []
      });
      component.qboImportCodeFieldCodeConfig = {
        [DefaultImportFields.ACCOUNT]: true
      };
    });

    it('should set ACCOUNT import code field to false when importCategories is true', () => {
      component.updateImportCodeFieldConfig();
      expect(component.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]).toBeFalse();
    });

    it('should not change ACCOUNT import code field when importCategories is false', () => {
      component.importSettingForm.patchValue({ importCategories: false });
      component.updateImportCodeFieldConfig();
      expect(component.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]).toBeTrue();
    });

    it('should not change ACCOUNT import code field when it is initially false', () => {
      component.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT] = false;
      component.updateImportCodeFieldConfig();
      expect(component.qboImportCodeFieldCodeConfig[DefaultImportFields.ACCOUNT]).toBeFalse();
    });
  });

  describe('initializeCustomFieldForm', () => {
    let formBuilder: FormBuilder;
    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
      component.customFieldForm.patchValue({
        attribute_type: 'TEST_TYPE',
        display_name: 'Test Display Name',
        source_placeholder: 'Test Placeholder'
      });
      component.showCustomFieldDialog = false;
    });

    it('should reset the form and set showCustomFieldDialog to true when called with true', () => {
      component['initializeCustomFieldForm'](true);

      expect(component.customFieldForm.get('attribute_type')?.value).toBeNull();
      expect(component.customFieldForm.get('display_name')?.value).toBeNull();
      expect(component.customFieldForm.get('source_placeholder')?.value).toBeNull();
      expect(component.showCustomFieldDialog).toBeTrue();
    });

    it('should reset the form and set showCustomFieldDialog to false when called with false', () => {
      component['initializeCustomFieldForm'](false);

      expect(component.customFieldForm.get('attribute_type')?.value).toBeNull();
      expect(component.customFieldForm.get('display_name')?.value).toBeNull();
      expect(component.customFieldForm.get('source_placeholder')?.value).toBeNull();
      expect(component.showCustomFieldDialog).toBeFalse();
    });
  });

  describe('createTaxCodeWatcher', () => {
    beforeEach(() => {
      component.importSettingForm.patchValue({
        taxCode: false,
        defaultTaxCode: ''
      });
      component['createTaxCodeWatcher']();
    });

    it('should set defaultTaxCode as required when taxCode is enabled', () => {
      component.importSettingForm.controls.taxCode.setValue(true);
      expect(component.importSettingForm.controls.defaultTaxCode.hasValidator(Validators.required)).toBeTrue();
    });

    it('should clear validators and reset defaultTaxCode when taxCode is disabled', () => {
      component.importSettingForm.controls.taxCode.setValue(true);
      component.importSettingForm.controls.defaultTaxCode.setValue('SOME_TAX_CODE');

      component.importSettingForm.controls.taxCode.setValue(false);
      expect(component.importSettingForm.controls.defaultTaxCode.hasValidator(Validators.required)).toBeFalse();
      expect(component.importSettingForm.controls.defaultTaxCode.value).toBeNull();
    });
  });

  describe('createCOAWatcher', () => {
    beforeEach(() => {
      component.importSettingForm.patchValue({
        importCategories: true,
        chartOfAccountTypes: ['Expense', 'Other Expense'],
        importCategoryCode: ''
      });
      component.importSettings = mockImportSettings;
      component.qboImportCodeFieldCodeConfig = mockImportCodeFieldConfig;
      importSettingServiceSpy.getImportCodeField.and.returnValue(false);
      component['createCOAWatcher']();
    });

    it('should update form when importCategories is disabled', () => {
      component.importSettingForm.controls.importCategories.setValue(false);

      expect(component.importSettingForm.controls.chartOfAccountTypes.value).toEqual(['Expense']);
      expect(component.importSettingForm.controls.importCategoryCode.validator).toBeNull();
      expect(importSettingServiceSpy.getImportCodeField).toHaveBeenCalled();
    });

    it('should mark importCategoryCode as required when importCategories is enabled', () => {
      const markControllerAsRequiredSpy = helperServiceSpy.markControllerAsRequired as jasmine.Spy;
      markControllerAsRequiredSpy.calls.reset();

      component.importSettingForm.controls.importCategories.setValue(true);

      expect(markControllerAsRequiredSpy).toHaveBeenCalledWith(component.importSettingForm, 'importCategoryCode');
    });
  });

  describe('importCategroyCodeWatcher', () => {
    beforeEach(() => {
      component.importSettingForm.patchValue({
        importCategories: true,
        importCategoryCode: false
      });
      spyOn(component, 'updateImportCodeFields');
      component['importCategroyCodeWatcher']();
    });

    it('should call updateImportCodeFields with true when importCategoryCode is true', () => {
      component.importSettingForm.controls.importCategoryCode.setValue(true);

      expect(component.updateImportCodeFields).toHaveBeenCalledWith(true, DefaultImportFields.ACCOUNT);
    });

    it('should call updateImportCodeFields with false when importCategoryCode is false', () => {
      component.importSettingForm.controls.importCategoryCode.setValue(false);

      expect(component.updateImportCodeFields).toHaveBeenCalledWith(false, DefaultImportFields.ACCOUNT);
    });

    it('should still call updateImportCodeFields when importCategories is false', () => {
      component.importSettingForm.controls.importCategories.setValue(false);
      (component.updateImportCodeFields as jasmine.Spy).calls.reset();

      component.importSettingForm.controls.importCategoryCode.setValue(true);

      expect(component.updateImportCodeFields).toHaveBeenCalledWith(true, DefaultImportFields.ACCOUNT);
    });
  });

  describe('setupFormWatchers', () => {
    let mockControl: FormGroup;

    beforeEach(() => {
      spyOn(component as any, 'createTaxCodeWatcher');
      spyOn(component as any, 'createCOAWatcher');
      spyOn(component as any, 'importCategroyCodeWatcher');
      spyOn(component as any, 'initializeCustomFieldForm');

      mockControl = new FormBuilder().group({
        source_field: [''],
        destination_field: [''],
        import_to_fyle: [false],
        is_custom: [false],
        source_placeholder: ['']
      });

      (component.importSettingForm.get('expenseFields') as FormArray).push(mockControl);
    });

    it('should call all watcher setup functions', () => {
      component['setupFormWatchers']();

      expect((component as any).createTaxCodeWatcher).toHaveBeenCalled();
      expect((component as any).createCOAWatcher).toHaveBeenCalled();
      expect((component as any).importCategroyCodeWatcher).toHaveBeenCalled();
    });

    it('should set up watchers for each expense field', () => {
      component['setupFormWatchers']();

      mockControl.patchValue({ source_field: 'custom_field' });
      expect(component.customFieldType).toBe('');
      expect(component.customFieldControl).toBe(mockControl);
    });

    it('should not initialize custom field form for non-custom fields', () => {
      component['setupFormWatchers']();

      mockControl.patchValue({ source_field: 'regular_field' });
      expect((component as any).initializeCustomFieldForm).not.toHaveBeenCalled();
    });
  });
});