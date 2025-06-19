/* eslint-disable dot-notation */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { blankMapping, configuration, costCodeFieldValue, costTypeFieldValue, customField, customFieldValue, fyleFields, groupedDestinationAttributes, importSettings, importSettingsWithProjectMapping, intacctImportCodeConfig, locationEntityMapping, sageIntacctFields, sageIntacctFieldsSortedByPriority, settingsWithDependentFields } from '../../intacct.fixture';
import { IntacctCategoryDestination, IntacctOnboardingState, IntacctUpdateEvent, MappingSourceField, Page, ProgressPhase, SageIntacctField, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Org } from 'src/app/core/models/org/org.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IntacctSharedModule } from '../intacct-shared.module';
import { ExpenseField } from 'src/app/core/models/intacct/db/expense-field.model';
import { IntacctConfiguration } from 'src/app/core/models/db/configuration.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';

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
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const siImportSettingServiceSpy = jasmine.createSpyObj('SiImportSettingService', ['getImportSettings', 'postImportSettings', 'getImportCodeFieldConfig']);
    const siMappingsServiceSpy = jasmine.createSpyObj('SiMappingsService', ['getSageIntacctFields', 'getFyleFields', 'getGroupedDestinationAttributes', 'getConfiguration', 'refreshSageIntacctDimensions', 'refreshFyleDimensions']);
    const intacctConnectorServiceSpy = jasmine.createSpyObj('IntacctConnectorService', ['getLocationEntityMapping']);
    const orgServiceSpy = jasmine.createSpyObj('OrgService', ['getCachedOrg']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['integrationsOnboardingCompletion', 'intacctUpdateEvent', 'trackTimeSpent']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['get']);
    const siWorkspaceServiceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getIntacctOnboardingState', 'setIntacctOnboardingState']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en')
    });
    
    await TestBed.configureTestingModule({
    declarations: [IntacctImportSettingsComponent],
    imports: [SharedModule, IntacctSharedModule, ReactiveFormsModule, RouterModule.forRoot([])],
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
        { provide: TranslocoService, useValue: translocoServiceSpy },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    spyOn(router, 'navigate');
    routerUrlSpy = spyOnProperty(router, 'url').and.returnValue('/onboarding');
    siImportSettingService.getImportSettings.and.returnValue(of(importSettings));
    siImportSettingService.getImportCodeFieldConfig.and.returnValue(of(intacctImportCodeConfig));
    siMappingsService.getSageIntacctFields.and.returnValue(of(sageIntacctFields));
    siMappingsService.getFyleFields.and.returnValue(of(fyleFields));
    siMappingsService.getGroupedDestinationAttributes.and.returnValue(of(groupedDestinationAttributes));
    siMappingsService.getConfiguration.and.returnValue(of(configuration));
    siMappingsService.refreshSageIntacctDimensions.and.returnValue(of(''));
    siMappingsService.refreshFyleDimensions.and.returnValue(of(''));
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
        expect(component.importSettingsForm.get('costCodesImportToggle')).toBeTruthy();
        expect(component.importSettingsForm.get('costTypesImportToggle')).toBeTruthy();
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
        siImportSettingService.getImportSettings.and.returnValue(of(importSettingsWithProjectMapping));

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
      translocoService.translate.and.returnValue('Import settings saved successfully');

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
      translocoService.translate.and.returnValue('Import settings saved successfully');
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
      translocoService.translate.and.returnValue('Error saving import settings, please try again later');
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
      translocoService.translate.and.returnValue('Import settings saved successfully');
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

  describe('Watchers', () => {
    describe('Import Settings Watcher', () => {
      beforeEach(() => {
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should trigger custom field dialog when a source field is set to custom_field', () => {
        const expenseFieldArray = component.importSettingsForm.get('expenseFields') as FormArray;
        spyOn(component as any, 'addCustomField').and.callThrough();

        const firstControl = expenseFieldArray.at(0);
        firstControl.patchValue({
          source_field: 'custom_field',
          destination_field: 'TEST_FIELD',
          import_to_fyle: true
        });

        expect(component['addCustomField']).toHaveBeenCalled();
        expect(component.showDialog).toBeTrue();
        expect(component.customFieldControl).toEqual(firstControl);
      });

      it('should update validators when importTaxCodes value changes', () => {
        const taxCodesControl = component.importSettingsForm.get('sageIntacctTaxCodes');

        component.importSettingsForm.patchValue({
          importTaxCodes: true
        });
        expect(taxCodesControl?.hasValidator(Validators.required)).toBeTrue();

        component.importSettingsForm.patchValue({
          importTaxCodes: false
        });
        expect(taxCodesControl?.hasValidator(Validators.required)).toBeFalse();
      });
    });

    describe('Cost Codes and Cost Types Watcher', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should handle isDependentImportEnabled changes', () => {
        const costCodesControl = component.importSettingsForm.get('costCodes');
        const costTypesControl = component.importSettingsForm.get('costTypes');

        component.importSettingsForm.patchValue({
          isDependentImportEnabled: true
        });

        expect(costCodesControl?.enabled).toBeTrue();
        expect(costTypesControl?.enabled).toBeFalse();
        expect(costCodesControl?.hasValidator(Validators.required)).toBeTrue();

        component.importSettingsForm.patchValue({
          isDependentImportEnabled: false
        });

        expect(costCodesControl?.enabled).toBeTrue();
        expect(costTypesControl?.enabled).toBeFalse();
        expect(costCodesControl?.hasValidator(Validators.required)).toBeFalse();
      });

      it('should handle custom field selection for cost codes', () => {
        spyOn(component as any, 'addCustomField').and.callThrough();

        component.importSettingsForm.patchValue({
          costCodes: {
            attribute_type: 'custom_field',
            source_field: 'custom_field'
          }
        });

        expect(component['addCustomField']).toHaveBeenCalled();
        expect(component.customFieldForDependentField).toBeTrue();
        expect(component.customFieldControl).toBe(component.importSettingsForm.get('costCodes')!);
        expect(component.importSettingsForm.get('costCodes')?.value.source_field).toBeNull();
      });

      it('should handle custom field selection for cost types', () => {
        spyOn(component as any, 'addCustomField').and.callThrough();

        component.importSettingsForm.patchValue({
          costTypes: {
            attribute_type: 'custom_field',
            source_field: 'custom_field'
          }
        });

        expect(component['addCustomField']).toHaveBeenCalled();
        expect(component.customFieldForDependentField).toBeTrue();
        expect(component.customFieldControl).toBe(component.importSettingsForm.get('costTypes')!);
        expect(component.importSettingsForm.get('costTypes')?.value.source_field).toBeNull();
      });
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('importCodeFieldGetter should return a valid FormArray', () => {
      expect(component.importCodeFieldGetter instanceof FormArray).toBeTrue();
    });

    it('addImportCodeField should add and remove fields correctly', () => {
      const sourceField = IntacctCategoryDestination.ACCOUNT;

      component.addImportCodeField({ checked: true }, sourceField);
      expect(component.importCodeFieldGetter.length).toBe(1);

      component.addImportCodeField({ checked: false }, sourceField);
      expect(component.importCodeFieldGetter.length).toBe(0);
    });

    it('getFormGroup should return FormGroup', () => {
      const formGroup = component['formBuilder'].group({
        test: ['value']
      });
      expect(component.getFormGroup(formGroup) instanceof FormGroup).toBeTrue();
    });

    it('getDestinationField should correctly transform field names', () => {
      expect(component.getDestinationField('category')).toBe('categories');
      expect(component.getDestinationField('tax')).toBe('taxes');
      expect(component.getDestinationField('match')).toBe('matches');
      expect(component.getDestinationField('import')).toBe('imports');
    });

    it('refreshDimensions should call refresh services and show toast', fakeAsync(() => {
      translocoService.translate.and.returnValue('Syncing data dimensions from Sage Intacct');
      tick();

      component.refreshDimensions(true);
      expect(siMappingsService.refreshSageIntacctDimensions).toHaveBeenCalled();
      expect(siMappingsService.refreshFyleDimensions).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(
        ToastSeverity.SUCCESS,
        'Syncing data dimensions from Sage Intacct'
      );
    }));

    it('removeFilter should reset form controls', () => {
      const formGroup = component['formBuilder'].group({
        source_field: ['test'],
        import_to_fyle: [true],
        destination_field: ['ACCOUNT']
      });
      spyOn(component, 'addImportCodeField');

      component.removeFilter(formGroup);

      expect(formGroup.get('source_field')?.value).toBe('');
      expect(formGroup.get('import_to_fyle')?.value).toBeFalse();
      expect(component.addImportCodeField).toHaveBeenCalledWith(
        { checked: false },
        'ACCOUNT'
      );
    });

    it('hasDuplicateOption should check control validity', () => {
      const formGroup = component['formBuilder'].group({
        testControl: ['value']
      });
      expect(component.hasDuplicateOption(formGroup, 0, 'testControl')).toBeTrue();
    });

    it('showOrHideAddButton should return correct visibility', () => {
      component.sageIntacctFields = [];
      expect(component.showOrHideAddButton()).toBeTrue();

      for (let i = 0; i < component.importSettingsForm.controls.expenseFields.value.length; i++) {
        component.sageIntacctFields.push({} as ExpenseField);
      }
      expect(component.showOrHideAddButton()).toBeFalse();
    });

    it('showPreviewDialog should set dialog visibility', () => {
      component.showPreviewDialog(true);
      expect(component.isDialogVisible).toBeTrue();

      component.showPreviewDialog(false);
      expect(component.isDialogVisible).toBeFalse();
    });

    it('addExpenseField should add new expense field', () => {
      const initialLength = component.expenseFieldsGetter.length;
      component.addExpenseField();
      expect(component.expenseFieldsGetter.length).toBe(initialLength + 1);
    });

    it('closeModel should close the dialog and reset the form and the source field', () => {
      component.customFieldForm = component['formBuilder'].group({
        testField: ['value']
      });
      component.customFieldControl = component['createFormGroup'](blankMapping);
      component.showDialog = true;

      component.closeModel();

      expect(component.customFieldControl.get('source_field')?.value).toBeNull();
      expect(component.customFieldForm.get('testField')?.value).toBeNull();
      expect(component.showDialog).toBeFalse();
    });

    describe('saveCustomField', () => {

      it('should handle dependent field creation', () => {
        component.customFieldForDependentField = true;
        component.customFieldForm = component['formBuilder'].group({
          attribute_type: ['Test Field'],
          source_placeholder: ['Test Placeholder']
        });
        component['isCostCodeFieldSelected'] = true;
        component.customFieldControl = component.importSettingsForm.get('costCodes') as AbstractControl;

        component.saveCustomField();

        expect(component.costCodeFieldOption.length).toBeGreaterThan(1);
        expect(component.showDialog).toBeFalse();
      });

      it('should handle non-dependent field creation', () => {
        component.customFieldForDependentField = false;
        component.customFieldForm = component['formBuilder'].group({
          attribute_type: ['Test Field'],
          source_placeholder: ['Test Placeholder']
        });
        spyOn(component.customFieldForm, 'reset').and.callThrough();
        component.customFieldControl = component['createFormGroup'](customFieldValue);

        component.saveCustomField();

        expect(component.customField).toEqual(customField);
        expect(component.fyleFields[component.fyleFields.length - 2]).toEqual(customField);
        expect(component.fyleFields[component.fyleFields.length - 1]).toEqual(component.customFieldOption[0]);
        expect(component.customFieldForm.reset).toHaveBeenCalled();
      });
    });

    it('updateDependentField should handle dependent field updates', () => {
      component.importSettingsForm.patchValue({
        isDependentImportEnabled: true
      });

      component.updateDependentField('DEPARTMENT', true);
      expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeFalse();

      component.updateDependentField('PROJECT', true);
      expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeFalse();
    });

    it('onDropdownChange should handle dependent fields', () => {
      const expenseFieldsArray = component.importSettingsForm.get('expenseFields') as FormArray;
      expenseFieldsArray.push(component['formBuilder'].group({
        import_to_fyle: [true],
        destination_field: ['TEST_FIELD']
      }));

      component.fyleFields = [{
        attribute_type: 'DEPENDENT_FIELD',
        is_dependent: true
      } as ExpenseField];

      component.onDropdownChange({ value: 'DEPENDENT_FIELD' }, 0);

      expect(expenseFieldsArray.at(0).get('import_to_fyle')?.value).toBeFalse();
      expect(expenseFieldsArray.at(0).get('import_to_fyle')?.disabled).toBeTrue();
    });

    it('acceptDependentFieldWarning should handle warning being rejected', () => {
      const expenseFieldsArray = component.importSettingsForm.get('expenseFields') as FormArray;
      const newExpenseField = component['formBuilder'].group({
        source_field: [MappingSourceField.PROJECT],
        destination_field: ['TEST_FIELD'],
        import_to_fyle: [false],
        is_custom: [false]
      });
      expenseFieldsArray.push(newExpenseField);

      component.acceptDependentFieldWarning(false);

      expect(newExpenseField.get('import_to_fyle')?.value).toBeTrue();
      expect(component.importSettingsForm.get('isDependentImportEnabled')?.value).toBeTrue();
      expect(component.importSettingsForm.get('costCodes')?.disabled).toBeTrue();
      expect(component.importSettingsForm.get('costTypes')?.disabled).toBeTrue();
    });

    it('showWarningForDependentFields should show warning dialog', () => {
      const formGroup = component['formBuilder'].group({
        source_field: [MappingSourceField.PROJECT],
        destination_field: ['TEST_FIELD']
      });

      component.costCodeFieldOption = [{ attribute_type: 'existing_field' } as ExpenseField];
      component.costTypeFieldOption = [{ attribute_type: 'existing_field' } as ExpenseField];

      component.showWarningForDependentFields({ checked: false }, formGroup);

      expect(component.showDependentFieldWarning).toBeTrue();
    });
  });
});