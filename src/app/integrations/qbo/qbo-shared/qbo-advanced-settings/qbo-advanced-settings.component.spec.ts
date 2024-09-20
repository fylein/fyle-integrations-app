/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AutoMapEmployeeOptions, EmployeeFieldMapping, NameInJournalEntry, Operator, QBOCorporateCreditCardExpensesObject, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AdvancedSettingsModel, ExpenseFilter, SkipExportModel } from 'src/app/core/models/common/advanced-settings.model';

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

    component.skipExportForm = new FormBuilder().group({
      condition1: [mockExpenseFilter.condition],
      operator1: [mockExpenseFilter.operator],
      value1: [mockExpenseFilter.values[0]],
      condition2: [''],
      operator2: [''],
      value2: [''],
      join_by: ['']
    });
    component.expenseFilters = mockSkipExportSettings;
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

    it('should concatenate additional email options', fakeAsync(() => {
      const mockAdditionalEmails = [
        { name: 'Additional User', email: 'additional@example.com' }
      ];
      const mockAdvancedSettingsWithAdditionalEmails = {
        ...mockQboAdvancedSettings,
        workspace_schedules: {
          ...mockQboAdvancedSettings.workspace_schedules,
          additional_email_options: mockAdditionalEmails
        }
      };

      advancedSettingsService.getAdvancedSettings.and.returnValue(of(mockAdvancedSettingsWithAdditionalEmails));
      Object.defineProperty(router, 'url', { get: () => '/integrations/qbo/onboarding/advanced_settings' });

      component.ngOnInit();
      tick();

      expect(component.adminEmails).toEqual([...mockAdmins, ...mockAdditionalEmails]);
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
      // Because it's called inside saveSkipExportFields, which we've spied on
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

    it('should handle error when saving advanced settings', fakeAsync(() => {
      advancedSettingsService.postAdvancedSettings.and.returnValue(throwError('Error'));
      component.isOnboarding = true;

      component.save();
      tick();

      expect(advancedSettingsService.postAdvancedSettings).toHaveBeenCalled();
      expect(component.isSaveInProgress).toBeFalse();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(
        ToastSeverity.ERROR,
        'Error saving advanced settings, please try again later'
      );
      expect(workspaceService.setOnboardingState).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
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

  describe('isAutoCreateVendorsFieldVisible', () => {
    it('should return true when conditions are met', () => {
      component.workspaceGeneralSettings = {
        employee_field_mapping: EmployeeFieldMapping.VENDOR,
        auto_map_employees: AutoMapEmployeeOptions.NAME
      } as any;
      expect(component.isAutoCreateVendorsFieldVisible()).toBeTrue();
    });

    it('should return false when employee_field_mapping is not VENDOR', () => {
      component.workspaceGeneralSettings = {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployeeOptions.NAME
      } as any;
      expect(component.isAutoCreateVendorsFieldVisible()).toBeFalse();
    });

    it('should return false when auto_map_employees is null', () => {
      component.workspaceGeneralSettings = {
        employee_field_mapping: EmployeeFieldMapping.VENDOR,
        auto_map_employees: null
      } as any;
      expect(component.isAutoCreateVendorsFieldVisible()).toBeFalse();
    });

    it('should return false when auto_map_employees is EMPLOYEE_CODE', () => {
      component.workspaceGeneralSettings = {
        employee_field_mapping: EmployeeFieldMapping.VENDOR,
        auto_map_employees: AutoMapEmployeeOptions.EMPLOYEE_CODE
      } as any;
      expect(component.isAutoCreateVendorsFieldVisible()).toBeFalse();
    });
  });

  describe('isPaymentSyncFieldVisible', () => {
    it('should return true when reimbursable_expenses_object is BILL', () => {
      component.workspaceGeneralSettings = {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.BILL
      } as any;
      expect(component.isPaymentSyncFieldVisible()).toBeTrue();
    });

    it('should return false when reimbursable_expenses_object is not BILL', () => {
      component.workspaceGeneralSettings = {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.CHECK
      } as any;
      expect(component.isPaymentSyncFieldVisible()).toBeFalse();
    });
  });

  describe('isSingleCreditLineJEFieldVisible', () => {
    it('should return true when reimbursable_expenses_object is JOURNAL_ENTRY', () => {
      component.workspaceGeneralSettings = {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.JOURNAL_ENTRY,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      } as any;
      expect(component.isSingleCreditLineJEFieldVisible()).toBeTrue();
    });

    it('should return true when corporate_credit_card_expenses_object is JOURNAL_ENTRY', () => {
      component.workspaceGeneralSettings = {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.CHECK,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      } as any;
      expect(component.isSingleCreditLineJEFieldVisible()).toBeTrue();
    });

    it('should return false when neither condition is met', () => {
      component.workspaceGeneralSettings = {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.CHECK,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      } as any;
      expect(component.isSingleCreditLineJEFieldVisible()).toBeFalse();
    });
  });

  describe('isAutoCreateMerchantsAsVendorsFieldVisible', () => {
    it('should return true when conditions are met', () => {
      component.workspaceGeneralSettings = {
        import_vendors_as_merchants: false,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      } as any;
      expect(component.isAutoCreateMerchantsAsVendorsFieldVisible()).toBeTrue();
    });

    it('should return false when import_vendors_as_merchants is true', () => {
      component.workspaceGeneralSettings = {
        import_vendors_as_merchants: true,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      } as any;
      expect(component.isAutoCreateMerchantsAsVendorsFieldVisible()).toBeFalse();
    });

    it('should return true when name_in_journal_entry is MERCHANT', () => {
      component.workspaceGeneralSettings = {
        import_vendors_as_merchants: false,
        name_in_journal_entry: NameInJournalEntry.MERCHANT
      } as any;
      expect(component.isAutoCreateMerchantsAsVendorsFieldVisible()).toBeTrue();
    });

    it('should return false when conditions are not met', () => {
      component.workspaceGeneralSettings = {
        import_vendors_as_merchants: false,
        corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
        name_in_journal_entry: NameInJournalEntry.EMPLOYEE
      } as any;
      expect(component.isAutoCreateMerchantsAsVendorsFieldVisible()).toBeFalse();
    });
  });

  describe('onMultiSelectChange', () => {
    it('should update memoStructure with formatted memo', () => {
      const mockMemo = ['employee_email', 'merchant', 'purpose'];
      const mockFormattedMemo = ['employee_email', 'merchant', 'purpose', 'category'];
      component.advancedSettingForm = new FormBuilder().group({
        memoStructure: [mockMemo]
      });
      component.defaultMemoOptions = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on'];

      spyOn(AdvancedSettingsModel, 'formatMemoPreview').and.returnValue(['Some preview text', mockFormattedMemo]);

      component.onMultiSelectChange();

      expect(AdvancedSettingsModel.formatMemoPreview).toHaveBeenCalledWith(mockMemo, component.defaultMemoOptions);
      expect(component.advancedSettingForm.get('memoStructure')?.value).toEqual(mockFormattedMemo);
    });
  });

  describe('createMemoStructureWatcher', () => {
    beforeEach(() => {
      component.advancedSettingForm = new FormBuilder().group({
        memoStructure: [[]]
      });
      component.defaultMemoOptions = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on'];
    });

    it('should initialize memoStructure and memoPreviewText', () => {
      const initialMemoStructure = ['employee_email', 'merchant'];
      component.advancedSettingForm.get('memoStructure')?.setValue(initialMemoStructure);

      component['createMemoStructureWatcher']();

      expect(component.memoStructure).toEqual(initialMemoStructure);
      expect(component.memoPreviewText).toBe('john.doe@acme.com - Pizza Hut');
    });

    it('should update memoPreviewText when memoStructure changes', () => {
      component['createMemoStructureWatcher']();

      const newMemoStructure = ['employee_email', 'category', 'purpose'];
      component.advancedSettingForm.get('memoStructure')?.setValue(newMemoStructure);

      expect(component.memoPreviewText).toBe('john.doe@acme.com - Client Meeting - Meals and Entertainment');
    });

    it('should handle empty memoStructure', () => {
      component['createMemoStructureWatcher']();

      component.advancedSettingForm.get('memoStructure')?.setValue([]);

      expect(component.memoPreviewText).toBe('');
    });

    it('should handle invalid memoStructure values', () => {
      component['createMemoStructureWatcher']();

      const invalidMemoStructure = ['invalid_field', 'employee_email'];
      component.advancedSettingForm.get('memoStructure')?.setValue(invalidMemoStructure);

      expect(component.memoPreviewText).toBe('john.doe@acme.com');
    });
  });

  describe('saveSkipExport', () => {
    beforeEach(() => {
      component.advancedSettingForm = new FormBuilder().group({
        skipExport: [false]
        // Add other form controls as needed
      });
      component.skipExportForm = new FormBuilder().group({
        condition1: [''],
        operator1: [''],
        value1: [''],
        condition2: [''],
        operator2: [''],
        value2: [''],
        join_by: ['']
      });
      component.expenseFilters = mockSkipExportSettings;
    });

    it('should save new expense filter when skipExport is true', fakeAsync(() => {
      component.advancedSettingForm.patchValue({ skipExport: true });
      component.skipExportForm.patchValue({
        condition1: { field_name: mockExpenseFilter.condition },
        operator1: 'in',
        value1: mockExpenseFilter.values[0]
      });
      skipExportService.postExpenseFilter.and.returnValue(of(mockExpenseFilter1));

      component['saveSkipExport']();
      tick();

      expect(skipExportService.postExpenseFilter).toHaveBeenCalledWith(jasmine.objectContaining({
        condition: mockExpenseFilter.condition,
        operator: 'in',
        values: mockExpenseFilter.values[0],
        rank: 1,
        join_by: null,
        is_custom: undefined,
        custom_field_type: null
      }));
    }));

    it('should save two expense filters when two conditions are provided', fakeAsync(() => {
      component.advancedSettingForm.patchValue({ skipExport: true });
      component.skipExportForm.patchValue({
        condition1: { field_name: mockExpenseFilter.condition },
        operator1: 'in',
        value1: mockExpenseFilter.values[0],
        condition2: { field_name: mockExpenseFilter2.condition },
        operator2: mockExpenseFilter2.operator,
        value2: mockExpenseFilter2.values[0],
        join_by: 'AND'
      });

      skipExportService.postExpenseFilter.and.returnValues(
        of(mockExpenseFilter1),
        of(mockExpenseFilter2)
      );

      component['saveSkipExport']();
      tick();

      expect(skipExportService.postExpenseFilter).toHaveBeenCalledTimes(2);
      expect(skipExportService.postExpenseFilter).toHaveBeenCalledWith(jasmine.objectContaining({
        condition: mockExpenseFilter.condition,
        operator: 'in',
        values: mockExpenseFilter.values[0],
        rank: 1,
        join_by: 'AND',
        is_custom: undefined,
        custom_field_type: null
      }));
      expect(skipExportService.postExpenseFilter).toHaveBeenCalledWith(jasmine.objectContaining({
        condition: mockExpenseFilter2.condition,
        operator: mockExpenseFilter2.operator,
        values: mockExpenseFilter2.values[0],
        rank: 2,
        join_by: null,
        is_custom: undefined,
        custom_field_type: null
      }));
    }));

    it('should not save expense filter when skipExportForm is invalid', fakeAsync(() => {
      // Set up the form with validators
      component.skipExportForm = new FormBuilder().group({
        condition1: ['', Validators.required],
        operator1: ['', Validators.required],
        value1: ['', Validators.required],
        condition2: [''],
        operator2: [''],
        value2: [''],
        join_by: ['']
      });

      component.advancedSettingForm.patchValue({ skipExport: true });
      component.skipExportForm.patchValue({
        condition1: null,
        operator1: '',
        value1: ''
      });

      spyOn<any>(component, 'saveSkipExportFields').and.callThrough();

      // Reset the existing spy instead of creating a new one
      skipExportService.postExpenseFilter.calls.reset();

      component['saveSkipExport']();
      tick();

      expect(component.skipExportForm.valid).toBeFalse();
      expect(component['saveSkipExportFields']).toHaveBeenCalled();
      expect(skipExportService.postExpenseFilter).not.toHaveBeenCalled();
    }));

    it('should delete existing expense filters when skipExport is set to false', fakeAsync(() => {
      component.advancedSettingForm = new FormBuilder().group({
        skipExport: [false]
      });
      component.expenseFilters = mockSkipExportSettings;

      spyOn(component, 'deleteExpenseFilter');

      component['saveSkipExport']();
      tick();

      expect(component.deleteExpenseFilter).toHaveBeenCalledTimes(1);
      expect(component.deleteExpenseFilter).toHaveBeenCalledWith(74);
    }));
  });
});