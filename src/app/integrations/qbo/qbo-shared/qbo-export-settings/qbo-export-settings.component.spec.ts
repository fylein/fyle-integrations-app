import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api'; // Import MessageService

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
  mockSaveResponse
} from '../../qbo.fixture';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { EmployeeFieldMapping, SplitExpenseGrouping, ToastSeverity } from 'src/app/core/models/enum/enum.model';

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

  beforeEach(async () => {
    const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'setupDynamicValidators', 'setExportTypeValidatorsAndWatchers', 'postExportSettings']);
    const helperService = jasmine.createSpyObj('HelperService', ['addExportSettingFormValidator', 'setConfigurationSettingValidatorsAndWatchers', 'setOrClearValidators', 'addDefaultDestinationAttributeIfNotExists']);
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
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    exportSettingsServiceSpy = TestBed.inject(QboExportSettingsService) as jasmine.SpyObj<QboExportSettingsService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    mappingServiceSpy = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
    windowServiceSpy = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    integrationsToastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
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

      expect(component['setupCustomWatchers']).toHaveBeenCalled();
      expect(component['setupCustomDateOptionWatchers']).toHaveBeenCalled();
      expect(component['optionSearchWatcher']).toHaveBeenCalled();

      expect(exportSettingsServiceSpy.setExportTypeValidatorsAndWatchers).toHaveBeenCalled();

      expect(component.isLoading).toBeFalse();
    }));

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
  });

  describe('save', () => {
    beforeEach(() => {
      // Initialize exportSettings with mock data
      component.exportSettings = mockExportSettingsResponse;
    });
    it('should save export settings and navigate on success', fakeAsync(() => {
      exportSettingsServiceSpy.postExportSettings.and.returnValue(of(mockExportSettingsResponse));
      
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

      expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalledWith(jasmine.any(Object));
    }));

    it('should display error message on save failure', fakeAsync(() => {
      const errorResponse = new Error('Save failed');
      exportSettingsServiceSpy.postExportSettings.and.returnValue(throwError(() => errorResponse));

      component.save();
      tick();

      expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalled();
      expect(integrationsToastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
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
  });
});