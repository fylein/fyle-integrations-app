/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
  mockExportSettingSaveResponse,
  mockReimbursableExpenseGroupingDateOptions,
  mockCCCExpenseGroupingDateOptions,
  mockCCCExpenseGroupingDateOptionsForCreditDebit,
  mockExportSettingOptionSearch,
  mockExpenseAccountEvent,
  mockGeneralEvent,
  mockBrandingConfig,
  mockExportSettingFormValueforNavigate,
  mockDateOptionsforWatchers,
  mockCCCExpenseDateGrouping,
  mockReimbursableExpenseDateGrouping
} from '../../qbo.fixture';
import { QBOExportSettingGet, QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { AutoMapEmployeeOptions, ConfigurationWarningEvent, EmployeeFieldMapping, ExpenseGroupingFieldOption, NameInJournalEntry, QBOCorporateCreditCardExpensesObject, QboExportSettingDestinationOptionKey, QBOOnboardingState, QBOReimbursableExpensesObject, SplitExpenseGrouping, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingModel, ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { DefaultDestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EventEmitter } from '@angular/core';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { FeatureConfiguration } from 'src/app/core/models/branding/feature-configuration.model';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QboExportSettingsComponent', () => {
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
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'setupDynamicValidators', 'setExportTypeValidatorsAndWatchers', 'postExportSettings'], {
      creditCardExportTypeChange: new EventEmitter<QBOCorporateCreditCardExpensesObject>()
    });
    const helperService = jasmine.createSpyObj('HelperService', ['addExportSettingFormValidator', 'setConfigurationSettingValidatorsAndWatchers', 'setOrClearValidators', 'addDefaultDestinationAttributeIfNotExists', 'enableFormField']);
    const qboHelperService = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const mappingService = jasmine.createSpyObj('MappingService', ['getPaginatedDestinationAttributes']);
    mappingService.getPaginatedDestinationAttributes.and.returnValue(of({}));
    const workspaceService = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'getWorkspaceId']);
    workspaceService.getWorkspaceId.and.returnValue(of('1'));
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
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
    declarations: [QboExportSettingsComponent],
    imports: [ReactiveFormsModule, TranslocoModule],
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
        { provide: Router, useValue: router },
        { provide: 'brandingFeatureConfig', useValue: mockBrandingConfig },
        {
            provide: QboEmployeeSettingsService,
            useValue: jasmine.createSpyObj('QboEmployeeSettingsService', [
                'getEmployeeSettings',
                'getDistinctQBODestinationAttributes'
            ])
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: TranslocoService, useValue: translocoServiceSpy }
    ]
}).compileComponents();

    exportSettingsServiceSpy = TestBed.inject(QboExportSettingsService) as jasmine.SpyObj<QboExportSettingsService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    mappingServiceSpy = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    windowServiceSpy = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    integrationsToastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(QboExportSettingsComponent);
    component = fixture.componentInstance;
    const employeeSettingsService = TestBed.inject(QboEmployeeSettingsService) as jasmine.SpyObj<QboEmployeeSettingsService>;
    employeeSettingsService.getEmployeeSettings.and.returnValue(of({
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployeeOptions.EMAIL
      },
      workspace_id: 0 // Changed from string to number
    }));
    employeeSettingsService.getDistinctQBODestinationAttributes.and.returnValue(of([]));
    // Initialize the form
    component.exportSettingForm = new FormBuilder().group({
      reimbursableExpenseObject: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object],
      corporateCreditCardExpenseObject: [mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object],
      reimbursableExpense: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object],
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      expenseState: [mockExportSettingsResponse.expense_group_settings.expense_state],
      cccExpenseState: [mockExportSettingsResponse.expense_group_settings.ccc_expense_state],
      reimbursableExportGroup: [mockExportSettingsResponse.expense_group_settings.reimbursable_expense_group_fields[0]],
      reimbursableExportDate: [mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type],
      creditCardExportGroup: [mockExportSettingsResponse.expense_group_settings.corporate_credit_card_expense_group_fields[0]],
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

      expect(component.exportSettings).toEqual(mockExportSettingsResponse);
      expect(component.employeeFieldMapping).toEqual(mockWorkspaceGeneralSettings.employee_field_mapping);
      expect(component.isImportItemsEnabled).toEqual(mockWorkspaceGeneralSettings.import_items);

      expect(component.exportSettingForm.controls.reimbursableExportDate.value).toEqual(mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type);
      expect(component.exportSettingForm.controls.creditCardExportDate.value).toEqual(mockExportSettingsResponse.expense_group_settings.ccc_export_date_type);

      expect(component.isLoading).toBeFalse();
    }));

    it('should handle onboarding state correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.isOnboarding).toBeTrue();
    }));

    it('should set up expense accounts correctly', fakeAsync(() => {
      component.ngOnInit();
      tick();

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
      it('should trigger the option search flow for EXPENSE_ACCOUNT', fakeAsync(() => {
        const mockSearchEvent = {
          searchTerm: 'Savings',
          destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
          destinationAttributes: [],
          formControllerName: 'expenseAccount'
        };

        component.expenseAccounts = [];
        component.bankAccounts = [];
        component.cccAccounts = [];

        component['optionSearchUpdate'] = new Subject<ExportSettingOptionSearch>();

        spyOn<any>(component, 'getPaginatedAttributes').and.returnValues(
          of(mockBankAccounts),
          of(mockCreditCardAccounts)
        );

        spyOn<any>(component, 'handleOptionSearch').and.callThrough();
        spyOn<any>(component, 'handleExpenseAccountSearch').and.callThrough();
        spyOn<any>(component, 'updateOptions').and.callThrough();
        spyOn<any>(component, 'setUpdatedOptions').and.callThrough();
        spyOn<any>(component, 'mergeOptions').and.callThrough();

        // Subscribe to the optionSearchUpdate Subject
        component['optionSearchUpdate'].subscribe((event) => {
          component['handleOptionSearch'](event);
        });

        component.searchOptionsDropdown(mockSearchEvent);
        tick(1000);

        expect(component['handleOptionSearch']).toHaveBeenCalledWith(mockSearchEvent);
      }));

      it('should merge results from bank and credit card accounts', fakeAsync(() => {
        spyOn(component as any, 'getPaginatedAttributes').and.returnValues(of(mockBankAccounts), of(mockCreditCardAccounts));
        spyOn(component as any, 'mergeOptions').and.callThrough();

        component['handleExpenseAccountSearch'](mockExportSettingOptionSearch, []);
        tick();

        expect(component['mergeOptions']).toHaveBeenCalledWith(
          jasmine.arrayContaining(mockBankAccounts.results.map(account => jasmine.objectContaining({
            id: account.destination_id,
            name: account.value
          }))),
          jasmine.arrayContaining(mockCreditCardAccounts.results.map(account => jasmine.objectContaining({
            id: account.destination_id,
            name: account.value
          })))
        );
      }));
    });

    describe('handleGeneralOptionSearch', () => {
      it('should call getPaginatedAttributes once for non-EXPENSE_ACCOUNT options', fakeAsync(() => {
        spyOn(component as any, 'getPaginatedAttributes').and.returnValue(of({ results: [] }));
        component['handleGeneralOptionSearch'](mockExportSettingOptionSearch, []);
        tick();
        expect(component['getPaginatedAttributes']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.BANK_ACCOUNT, 'anish');
      }));

      it('should update options and set them correctly', fakeAsync(() => {
        spyOn(component as any, 'getPaginatedAttributes').and.returnValue(of(mockBankAccounts));
        spyOn(component as any, 'updateOptions').and.callThrough();
        spyOn(component as any, 'setUpdatedOptions').and.callThrough();


        component['handleGeneralOptionSearch'](mockExportSettingOptionSearch, []);
        tick();

        expect(component['setUpdatedOptions']).toHaveBeenCalledWith(
          QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          jasmine.arrayContaining(mockBankAccounts.results.map(account => jasmine.objectContaining({
            id: account.destination_id,
            name: account.value
          })))
        );
      }));

      it('should return correct existing options for different destination option keys', () => {
        component.accountsPayables = mockAccountsPayable.results.map(account => ({ id: account.destination_id, name: account.value }));
        component.bankAccounts = mockBankAccounts.results.map(account => ({ id: account.destination_id, name: account.value }));
        component.cccAccounts = mockCreditCardAccounts.results.map(account => ({ id: account.destination_id, name: account.value }));
        component.vendors = mockVendors.results.map(vendor => ({ id: vendor.destination_id, name: vendor.value }));
        component.expenseAccounts = [...component.bankAccounts, ...component.cccAccounts];

        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE)).toEqual(component.accountsPayables);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.BANK_ACCOUNT)).toEqual(component.bankAccounts);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT)).toEqual(component.cccAccounts);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.VENDOR)).toEqual(component.vendors);
        expect(component['getExistingOptions'](QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT)).toEqual(component.expenseAccounts);
        expect(component['getExistingOptions']('INVALID_KEY' as QboExportSettingDestinationOptionKey)).toEqual([]);
      });

      it('should handle option search correctly for different destination option keys', fakeAsync(() => {
        component.expenseAccounts = mockBankAccounts.results.map(account => ({ id: account.destination_id, name: account.value }));
        component.bankAccounts = mockBankAccounts.results.map(account => ({ id: account.destination_id, name: account.value }));

        spyOn(component as any, 'getExistingOptions').and.callThrough();
        spyOn(component as any, 'handleExpenseAccountSearch');
        spyOn(component as any, 'handleGeneralOptionSearch');

        component['handleOptionSearch'](mockExpenseAccountEvent);
        tick();

        expect(component['getExistingOptions']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT);
        expect(component['handleExpenseAccountSearch']).toHaveBeenCalledWith(mockExpenseAccountEvent, component.expenseAccounts);

        component['handleOptionSearch'](mockGeneralEvent);
        tick();

        expect(component['getExistingOptions']).toHaveBeenCalledWith(QboExportSettingDestinationOptionKey.BANK_ACCOUNT);
        expect(component['handleGeneralOptionSearch']).toHaveBeenCalledWith(mockGeneralEvent, component.bankAccounts);
      }));

      it('should update options correctly for all destination option keys', fakeAsync(() => {
        const mockOptions = mockBankAccounts.results.map(account => ({ id: account.destination_id, name: account.value }));

        component.accountsPayables = [];
        component.bankAccounts = [];
        component.cccAccounts = [];
        component.vendors = [];
        component.expenseAccounts = [];

        spyOn<any>(component, 'getPaginatedAttributes').and.returnValue(of(mockBankAccounts));

        // Test for ACCOUNTS_PAYABLE
        component['handleOptionSearch']({
          searchTerm: 'anish',
          destinationOptionKey: QboExportSettingDestinationOptionKey.ACCOUNTS_PAYABLE,
          destinationAttributes: [],
          formControllerName: 'accountsPayable'
        });
        tick();
        expect(component.accountsPayables).toEqual(mockOptions);

        // Test for BANK_ACCOUNT
        component['handleOptionSearch']({
          searchTerm: 'anish',
          destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
          destinationAttributes: [],
          formControllerName: 'bankAccount'
        });
        tick();
        expect(component.bankAccounts).toEqual(mockOptions);

        // Test for CREDIT_CARD_ACCOUNT
        component['handleOptionSearch']({
          searchTerm: 'anish',
          destinationOptionKey: QboExportSettingDestinationOptionKey.CREDIT_CARD_ACCOUNT,
          destinationAttributes: [],
          formControllerName: 'creditCardAccount'
        });
        tick();
        expect(component.cccAccounts).toEqual(mockOptions);

        // Test for VENDOR
        component['handleOptionSearch']({
          searchTerm: 'anish',
          destinationOptionKey: QboExportSettingDestinationOptionKey.VENDOR,
          destinationAttributes: [],
          formControllerName: 'vendor'
        });
        tick();
        expect(component.vendors).toEqual(mockOptions);

        // Test for EXPENSE_ACCOUNT
        spyOn<any>(component, 'handleExpenseAccountSearch').and.callFake(() => {
          component.expenseAccounts = mockOptions;
        });
        component['handleOptionSearch']({
          searchTerm: 'anish',
          destinationOptionKey: QboExportSettingDestinationOptionKey.EXPENSE_ACCOUNT,
          destinationAttributes: [],
          formControllerName: 'expenseAccount'
        });
        tick();
        expect(component.expenseAccounts).toEqual(mockOptions);
      }));
    });
  });

  describe('save', () => {
    beforeEach(() => {
      // Initialize exportSettings with mock data
      component.exportSettings = mockExportSettingsResponse;
      workspaceServiceSpy.setOnboardingState = jasmine.createSpy('setOnboardingState');
      // Spy on the save method
      spyOn(component, 'save').and.callThrough();

      // Initialize the form with required values
      component.exportSettingForm.patchValue({
        reimbursableExpenseObject: mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object,
        corporateCreditCardExpenseObject: mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object,
        reimbursableExpense: true,
        reimbursableExportType: mockExportSettingsResponse.workspace_general_settings.reimbursable_expenses_object,
        expenseState: mockExportSettingsResponse.expense_group_settings.expense_state,
        cccExpenseState: mockExportSettingsResponse.expense_group_settings.ccc_expense_state,
        reimbursableExportGroup: mockExportSettingsResponse.expense_group_settings.reimbursable_expense_group_fields[0],
        reimbursableExportDate: mockExportSettingsResponse.expense_group_settings.reimbursable_export_date_type,
        creditCardExportGroup: mockExportSettingsResponse.expense_group_settings.corporate_credit_card_expense_group_fields[0],
        creditCardExpense: true,
        creditCardExportDate: mockExportSettingsResponse.expense_group_settings.ccc_export_date_type,
        creditCardExportType: mockExportSettingsResponse.workspace_general_settings.corporate_credit_card_expenses_object,
        bankAccount: mockExportSettingsResponse.general_mappings.bank_account,
        defaultCCCAccount: mockExportSettingsResponse.general_mappings.default_ccc_account,
        accountsPayable: mockExportSettingsResponse.general_mappings.accounts_payable,
        defaultCreditCardVendor: mockExportSettingsResponse.general_mappings.default_ccc_vendor,
        nameInJournalEntry: mockExportSettingsResponse.workspace_general_settings.name_in_journal_entry
      });

      component.employeeSettingForm = new FormBuilder().group({
        employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
        autoMapEmployee: [AutoMapEmployeeOptions.EMAIL]
      });
    });

    xit('should handle error when saving export settings', fakeAsync(() => {
      // Mock the postExportSettings to return an error
      exportSettingsServiceSpy.postExportSettings.and.returnValue(throwError(() => new Error('API Error')));

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
        destinationAttributes: [],
        formControllerName: 'bankAccount'
      };

      component.searchOptionsDropdown(event);

      expect(component.isOptionSearchInProgress).toBe(true);
      expect(component['optionSearchUpdate'].next).toHaveBeenCalledWith(event);
    });

    it('should not call optionSearchUpdate.next when searchTerm is empty', () => {
      const event: ExportSettingOptionSearch = {
        searchTerm: '',
        destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT,
        destinationAttributes: [],
        formControllerName: 'bankAccount'
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

  describe('updateCCCExpenseGroupingDateOptions', () => {
    xit('should update CCC expense grouping date options correctly', () => {
      mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValues(
        of(mockBankAccounts),
        of(mockCreditCardAccounts),
        of(mockAccountsPayable),
        of(mockVendors)
      );
      // Testing CCC Expense Grouping Date Options
      component.exportSettingForm.patchValue({
        creditCardExpense: true,
        creditCardExportType: QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE
      });
      fixture.detectChanges();
      component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
      expect(component.exportSettingForm.get('creditCardExportType')?.value).toBe(QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
      expect(component.cccExpenseGroupingDateOptions).toEqual(mockCCCExpenseGroupingDateOptionsForCreditDebit);

      // Test for CREDIT CARD PURCHASE
      component.exportSettingForm.patchValue({
        creditCardExpense: true,
        creditCardExportType: QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE
      });
      fixture.detectChanges();
      component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.DEBIT_CARD_EXPENSE);
      expect(component.cccExpenseGroupingDateOptions).toEqual(mockCCCExpenseGroupingDateOptionsForCreditDebit);

      // Test for Journal Entry
      component.exportSettingForm.patchValue({
        creditCardExpense: true,
        creditCardExportType: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY
      });
      fixture.detectChanges();
      component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
      expect(component.cccExpenseGroupingDateOptions).toEqual(mockCCCExpenseGroupingDateOptions);

      const creditCardExportGroup = component.exportSettingForm.get('creditCardExportGroup');
      expect(creditCardExportGroup?.value).toBe(ExpenseGroupingFieldOption.EXPENSE_ID);
      expect(creditCardExportGroup?.disabled).toBeTrue();
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
      component.exportSettingForm.patchValue({
        reimbursableExportType: 'BILL',
        creditCardExportType: 'JOURNAL_ENTRY'
      });
    });

    it('should construct warning message for reimbursable expenses when single itemized journal entry is affected', () => {
      translocoService.translate.and.callFake(<T = string>(key: string): T => {
        const translations: Record<string, string> = {
          'qboExportSettings.reimbursableExpenseType': 'reimbursable',
          'qboExportSettings.configurationUpdateWarning': 'You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>, which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and automate your integration workflows'
        };
        return translations[key] as T;
      })
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(true);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(false);
      spyOn<any>(component, 'replaceContentBasedOnConfiguration').and.callThrough();

      const result = component['constructWarningMessage']();

      expect(component['replaceContentBasedOnConfiguration']).toHaveBeenCalledWith('BILL', 'EXPENSE', 'reimbursable');
      expect(result).toContain('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>');
    });

    it('should construct warning message for credit card expenses when single itemized journal entry is affected', () => {
    
      translocoService.translate.and.callFake(<T = string>(key: string): T => {
        const translations: Record<string, string> = {
          'qboExportSettings.creditCardExpenseType': 'credit card',
          'qboExportSettings.configurationUpdateWarning': 'You have changed the export type of credit card expense from <b>Credit_card_purchase</b> to <b>Journal_entry</b>, which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and automate your integration workflows'
        };
        return translations[key] as T;
      })
      component.exportSettingForm.patchValue({ reimbursableExportType: 'EXPENSE' });
      spyOn<any>(component, 'isSingleItemizedJournalEntryAffected').and.returnValue(true);
      spyOn<any>(component, 'isPaymentsSyncAffected').and.returnValue(false);
      const result = component['constructWarningMessage']();
      expect(result).toContain('You have changed the export type of credit card expense from <b>Credit_card_purchase</b> to <b>Journal_entry</b>');
    });

    it('should construct warning message when payments sync is affected', () => {
      translocoService.translate.and.callFake(<T = string>(key: string): T => {
        const translations: Record<string, string> = {
          'qboExportSettings.reimbursableExpenseType': 'reimbursable',
          'qboExportSettings.configurationUpdateWarning': 'You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>, which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and automate your integration workflows'
        };
        return translations[key] as T;
      })
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
      translocoService.translate.and.returnValue('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>, which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and automate your integration workflows');
      const result = component['replaceContentBasedOnConfiguration']('BILL', 'EXPENSE', 'reimbursable');
      expect(result).toContain('You have changed the export type of reimbursable expense from <b>Expense</b> to <b>Bill</b>');
    });

    it('should return correct content for new configuration', () => {
      translocoService.translate.and.returnValue('You have <b>selected a new export type</b> for the credit card expense, which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and automate your integration workflows.');
      const result = component['replaceContentBasedOnConfiguration']('BILL', 'None', 'credit card');
      expect(result).toContain('You have <b>selected a new export type</b> for the credit card expense');
    });

    it('should include additional content when updated to JOURNAL_ENTRY and isImportItemsEnabled is true', () => {
      translocoService.translate.and.returnValue('<br><br>Also, Products/services previously imported as categories in Fyle will be disabled');
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
      spyOn<any>(component, 'setupCustomWatchers').and.callThrough();

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
      component.exportSettingForm.patchValue({
        reimbursableExportGroup: '',
        creditCardExportType: QBOCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
        creditCardExportGroup: ''
      });
      component.reimbursableExpenseGroupingDateOptions = [];
      component.cccExpenseGroupingDateOptions = [];

      spyOn<any>(component, 'setupCustomDateOptionWatchers').and.callThrough();

      spyOn(QBOExportSettingModel, 'getReimbursableExpenseGroupingDateOptions').and.returnValue([]);
      spyOn(ExportSettingModel, 'constructGroupingDateOptions').and.returnValue([]);
      spyOn<any>(component, 'updateCCCExpenseGroupingDateOptions');
    });

    it('should update reimbursableExpenseGroupingDateOptions when reimbursableExportGroup changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        reimbursableExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID
      });

      expect(component.reimbursableExpenseGroupingDateOptions).toEqual(mockReimbursableExpenseDateGrouping);
    });

    it('should call updateCCCExpenseGroupingDateOptions when creditCardExportType changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        creditCardExportType: QBOCorporateCreditCardExpensesObject.BILL
      });

      expect(component.cccExpenseGroupingDateOptions).toEqual([]);
    });

    it('should update cccExpenseGroupingDateOptions when creditCardExportGroup changes', () => {
      component['setupCustomDateOptionWatchers']();

      component.exportSettingForm.patchValue({
        creditCardExportType: QBOCorporateCreditCardExpensesObject.BILL,
        creditCardExportGroup: ExpenseGroupingFieldOption.EXPENSE_ID
      });

      expect(component.cccExpenseGroupingDateOptions).toEqual(mockCCCExpenseDateGrouping);
    });
  });

  describe('optionSearchWatcher', () => {
    beforeEach(() => {
      // Restore the original method
      spyOn<any>(component, 'optionSearchWatcher').and.callThrough();

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

      // Emit the event
      component['optionSearchUpdate'].next(mockExportSettingOptionSearch);

      // Fast-forward time by 1000ms
      tick(1000);

      // Now expect handleOptionSearch to have been called with the mock event
      expect(component['handleOptionSearch']).toHaveBeenCalledWith(mockExportSettingOptionSearch);

      // Discard any remaining periodic tasks
      discardPeriodicTasks();
    }));

    it('should not call handleOptionSearch before debounce time', fakeAsync(() => {
      component['optionSearchWatcher']();

      component['optionSearchUpdate'].next(mockExportSettingOptionSearch);

      // Fast-forward time by 999ms
      tick(999);

      // Expect handleOptionSearch not to have been called
      expect(component['handleOptionSearch']).not.toHaveBeenCalled();

      // Discard any remaining periodic tasks
      discardPeriodicTasks();
    }));
  });

  describe('navigateToPreviousStep', () => {
    it('should navigate to connector when mapEmployees feature flag is true', () => {
      mockBrandingConfig.featureFlags.mapEmployees = true;
      component.navigateToPreviousStep();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/connector']);
    });
  });
});
