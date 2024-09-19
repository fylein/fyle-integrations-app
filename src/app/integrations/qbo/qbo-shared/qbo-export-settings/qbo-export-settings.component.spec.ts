/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';

import { QboExportSettingsComponent } from './qbo-export-settings.component';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import {
  mockExportSettingsResponse,
  mockBankAccounts,
  mockCreditCardAccounts,
  mockAccountsPayable,
  mockVendors,
  mockWorkspaceGeneralSettings,
  mockPaginatedDestinationAttributes,
  mockSaveResponse
} from '../../qbo.fixture';
import { QBOExportSettingGet, QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { EmployeeFieldMapping, ExpenseGroupingFieldOption, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QboExportSettingDestinationOptionKey, QBOOnboardingState, QBOReimbursableExpensesObject, SplitExpenseGrouping, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { DefaultDestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EventEmitter } from '@angular/core';

xdescribe('QboExportSettingsComponent', () => {
  let component: QboExportSettingsComponent;
  let fixture: ComponentFixture<QboExportSettingsComponent>;
  let exportSettingsServiceSpy: jasmine.SpyObj<QboExportSettingsService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let qboHelperServiceSpy: jasmine.SpyObj<QboHelperService>;
  let mappingServiceSpy: jasmine.SpyObj<MappingService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let windowServiceSpy: jasmine.SpyObj<WindowService>;
  let integrationsToastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'setupDynamicValidators', 'setExportTypeValidatorsAndWatchers', 'postExportSettings'], {
      creditCardExportTypeChange: new EventEmitter<QBOCorporateCreditCardExpensesObject>()
    });
    const helperService = jasmine.createSpyObj('HelperService', ['addExportSettingFormValidator', 'setConfigurationSettingValidatorsAndWatchers', 'setOrClearValidators', 'addDefaultDestinationAttributeIfNotExists', 'enableFormField']);
    const qboHelperService = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const mappingService = jasmine.createSpyObj('MappingService', ['getPaginatedDestinationAttributes']);
    const workspaceService = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings']);
    const windowService = {
      get nativeWindow() {
        return {
          location: {
            pathname: '/integrations/qbo/onboarding/export_settings'
          }
        };
      }
    };
    const integrationsToastService = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ QboExportSettingsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: QboExportSettingsService, useValue: exportSettingsService },
        { provide: HelperService, useValue: helperService },
        { provide: QboHelperService, useValue: qboHelperService },
        { provide: MappingService, useValue: mappingService },
        { provide: WorkspaceService, useValue: workspaceService },
        { provide: WindowService, useValue: windowService },
        { provide: IntegrationsToastService, useValue: integrationsToastService },
        { provide: MessageService, useValue: {} },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    exportSettingsServiceSpy = TestBed.inject(QboExportSettingsService) as jasmine.SpyObj<QboExportSettingsService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    mappingServiceSpy = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    windowServiceSpy = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    integrationsToastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(QboExportSettingsComponent);
    component = fixture.componentInstance;

    // Mock setupCustomWatchers
    const componentSpies = jasmine.createSpyObj('QboExportSettingsComponent', [
      'setupCustomWatchers',
      'setupCustomDateOptionWatchers',
      'optionSearchWatcher'
    ]);

    Object.assign(component, componentSpies);

    // Initialize the form
    component.exportSettingForm = new FormBuilder().group({
      reimbursableExpenseObject: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object],
      corporateCreditCardExpenseObject: [mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object],
      reimbursableExpense: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object],
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      expenseState: [mockExportSettingsResponse.expense_group_settings.expense_state],
      cccExpenseState: [mockExportSettingsResponse.expense_group_settings.ccc_expense_state],
      reimbursableExportGroup: [mockExportSettingsResponse.expense_group_settings.reimbursable_expense_group_fields[0]], // Assuming we're using the first field
      reimbursableExportDate: [mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type],
      creditCardExportGroup: [mockExportSettingsResponse.expense_group_settings.corporate_credit_card_expense_group_fields[0]], // Assuming we're using the first field
      creditCardExpense: mockExportSettingsResponse.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false,
      creditCardExportDate: [mockExportSettingsResponse.expense_group_settings.ccc_export_date_type],
      creditCardExportType: [mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object],
      bankAccount: [mockExportSettingsResponse.general_mappings.bank_account],
      defaultCCCAccount: [mockExportSettingsResponse.general_mappings.default_ccc_account],
      accountsPayable: [mockExportSettingsResponse.general_mappings.accounts_payable],
      defaultCreditCardVendor: [mockExportSettingsResponse.general_mappings.default_ccc_vendor],
      nameInJournalEntry: [mockExportSettingsResponse.workspace_general_settings.name_in_journal_entry]
    });
  });

  describe('getSettingsAndSetupForm', () => {
    beforeEach(() => {
      exportSettingsServiceSpy.getExportSettings.and.returnValue(of(mockExportSettingsResponse));
      workspaceServiceSpy.getWorkspaceGeneralSettings.and.returnValue(of(mockWorkspaceGeneralSettings));
      mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValues(
        of(mockBankAccounts),
        of(mockCreditCardAccounts),
        of(mockAccountsPayable),
        of(mockVendors)
      );

      spyOn(QBOExportSettingModel, 'mapAPIResponseToFormGroup').and.returnValue(component.exportSettingForm);
    });

    it('should fetch and set up export settings correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(exportSettingsServiceSpy.getExportSettings).toHaveBeenCalledTimes(1);
      expect(workspaceServiceSpy.getWorkspaceGeneralSettings).toHaveBeenCalledTimes(1);
      expect(mappingServiceSpy.getPaginatedDestinationAttributes).toHaveBeenCalledTimes(4);

      expect(component.exportSettings).toEqual(mockExportSettingsResponse);
      expect(component.employeeFieldMapping).toEqual(mockWorkspaceGeneralSettings.employee_field_mapping);
      expect(component.isImportItemsEnabled).toEqual(mockWorkspaceGeneralSettings.import_items);

      expect(component.bankAccounts.length).toBeGreaterThan(0);
      expect(component.cccAccounts.length).toBeGreaterThan(0);
      expect(component.accountsPayables.length).toBeGreaterThan(0);
      expect(component.vendors.length).toBeGreaterThan(0);

      expect(QBOExportSettingModel.mapAPIResponseToFormGroup).toHaveBeenCalledWith(mockExportSettingsResponse, mockWorkspaceGeneralSettings.employee_field_mapping);
      expect(component.exportSettingForm).toBeDefined();

      expect(helperServiceSpy.addExportSettingFormValidator).toHaveBeenCalledWith(component.exportSettingForm);
      expect(helperServiceSpy.setConfigurationSettingValidatorsAndWatchers).toHaveBeenCalled();
      expect(exportSettingsServiceSpy.setupDynamicValidators).toHaveBeenCalledTimes(2);
      expect(helperServiceSpy.setOrClearValidators).toHaveBeenCalledTimes(2);
      expect(component.exportSettingForm.controls.reimbursableExportDate.value).toEqual(mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type);
      expect(component.exportSettingForm.controls.creditCardExportDate.value).toEqual(mockExportSettingsResponse.expense_group_settings.ccc_export_date_type);
      // eslint-disable-next-line dot-notation
      expect(component['setupCustomWatchers']).toHaveBeenCalled();
      // eslint-disable-next-line dot-notation
      expect(component['setupCustomDateOptionWatchers']).toHaveBeenCalled();
      // eslint-disable-next-line dot-notation
      expect(component['optionSearchWatcher']).toHaveBeenCalled();

      expect(exportSettingsServiceSpy.setExportTypeValidatorsAndWatchers).toHaveBeenCalled();

      expect(component.isLoading).toBeFalse();
    }));

    xit('setupCustomWatchers function check', fakeAsync(() => {
      component.ngOnInit();
      tick();
      fixture.detectChanges();
      component.exportSettingForm.controls.reimbursableExpense.patchValue(true);
      expect((component as any).setupCustomWatchers()).toBeUndefined();
      fixture.detectChanges();
      component.exportSettingForm.controls.reimbursableExpense.patchValue(false);
      expect((component as any).setupCustomWatchers()).toBeUndefined();
    }));

    xit('setupCustomDateOptionWatchers function check', () => {
      component.exportSettingForm.controls.creditCardExpense.patchValue(component.exportSettingForm.controls.creditCardExpense.value);
      expect((component as any).setupCustomDateOptionWatchers()).toBeUndefined();
      fixture.detectChanges();
      component.exportSettingForm.controls.creditCardExpense.patchValue(!component.exportSettingForm.controls.creditCardExpense.value);
      expect((component as any).setupCustomDateOptionWatchers()).toBeUndefined();
      component.exportSettingForm.controls.creditCardExpense.patchValue(!component.exportSettingForm.controls.creditCardExpense.value);
      expect((component as any).setupCustomDateOptionWatchers()).toBeUndefined();
      component.exportSettingForm.controls.creditCardExpense.patchValue(!component.exportSettingForm.controls.creditCardExpense.value);
      expect((component as any).setupCustomDateOptionWatchers()).toBeUndefined();
    });

    it('should handle onboarding state correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.isOnboarding).toBeTrue();
    }));

    it('should set up reimbursable export types correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.reimbursableExportTypes).toBeDefined();
      expect(component.reimbursableExportTypes.length).toBeGreaterThan(0);
    }));

    it('should set showNameInJournalOption correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.showNameInJournalOption).toBeDefined();
    }));

    it('should call optionSearchWatcher', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component['optionSearchWatcher']).toHaveBeenCalledTimes(1);
      }));

    it('should call setupCustomWatchers', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component['setupCustomWatchers']).toHaveBeenCalledTimes(1);
    }));

    it('should call setupCustomDateOptionWatchers', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component['setupCustomDateOptionWatchers']).toHaveBeenCalledTimes(1);
    }));

    it('should set up expense accounts correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.expenseAccounts).toBeDefined();
      expect(component.expenseAccounts.length).toBe(mockBankAccounts.results.length + mockCreditCardAccounts.results.length);
    }));

    it('should set up creditCardExpense correctly when reimbursableExpenses feature is disabled', fakeAsync(() => {
      (component['brandingFeatureConfig'] as any) = {
        featureFlags: {
          exportSettings: {
            reimbursableExpenses: false
          }
        }
      };
      component.ngOnInit();
      tick();

      expect(component.exportSettingForm.get('creditCardExpense')?.value).toBeTrue();
    }));

    it('should set up expense accounts correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.expenseAccounts).toBeDefined();
      expect(component.expenseAccounts.length).toBe(component.bankAccounts.length + component.cccAccounts.length);
    }));

    it('should set up creditCardExpense correctly', fakeAsync(() => {
      (component['brandingFeatureConfig'] as any) = {
        featureFlags: {
          exportSettings: {
          reimbursableExpenses: false
          }
        }
      };
      component.ngOnInit();
      tick();
      expect(component.creditCardExportTypes).toBeDefined();
    }));

    describe('getPaginatedDestinationAttributes', () => {
      it('should call mappingService.getPaginatedDestinationAttributes with correct parameters', () => {
        const destinationKey = QboExportSettingDestinationOptionKey.BANK_ACCOUNT;
        const searchTerm = 'test';
        component['getPaginatedAttributes'](destinationKey, searchTerm);
        expect(mappingServiceSpy.getPaginatedDestinationAttributes).toHaveBeenCalledWith(destinationKey, searchTerm);
      });

      it('should return Observable of PaginatedDestinationAttribute', (done) => {
        const mockResponse: PaginatedDestinationAttribute = mockPaginatedDestinationAttributes;
        mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValue(of(mockResponse));

        component['getPaginatedAttributes'](QboExportSettingDestinationOptionKey.BANK_ACCOUNT, 'test').subscribe(result => {
          expect(result).toEqual(mockResponse);
          done();
        });
      });
    });

    describe('handleExpenseAccountSearch', () => {
      it('should call getPaginatedAttributes twice for EXPENSE_ACCOUNT', fakeAsync(() => {
        spyOn(component as any, 'getPaginatedAttributes').and.returnValue(of({ results: [] }));
        const mockEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
          destinationAttributes: []
        };

        component['handleExpenseAccountSearch'](mockEvent, []);
        tick();

        expect(component['getPaginatedAttributes']).toHaveBeenCalledTimes(2);
        expect(component['getPaginatedAttributes']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.BANK_ACCOUNT, 'test');
        expect(component['getPaginatedAttributes']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT, 'test');
      }));

      it('should merge results from bank and credit card accounts', fakeAsync(() => {
        const mockBankAccounts = { results: [{ id: 1, attribute_type: 'BANK_ACCOUNT', display_name: 'Bank 1', value: 'B1', destination_id: '1', active: true }] };
        const mockCreditCardAccounts = { results: [{ id: 2, attribute_type: 'CREDIT_CARD_ACCOUNT', display_name: 'Credit 1', value: 'C1', destination_id: '2', active: true }] };

        spyOn(component as any, 'getPaginatedAttributes').and.returnValues(of(mockBankAccounts), of(mockCreditCardAccounts));
        spyOn(component as any, 'mergeOptions').and.callThrough();

        const mockEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
          destinationAttributes: []
        };

        component['handleExpenseAccountSearch'](mockEvent, []);
        tick();

        expect(component['mergeOptions']).toHaveBeenCalledWith(
          jasmine.arrayContaining([jasmine.objectContaining({ id: '1', name: 'B1' })]),
          jasmine.arrayContaining([jasmine.objectContaining({ id: '2', name: 'C1' })])
        );
      }));
    });

    describe('handleGeneralOptionSearch', () => {
      it('should call getPaginatedAttributes once for non-EXPENSE_ACCOUNT options', fakeAsync(() => {
        spyOn(component as any, 'getPaginatedAttributes').and.returnValue(of({ results: [] }));
        const mockEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          destinationAttributes: []
        };

        component['handleGeneralOptionSearch'](mockEvent, []);
        tick();

        expect(component['getPaginatedAttributes']).toHaveBeenCalledTimes(1);
        expect(component['getPaginatedAttributes']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.BANK_ACCOUNT, 'test');
      }));

      it('should update options and set them correctly', fakeAsync(() => {
        const mockResponse = { results: [{ id: 1, attribute_type: 'BANK_ACCOUNT', display_name: 'Bank 1', value: 'B1', destination_id: '1', active: true }] };
        spyOn(component as any, 'getPaginatedAttributes').and.returnValue(of(mockResponse));
        spyOn(component as any, 'updateOptions').and.callThrough();
        spyOn(component as any, 'setUpdatedOptions').and.callThrough();

        const mockEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          destinationAttributes: []
        };

        component['handleGeneralOptionSearch'](mockEvent, []);
        tick();

        expect(component['updateOptions']).toHaveBeenCalled();
        expect(component['setUpdatedOptions']).toHaveBeenCalledWith(
          QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          jasmine.arrayContaining([jasmine.objectContaining({ id: '1', name: 'B1' })])
        );
      }));

      it('should return correct existing options for different destination option keys', () => {
        component.accountsPayables = [{ id: '1', name: 'AP1' }];
        component.bankAccounts = [{ id: '2', name: 'BA1' }];
        component.cccAccounts = [{ id: '3', name: 'CCC1' }];
        component.vendors = [{ id: '4', name: 'V1' }];
        component.expenseAccounts = [{ id: '5', name: 'EA1' }];

        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE)).toEqual(component.accountsPayables);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.BANK_ACCOUNT)).toEqual(component.bankAccounts);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT)).toEqual(component.cccAccounts);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.VENDOR)).toEqual(component.vendors);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT)).toEqual(component.expenseAccounts);
        expect(component['getExistingOptions']('INVALID_KEY' as QboExportSettingDestinationOptionKey)).toEqual([]);
      });

      it('should handle option search correctly for different destination option keys', fakeAsync(() => {
        const mockExpenseAccountEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
          destinationAttributes: []
        };

        const mockGeneralEvent: ExportSettingOptionSearch = {
          searchTerm: 'test',
          destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          destinationAttributes: []
        };

        // Set up mock data for existing options
        component.expenseAccounts = [{ id: '1', name: 'Expense 1' }];
        component.bankAccounts = [{ id: '2', name: 'Bank 1' }];

        spyOn(component as any, 'getExistingOptions').and.callThrough();
        spyOn(component as any, 'handleExpenseAccountSearch');
        spyOn(component as any, 'handleGeneralOptionSearch');

        component['handleOptionSearch'](mockExpenseAccountEvent);
        tick();

        expect(component['getExistingOptions']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT);
        expect(component['handleExpenseAccountSearch']).toHaveBeenCalledWith(mockExpenseAccountEvent, component.expenseAccounts);
        expect(component['handleGeneralOptionSearch']).not.toHaveBeenCalled();

        component['handleOptionSearch'](mockGeneralEvent);
        tick();

        expect(component['getExistingOptions']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.BANK_ACCOUNT);
        expect(component['handleGeneralOptionSearch']).toHaveBeenCalledWith(mockGeneralEvent, component.bankAccounts);
        expect(component['handleExpenseAccountSearch']).toHaveBeenCalledTimes(1); // Ensure it wasn't called again
        }));

      it('should set updated options correctly for all destination option keys', () => {
        const mockOptions: DefaultDestinationAttribute[] = [{ id: '1', name: 'Test Option' }];

        // Test ACCOUNTS_PAYABLE
        component['setUpdatedOptions'](QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE, mockOptions);
        expect(component.accountsPayables).toEqual(mockOptions);

        // Test BANK_ACCOUNT
        component['setUpdatedOptions'](QboExportSettingDestinationOptionKey.BANK_ACCOUNT, mockOptions);
        expect(component.bankAccounts).toEqual(mockOptions);

        // Test CREDIT_CARD_ACCOUNT
        component['setUpdatedOptions'](QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT, mockOptions);
        expect(component.cccAccounts).toEqual(mockOptions);

        // Test VENDOR
        component['setUpdatedOptions'](QboExportSettingDestinationOptionKey.VENDOR, mockOptions);
        expect(component.vendors).toEqual(mockOptions);

        // Test EXPENSE_ACCOUNT
        component['setUpdatedOptions'](QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT, mockOptions);
        expect(component.expenseAccounts).toEqual(mockOptions);
        });
    });
  });

  describe('save', () => {
    beforeEach(() => {
      // Initialize exportSettings with mock data
      component.exportSettings = mockExportSettingsResponse;
      workspaceServiceSpy.setOnboardingState = jasmine.createSpy('setOnboardingState');
        // Spy on the save method
        spyOn(component, 'save').and.callThrough();
      });

      it('should save export settings and navigate on success for onboarding', fakeAsync(() => {
        exportSettingsServiceSpy.postExportSettings.and.returnValue(of(mockExportSettingsResponse));
        component.isOnboarding = true;

        component.exportSettingForm.patchValue({
          workspaceGeneralSettings: {
            reimbursableExpensesObject: 'BILL',
            corporateCreditCardExpensesObject: 'CREDIT_CARD_PURCHASE',
            isSimplifyReportClosureEnabled: true,
            nameInJournalEntry: 'EMPLOYEE'
          },
          expenseGroupSettings: {
            expenseState: 'PAYMENT_PROCESSING',
            reimbursableExpenseGroupFields: ['EXPENSE_ID'],
            corporateCreditCardExpenseGroupFields: ['EXPENSE_ID'],
            splitExpenseGrouping: SplitExpenseGrouping.MULTIPLE_LINE_ITEM
          },
          generalMappings: {
            bankAccount: { id: '1', name: 'Bank Account' },
            accountsPayable: { id: '2', name: 'Accounts Payable' },
            defaultCCCAccount: { id: '3', name: 'Credit Card Account' },
            defaultVendor: { id: '4', name: 'Default Vendor' }
          }
        });

        component.save();
        tick();

        expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalled();
        expect(workspaceServiceSpy.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.IMPORT_SETTINGS);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/import_settings']);
      }));

      it('should handle error when saving export settings', fakeAsync(() => {
        // Mock the postExportSettings to return an error
        exportSettingsServiceSpy.postExportSettings.and.returnValue(throwError(() => new Error('API Error')));

        // Set up the component state
        component.exportSettings = mockExportSettingsResponse;
        component.exportSettingForm.patchValue({
          reimbursableExportType: 'BILL',
          creditCardExportType: 'CREDIT_CARD_PURCHASE'
        });

        // Spy on the isAdvancedSettingAffected method to return false
        spyOn<any>(component, 'isAdvancedSettingAffected').and.returnValue(false);

        // Call the save method
        component.save();
        tick();

        // Assert that the error handling is done correctly
        expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalled();
        expect(component.isSaveInProgress).toBeFalse();
        expect(integrationsToastServiceSpy.displayToastMessage).toHaveBeenCalledWith(
          ToastSeverity.ERROR,
          'Error saving export settings, please try again later'
        );
      }));

      it('should show warning dialog when advanced settings are affected', () => {
        // Set up the component state to trigger the warning
        component.exportSettings = mockExportSettingsResponse;
        component.exportSettingForm.patchValue({
          reimbursableExportType: 'JOURNAL_ENTRY',
          creditCardExportType: 'BILL'
        });

        // Spy on the isAdvancedSettingAffected method
        spyOn<any>(component, 'isAdvancedSettingAffected').and.returnValue(true);

        // Call the save method
        component.save();

        // Assert that the confirmation dialog is shown
        expect(component.isConfirmationDialogVisible).toBeTrue();
      });

      it('should navigate to advanced settings when isAdvancedSettingAffected returns true', fakeAsync(() => {
        // Mock the initial export settings
        component.exportSettings = {
          workspace_general_settings: {
            reimbursable_expenses_object: QBOReimbursableExpensesObject.EXPENSE,
            corporate_credit_card_expenses_object: QBOCorporateCreditCardExpensesObject.EXPENSE
          }
        } as QBOExportSettingGet;

        // Set up the form with values that will trigger isAdvancedSettingAffected to return true
        component.exportSettingForm.patchValue({
          reimbursableExportType: QBOReimbursableExpensesObject.EXPENSE,
          creditCardExportType: QBOCorporateCreditCardExpensesObject.EXPENSE
        });

        // Mock the postExportSettings to return a successful response
        const mockSaveResponse: QBOExportSettingGet = {
          ...component.exportSettings
          // Add any other required properties
        };
        exportSettingsServiceSpy.postExportSettings.and.returnValue(of(mockSaveResponse));

        // Call the save method
        component.save();

        // Use tick to simulate the passage of time and allow any async operations to complete
        tick();

        // Flush any pending microtasks
        flushMicrotasks();

        // Expect that the postExportSettings was called
        expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalled();

        // Expect that isSaveInProgress is set to false after save
        expect(component.isSaveInProgress).toBeFalse();

        // Clean up
        discardPeriodicTasks();
      }));
  });

  describe('searchOptionsDropdown', () => {
    beforeEach(() => {
      // Mock the Subject's next method and spy on it
      component['optionSearchUpdate'] = new Subject<ExportSettingOptionSearch>();
      spyOn(component['optionSearchUpdate'], 'next');
    });

    it('should set isOptionSearchInProgress to true and call optionSearchUpdate.next when searchTerm is present', () => {
      const event: ExportSettingOptionSearch = {
        searchTerm: 'anish',
        destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
        destinationAttributes: []
      };

      component.searchOptionsDropdown(event);

      expect(component.isOptionSearchInProgress).toBe(true);
      expect(component['optionSearchUpdate'].next).toHaveBeenCalledWith(event);
    });

    it('should not call optionSearchUpdate.next when searchTerm is empty', () => {
      const event: ExportSettingOptionSearch = {
        searchTerm: '',
        destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
        destinationAttributes: []
      };

      component.searchOptionsDropdown(event);

      expect(component.isOptionSearchInProgress).toBeUndefined();
      expect(component['optionSearchUpdate'].next).not.toHaveBeenCalled();
    });

    it('should call refreshQBODimensions when refreshDimensions is invoked', () => {
      qboHelperServiceSpy.refreshQBODimensions.and.returnValue(of({}));  // Mocking the Observable response with `of(null)`

      component.refreshDimensions();

      expect(qboHelperServiceSpy.refreshQBODimensions).toHaveBeenCalled();
    });
  });

  describe('navigateToPreviousStep', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'brandingFeatureConfig', {
        get: () => ({
          featureFlags: {
            mapEmployees: true
          }
        }),
        configurable: true
      });
    });

    it('should navigate to employee_settings if mapEmployees is true', () => {
      component.navigateToPreviousStep();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/employee_settings']);
    });
  });

  describe('updateCCCExpenseGroupingDateOptions', () => {
    it('should update CCC expense grouping date options correctly', () => {
      component.reimbursableExpenseGroupingDateOptions = [{ value: 'option1', label: 'Option 1' }];
      component.exportSettingForm = new FormBuilder().group({
        reimbursableExpenseObject: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object],
        corporateCreditCardExpenseObject: [mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object],
        employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
        expenseState: [mockExportSettingsResponse.expense_group_settings.expense_state],
        cccExpenseState: [mockExportSettingsResponse.expense_group_settings.ccc_expense_state],
        reimbursableExportGroup: [mockExportSettingsResponse.expense_group_settings.reimbursable_expense_group_fields[0]], // Assuming we're using the first field
        reimbursableExportDate: [mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type],
        creditCardExportGroup: [mockExportSettingsResponse.expense_group_settings.corporate_credit_card_expense_group_fields[0]], // Assuming we're using the first field
        creditCardExportDate: [mockExportSettingsResponse.expense_group_settings.ccc_export_date_type],
        bankAccount: [mockExportSettingsResponse.general_mappings.bank_account],
        defaultCCCAccount: [mockExportSettingsResponse.general_mappings.default_ccc_account],
        accountsPayable: [mockExportSettingsResponse.general_mappings.accounts_payable],
        defaultCreditCardVendor: [mockExportSettingsResponse.general_mappings.default_ccc_vendor],
        nameInJournalEntry: [mockExportSettingsResponse.workspace_general_settings.name_in_journal_entry]
      });

      // Test for CREDIT_CARD_PURCHASE
      component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
      expect(component.cccExpenseGroupingDateOptions).toEqual(QBOExportSettingModel.getAdditionalCreditCardExpenseGroupingDateOptions());

      const creditCardExportGroup = component.exportSettingForm.get('creditCardExportGroup');
      expect(creditCardExportGroup?.value).toBe(ExpenseGroupingFieldOption.EXPENSE_ID);
      expect(creditCardExportGroup?.disabled).toBeTrue();

      // Test for BILL
      component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.BILL);
      expect(component.cccExpenseGroupingDateOptions).toEqual(component.reimbursableExpenseGroupingDateOptions);
    });
  });

  describe('constructWarningMessage', () => {
    beforeEach(() => {
      component.exportSettings = {
        workspace_general_settings: {
          reimbursable_expenses_object: 'EXPENSE',
          corporate_credit_card_expenses_object: 'CREDIT_CARD_PURCHASE'
        }
      } as any;
      component.exportSettingForm = new FormBuilder().group({
        reimbursableExportType: ['BILL'],
        creditCardExportType: ['JOURNAL_ENTRY']
      });
    });

    it('should construct warning message for reimbursable expenses when single itemized journal entry is affected', () => {
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(true);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(false);
      spyOn<any>(component, 'replaceContentBasedOnConfiguration').and.callThrough();

      const result = component['constructWarningMessage']();

      expect(component['replaceContentBasedOnConfiguration']).toHaveBeenCalledWith('BILL', 'EXPENSE', 'reimbursable');
      expect(result).toContain('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>');
    });

    it('should construct warning message for credit card expenses when single itemized journal entry is affected', () => {
      component.exportSettingForm.patchValue({ reimbursableExportType: 'EXPENSE' });
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(true);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(false);
      const result = component['constructWarningMessage']();
      expect(result).toContain('You have changed the export type of credit card expense from <b>Credit_card_purchase</b> to <b>Journal_entry</b>');
    });

    it('should construct warning message when payments sync is affected', () => {
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(false);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(true);
      const result = component['constructWarningMessage']();
      expect(result).toContain('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>');
    });

    it('should return empty string when no settings are affected', () => {
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(false);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(false);
      const result = component['constructWarningMessage']();
      expect(result).toBe('');
    });
  });

  describe('replaceContentBasedOnConfiguration', () => {
    it('should return correct content for configuration update', () => {
      const result = component['replaceContentBasedOnConfiguration']('BILL', 'EXPENSE', 'reimbursable');
      expect(result).toContain('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>');
    });

    it('should return correct content for new configuration', () => {
      const result = component['replaceContentBasedOnConfiguration']('BILL', 'None', 'credit card');
      expect(result).toContain('You have <b>selected a new export type</b> for the credit card expense');
    });

    it('should include additional content when updated to JOURNAL_ENTRY and isImportItemsEnabled is true', () => {
      component.isImportItemsEnabled = true;
      const result = component['replaceContentBasedOnConfiguration'](QBOReimbursableExpensesObject.JOURNAL_ENTRY, 'EXPENSE', 'reimbursable');
      expect(result).toContain('Products/services previously imported as categories');
    });
  });

  describe('setupCustomWatchers', () => {
    beforeEach(() => {
      const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'setupDynamicValidators', 'setExportTypeValidatorsAndWatchers', 'postExportSettings'], {
        creditCardExportTypeChange: jasmine.createSpyObj('EventEmitter', ['emit']) as EventEmitter<QBOCorporateCreditCardExpensesObject>
      });
    });

    it('should call updateCCCExpenseGroupingDateOptions if creditCardExportType is CREDIT_CARD_PURCHASE', () => {
      // Restore the original method
      delete (component as any).setupCustomWatchers;

      // Spy on the updateCCCExpenseGroupingDateOptions method
      spyOn<any>(component, 'updateCCCExpenseGroupingDateOptions');

      // Set up the form with the required value
      component.exportSettingForm.patchValue({
        creditCardExportType: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      });

      // Call the method
      component['setupCustomWatchers']();

      // Check if updateCCCExpenseGroupingDateOptions was called with the correct parameter
      expect(component['updateCCCExpenseGroupingDateOptions']).toHaveBeenCalledWith(QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
    });

    it('should handle creditCardExportTypeChange subscription correctly', () => {
      // Restore the original method
      delete (component as any).setupCustomWatchers;

      // Spy on the updateCCCExpenseGroupingDateOptions method
      spyOn<any>(component, 'updateCCCExpenseGroupingDateOptions');

      // Call the method
      component['setupCustomWatchers']();

      // Emit JOURNAL_ENTRY
      exportSettingsServiceSpy.creditCardExportTypeChange.next(QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY);

      // Check if showNameInJournalOption is set to true
      expect(component.showNameInJournalOption).toBeTrue();

      // Check if updateCCCExpenseGroupingDateOptions was called with JOURNAL_ENTRY
      expect(component['updateCCCExpenseGroupingDateOptions']).toHaveBeenCalledWith(QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY);

      // Reset the spy
      (component['updateCCCExpenseGroupingDateOptions'] as jasmine.Spy).calls.reset();

      // Emit CREDIT_CARD_PURCHASE
      exportSettingsServiceSpy.creditCardExportTypeChange.next(QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);

      // Check if showNameInJournalOption is set to false
      expect(component.showNameInJournalOption).toBeFalse();

      // Check if updateCCCExpenseGroupingDateOptions was called with CREDIT_CARD_PURCHASE
      expect(component['updateCCCExpenseGroupingDateOptions']).toHaveBeenCalledWith(QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
    });
  });

  describe('setupCustomDateOptionWatchers', () => {
    beforeEach(() => {
      component.exportSettingForm = new FormBuilder().group({
        reimbursableExportGroup: [''],
        creditCardExportType: [QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY],
        creditCardExportGroup: ['']
      });
      component.reimbursableExpenseGroupingDateOptions = [];
      component.cccExpenseGroupingDateOptions = [];

      // Restore the original method
      delete (component as any).setupCustomDateOptionWatchers;

      spyOn(QBOExportSettingModel, 'getReimbursableExpenseGroupingDateOptions').and.returnValue([]);
      spyOn(ExportSettingModel, 'constructGroupingDateOptions').and.returnValue([]);
      spyOn<any>(component, 'updateCCCExpenseGroupingDateOptions');
    });

    it('should update reimbursableExpenseGroupingDateOptions when reimbursableExportGroup changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        reimbursableExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID
      });
    });

    it('should call updateCCCExpenseGroupingDateOptions when creditCardExportType changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        creditCardExportType: QBOCorporateCreditCardExpensesObject.BILL
      });
    });

    it('should update cccExpenseGroupingDateOptions when creditCardExportGroup changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        creditCardExportType: QBOCorporateCreditCardExpensesObject.BILL,
        creditCardExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID
      });
    });
  });

  describe('optionSearchWatcher', () => {
    beforeEach(() => {
      // Restore the original method
      delete (component as any).optionSearchWatcher;

      // Create a new Subject for optionSearchUpdate
      component['optionSearchUpdate'] = new Subject<ExportSettingOptionSearch>();

      // Spy on handleOptionSearch method
      spyOn<any>(component, 'handleOptionSearch');
    });

    afterEach(() => {
      // Complete the subject to clean up any pending observables
      component['optionSearchUpdate'].complete();
    });

    it('should call handleOptionSearch after debounce time when optionSearchUpdate emits', fakeAsync(() => {
      // Call the method to set up the watcher
      component['optionSearchWatcher']();

      // Create a mock event
      const mockEvent: ExportSettingOptionSearch = {
        searchTerm: 'test',
        destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
        destinationAttributes: []
      };

      // Emit the event
      component['optionSearchUpdate'].next(mockEvent);

      // Fast-forward time by 1000ms
      tick(1000);

      // Now expect handleOptionSearch to have been called with the mock event
      expect(component['handleOptionSearch']).toHaveBeenCalledWith(mockEvent);

      // Discard any remaining periodic tasks
      discardPeriodicTasks();
    }));

    it('should not call handleOptionSearch before debounce time', fakeAsync(() => {
      component['optionSearchWatcher']();

      const mockEvent: ExportSettingOptionSearch = {
        searchTerm: 'test',
        destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
        destinationAttributes: []
      };

      component['optionSearchUpdate'].next(mockEvent);

      // Fast-forward time by 999ms
      tick(999);

      // Expect handleOptionSearch not to have been called
      expect(component['handleOptionSearch']).not.toHaveBeenCalled();

      // Discard any remaining periodic tasks
      discardPeriodicTasks();
    }));
  });
});
