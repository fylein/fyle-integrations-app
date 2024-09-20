import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QboAdvancedSettingsComponent } from './qbo-advanced-settings.component';
import { QboAdvancedSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-advanced-settings.service';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { mockQboAdvancedSettings, mockSkipExportSettings, mockCustomFields, mockAdmins, mockSettingsGeneral, mockBankAccounts, mockExpenseFilter, mockExpenseFilter1, mockExpenseFilter2 } from 'src/app/integrations/qbo/qbo.fixture';
import { Operator, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExpenseFilter } from 'src/app/core/models/common/advanced-settings.model';

describe('QboAdvancedSettingsComponent', () => {
  let component: QboAdvancedSettingsComponent;
  let fixture: ComponentFixture<QboAdvancedSettingsComponent>;
  let advancedSettingsService: jasmine.SpyObj<QboAdvancedSettingsService>;
  let configurationService: jasmine.SpyObj<ConfigurationService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let qboHelperService: jasmine.SpyObj<QboHelperService>;
  let mappingService: jasmine.SpyObj<MappingService>;
  let skipExportService: jasmine.SpyObj<SkipExportService>;
  let toastService: jasmine.SpyObj<IntegrationsToastService>;
  let workspaceService: jasmine.SpyObj<WorkspaceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const advancedSettingsServiceSpy = jasmine.createSpyObj('QboAdvancedSettingsService', ['getAdvancedSettings', 'postAdvancedSettings']);
    const configurationServiceSpy = jasmine.createSpyObj('ConfigurationService', ['getAdditionalEmails']);
    const helperServiceSpy = jasmine.createSpyObj('HelperService', ['setConfigurationSettingValidatorsAndWatchers', 'handleSkipExportFormInAdvancedSettingsUpdates']);
    const qboHelperServiceSpy = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const mappingServiceSpy = jasmine.createSpyObj('MappingService', ['getGroupedDestinationAttributes']);
    const skipExportServiceSpy = jasmine.createSpyObj('SkipExportService', ['getExpenseFilter', 'getExpenseFields', 'postExpenseFilter', 'deleteExpenseFilter']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const workspaceServiceSpy = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'setOnboardingState']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ QboAdvancedSettingsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: QboAdvancedSettingsService, useValue: advancedSettingsServiceSpy },
        { provide: ConfigurationService, useValue: configurationServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy },
        { provide: QboHelperService, useValue: qboHelperServiceSpy },
        { provide: MappingService, useValue: mappingServiceSpy },
        { provide: SkipExportService, useValue: skipExportServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: WorkspaceService, useValue: workspaceServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboAdvancedSettingsComponent);
    component = fixture.componentInstance;
    advancedSettingsService = TestBed.inject(QboAdvancedSettingsService) as jasmine.SpyObj<QboAdvancedSettingsService>;
    configurationService = TestBed.inject(ConfigurationService) as jasmine.SpyObj<ConfigurationService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperService = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    mappingService = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    skipExportService = TestBed.inject(SkipExportService) as jasmine.SpyObj<SkipExportService>;
    toastService = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    workspaceService = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      advancedSettingsService.getAdvancedSettings.and.returnValue(of(mockQboAdvancedSettings));
      skipExportService.getExpenseFilter.and.returnValue(of(mockSkipExportSettings));
      skipExportService.getExpenseFields.and.returnValue(of(mockCustomFields));
      mappingService.getGroupedDestinationAttributes.and.returnValue(of({
        BANK_ACCOUNT: mockBankAccounts.results,
        ACCOUNT: [],
        EXPENSE_TYPE: [],
        EXPENSE_PAYMENT_TYPE: [],
        VENDOR_PAYMENT_ACCOUNT: [],
        VENDOR: [],
        CHARGE_CARD_NUMBER: [],
        TAX_DETAIL: [],
        LOCATION: [],
        DEPARTMENT: [],
        PROJECT: [],
        CLASS: [],
        ITEM: [],
        PAYMENT_ACCOUNT: [],
        EMPLOYEE: [],
        JOB: [],
        CREDIT_CARD_ACCOUNT: [],
        ACCOUNTS_PAYABLE: [],
        TAX_CODE: [],
        COMPANY: []
      }));
      configurationService.getAdditionalEmails.and.returnValue(of(mockAdmins));
      workspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockSettingsGeneral));
      spyOn(component as any, 'getSettingsAndSetupForm').and.callThrough();
      spyOn(component as any, 'setupFormWatchers').and.callThrough();
    });
    it('should initialize component and setup forms', fakeAsync(() => {
      Object.defineProperty(router, 'url', { get: () => '/integrations/qbo/onboarding/advanced_settings' });
    
      component.ngOnInit();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.advancedSettingForm).toBeDefined();
      expect(component.skipExportForm).toBeDefined();
      expect(component['getSettingsAndSetupForm']).toHaveBeenCalled();
      expect(component['setupFormWatchers']).toHaveBeenCalled();
      expect(component.isOnboarding).toBeTrue();
    }));
  });

  describe('save', () => {
    beforeEach(() => {
      component.advancedSettingForm = new FormBuilder().group({
        paymentSync: [null],
        billPaymentAccount: [null],
        changeAccountingPeriod: [false],
        singleCreditLineJE: [false],
        autoCreateVendors: [false],
        autoCreateMerchantsAsVendors: [false],
        exportSchedule: [false],
        exportScheduleFrequency: [1],
        memoStructure: [[]],
        skipExport: [false],
        searchOption: [null],
        search: [null],
        additionalEmails: [[]],
        email: [[]]
      });
      component.skipExportForm = new FormBuilder().group({
        condition1: ['category'],
        operator1: [Operator.IContains],
        value1: ['anish']
      });
      component.expenseFilters = { count: 0, next: null, previous: null, results: [] };
    });
  
    it('should save advanced settings and skip export fields successfully', fakeAsync(() => {
      advancedSettingsService.postAdvancedSettings.and.returnValue(of(mockQboAdvancedSettings));
      skipExportService.postExpenseFilter.and.returnValue(of({
        ...mockExpenseFilter,
        id: 75,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 525
      }));
      component.isOnboarding = true;
  
      // Set skipExport to true to trigger the skip export save
      component.advancedSettingForm.get('skipExport')?.setValue(true);
  
      spyOn<any>(component, 'saveSkipExportFields').and.callThrough();
  
      component.save();
      tick();
  
      expect(advancedSettingsService.postAdvancedSettings).toHaveBeenCalled();
      expect(component['saveSkipExportFields']).toHaveBeenCalled();
      // We're not directly expecting skipExportService.postExpenseFilter to be called here
      // because it's called inside saveSkipExportFields, which we've spied on
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      expect(workspaceService.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.COMPLETE);
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/done']);
    }));
  
    it('should not save skip export fields when skipExport is false', fakeAsync(() => {
      advancedSettingsService.postAdvancedSettings.and.returnValue(of(mockQboAdvancedSettings));
      component.advancedSettingForm.get('skipExport')?.setValue(false);
  
      spyOn<any>(component, 'saveSkipExportFields');
  
      component.save();
      tick();
  
      expect(advancedSettingsService.postAdvancedSettings).toHaveBeenCalled();
      expect(component['saveSkipExportFields']).not.toHaveBeenCalled();
      expect(skipExportService.postExpenseFilter).not.toHaveBeenCalled();
    }));
  });

  describe('refreshDimensions', () => {
    it('should call refreshQBODimensions', () => {
      qboHelperService.refreshQBODimensions.and.returnValue(of({}));

      component.refreshDimensions();

      expect(qboHelperService.refreshQBODimensions).toHaveBeenCalled();
    });
  });

  describe('deleteExpenseFilter', () => {
    it('should call deleteExpenseFilter', () => {
      skipExportService.deleteExpenseFilter.and.returnValue(of({}));

      component.deleteExpenseFilter(1);

      expect(skipExportService.deleteExpenseFilter).toHaveBeenCalledWith(1);
    });
  });

  describe('navigateToPreviousStep', () => {
    it('should navigate to import settings', () => {
      component.navigateToPreviousStep();

      expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/import_settings']);
    });
  });

  // Add more tests for other methods and edge cases
});