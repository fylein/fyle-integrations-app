import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IntacctExportSettingsComponent } from './intacct-export-settings.component';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { mockExportSettings, mockPaginatedDestinationAttributes } from '../../intacct.fixture';
import { EmployeeFieldMapping, ExpenseGroupingFieldOption, ExportDateType, FyleField, IntacctCorporateCreditCardExpensesObject, IntacctOnboardingState, IntacctReimbursableExpensesObject, Page, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingOptionSearch, ExportSettingModel } from 'src/app/core/models/common/export-settings.model';
import { IntacctDestinationAttribute, PaginatedintacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { ExportSettingGet, ExportSettingModel as IntacctExportSettingModel } from 'src/app/core/models/intacct/intacct-configuration/export-settings.model';
import { TitleCasePipe } from '@angular/common';

describe('IntacctExportSettingsComponent', () => {
  let component: IntacctExportSettingsComponent;
  let fixture: ComponentFixture<IntacctExportSettingsComponent>;
  let exportSettingService: jasmine.SpyObj<SiExportSettingService>;
  let mappingService: jasmine.SpyObj<SiMappingsService>;
  let workspaceService: jasmine.SpyObj<SiWorkspaceService>;
  let toastService: jasmine.SpyObj<IntegrationsToastService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let router: Router;

  beforeEach(async () => {
    const exportSettingServiceSpy = jasmine.createSpyObj('SiExportSettingService', ['getExportSettings', 'postExportSettings']);
    const mappingServiceSpy = jasmine.createSpyObj('SiMappingsService', ['getPaginatedDestinationAttributes', 'refreshSageIntacctDimensions', 'refreshFyleDimensions']);
    const workspaceServiceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getIntacctOnboardingState', 'setIntacctOnboardingState']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['trackTimeSpent', 'integrationsOnboardingCompletion', 'intacctUpdateEvent']);

    await TestBed.configureTestingModule({
      declarations: [ IntacctExportSettingsComponent ],
      imports: [ SharedModule, ReactiveFormsModule, RouterModule.forRoot([]) ],
      providers: [
        FormBuilder,
        { provide: SiExportSettingService, useValue: exportSettingServiceSpy },
        { provide: SiMappingsService, useValue: mappingServiceSpy },
        { provide: SiWorkspaceService, useValue: workspaceServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    exportSettingService = TestBed.inject(SiExportSettingService) as jasmine.SpyObj<SiExportSettingService>;
    mappingService = TestBed.inject(SiMappingsService) as jasmine.SpyObj<SiMappingsService>;
    workspaceService = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    toastService = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    exportSettingService.getExportSettings.and.returnValue(of(mockExportSettings));
    mappingService.refreshSageIntacctDimensions.and.returnValue(of(null));
    mappingService.refreshFyleDimensions.and.returnValue(of(null));

    const copy = structuredClone(mockPaginatedDestinationAttributes);
    mappingService.getPaginatedDestinationAttributes.and.returnValues(
      of(copy.ACCOUNT as unknown as PaginatedintacctDestinationAttribute),
      of(copy.EXPENSE_PAYMENT_TYPE as unknown as PaginatedintacctDestinationAttribute),
      of(copy.VENDOR as unknown as PaginatedintacctDestinationAttribute),
      of(copy.CHARGE_CARD_NUMBER as unknown as PaginatedintacctDestinationAttribute)
    );

    fixture = TestBed.createComponent(IntacctExportSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
    }));

    it('should initialize destination options correctly', () => {

      expect(component.destinationOptions.ACCOUNT).toEqual(jasmine.arrayContaining(
        mockPaginatedDestinationAttributes.ACCOUNT.results
      ) as unknown as IntacctDestinationAttribute[]);

      expect(component.destinationOptions.EXPENSE_PAYMENT_TYPE).toEqual(jasmine.arrayContaining(
        (mockPaginatedDestinationAttributes.EXPENSE_PAYMENT_TYPE.results)
          .filter((attr) => attr.detail.is_reimbursable)
      ) as unknown as IntacctDestinationAttribute[]);

      expect(component.destinationOptions.CCC_EXPENSE_PAYMENT_TYPE).toEqual(jasmine.arrayContaining(
        (mockPaginatedDestinationAttributes.EXPENSE_PAYMENT_TYPE.results)
          .filter((attr) => !attr.detail.is_reimbursable)
      ) as unknown as IntacctDestinationAttribute[]);

      expect(component.destinationOptions.VENDOR).toEqual(jasmine.arrayContaining(
        mockPaginatedDestinationAttributes.VENDOR.results
      ) as unknown as IntacctDestinationAttribute[]);

      expect(component.destinationOptions.CHARGE_CARD).toEqual(jasmine.arrayContaining(
        mockPaginatedDestinationAttributes.CHARGE_CARD_NUMBER.results as unknown as IntacctDestinationAttribute[]
      ) as unknown as IntacctDestinationAttribute[]);
    });

    it('should add missing destination options', () => {

      expect(component.destinationOptions.ACCOUNT).toContain({
        destination_id: mockExportSettings.general_mappings.default_gl_account.id,
        value: mockExportSettings.general_mappings.default_gl_account.name
      } as unknown as IntacctDestinationAttribute);

      expect(component.destinationOptions.ACCOUNT).toContain({
        destination_id: mockExportSettings.general_mappings.default_credit_card.id,
        value: mockExportSettings.general_mappings.default_credit_card.name
      } as unknown as IntacctDestinationAttribute);

    });

    it('should fetch and store export settings', () => {
      expect(exportSettingService.getExportSettings).toHaveBeenCalled();
      expect(component.exportSettings).toEqual(mockExportSettings);
      expect(component.exportSettingsForm).toBeDefined();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Form Save', () => {
    it('should save export settings successfully during onboarding', fakeAsync(() => {
      workspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.EXPORT_SETTINGS);
      exportSettingService.postExportSettings.and.returnValue(of(mockExportSettings));
      spyOnProperty(router, 'url').and.returnValue('/integrations/intacct/onboarding/export_settings');

      fixture.detectChanges();
      component.save();
      tick();

      expect(exportSettingService.postExportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      expect(trackingService.integrationsOnboardingCompletion).toHaveBeenCalled();
      expect(workspaceService.setIntacctOnboardingState).toHaveBeenCalledWith(IntacctOnboardingState.IMPORT_SETTINGS);
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/import_settings']);
    }));

    it('should save export settings successfully post onboarding', () => {
      workspaceService.getIntacctOnboardingState.and.returnValue(IntacctOnboardingState.COMPLETE);
      exportSettingService.postExportSettings.and.returnValue(of(mockExportSettings));

      fixture.detectChanges();
      component.save();

      expect(exportSettingService.postExportSettings).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Export settings saved successfully');
      expect(trackingService.intacctUpdateEvent).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle save failure', () => {
      exportSettingService.postExportSettings.and.returnValue(throwError(() => new Error('API Error')));

      fixture.detectChanges();
      component.save();

      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving export settings, please try again later');
      expect(component.saveInProgress).toBeFalse();
    });
  });

  describe('Utility Functions', () => {
    it('should handle refresh dimensions', () => {
      component.refreshDimensions(true);
      expect(mappingService.refreshSageIntacctDimensions).toHaveBeenCalled();
      expect(mappingService.refreshFyleDimensions).toHaveBeenCalled();
      expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Syncing data dimensions from Sage Intacct');
    });

    it('should navigate to previous step', () => {
      component.navigateToPreviousStep();
      expect(router.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/connector']);
    });

    it('should return the correct employee field mapping', () => {
      fixture.detectChanges();

      expect(
        component.getEmployeeFieldMapping(FyleField.VENDOR, IntacctReimbursableExpensesObject.BILL)
      ).toBe('Vendor');

      expect(component.getEmployeeFieldMapping(null, IntacctReimbursableExpensesObject.JOURNAL_ENTRY))
        .toBe(new TitleCasePipe().transform(component.exportSettingsForm.get('employeeFieldMapping')?.value));

      expect(component.getEmployeeFieldMapping(null, IntacctReimbursableExpensesObject.BILL))
        .toBe('Vendor');
    });

    it('should get the correct export type', () => {
      expect(component.getExportType(IntacctReimbursableExpensesObject.JOURNAL_ENTRY)).toBe('Journal_entry');
      expect(component.getExportType(IntacctReimbursableExpensesObject.BILL)).toBe('Bill');
      expect(component.getExportType(IntacctReimbursableExpensesObject.EXPENSE_REPORT)).toBe('Expense_report');
      expect(component.getExportType(null)).toBe('export');
    });
  });

  describe('Watchers', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('Reimbursable Expense Toggle Watcher', () => {
      it('should enable fields on enabling reimbursable expenses', fakeAsync(() => {
        component.exportSettingsForm.get('reimbursableExpense')?.setValue(true);
        tick();

        expect(component.exportSettingsForm.get('reimbursableExportType')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('reimbursableExportGroup')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('reimbursableExportDate')?.hasValidator(Validators.required)).toBeTrue();
      }));

      it('should disable fields on disabling reimbursable expenses', fakeAsync(() => {
        component.exportSettingsForm.get('reimbursableExpense')?.setValue(false);
        tick();

        expect(component.exportSettingsForm.get('reimbursableExportType')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('reimbursableExportGroup')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('reimbursableExportDate')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('reimbursableExportType')?.value).toBeNull();
      }));
    });

    describe('Reimbursable Export Type Watchers', () => {

      it('should handle reimbursableExportType being changed to Journal Entry', fakeAsync(() => {
        component.exportSettingsForm.get('reimbursableExportType')?.setValue(IntacctReimbursableExpensesObject.JOURNAL_ENTRY);
        tick();

        expect(component.exportSettingsForm.get('glAccount')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('employeeFieldMapping')?.enabled).toBeTrue();
      }));

      it('should handle reimbursableExportType being changed to Expense Report', fakeAsync(() => {
        component.exportSettingsForm.get('reimbursableExportType')?.setValue(IntacctReimbursableExpensesObject.EXPENSE_REPORT);
        tick();

        expect(component.exportSettingsForm.get('employeeFieldMapping')?.value).toBe(FyleField.EMPLOYEE);
        expect(component.exportSettingsForm.get('employeeFieldMapping')?.disabled).toBeTrue();
      }));

      it('should handle reimbursableExportType being changed to Bill', fakeAsync(() => {
        component.exportSettingsForm.get('reimbursableExportType')?.setValue(IntacctReimbursableExpensesObject.BILL);
        tick();

        expect(component.exportSettingsForm.get('employeeFieldMapping')?.value).toBe(FyleField.VENDOR);
        expect(component.exportSettingsForm.get('employeeFieldMapping')?.disabled).toBeTrue();
      }));
    });

    describe('Credit Card Expense Toggle Watcher', () => {
      it('should enable fields on enabling CCC expenses', fakeAsync(() => {
        component.exportSettingsForm.get('creditCardExpense')?.setValue(true);
        tick();

        expect(component.exportSettingsForm.get('cccExportType')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('cccExportGroup')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('cccExportDate')?.hasValidator(Validators.required)).toBeTrue();
      }));

      it('should disable fields on disabling CCC expenses', fakeAsync(() => {
        component.exportSettingsForm.get('creditCardExpense')?.setValue(false);
        tick();

        expect(component.exportSettingsForm.get('cccExportType')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('cccExportGroup')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('cccExportDate')?.hasValidator(Validators.required)).toBeFalse();
        expect(component.exportSettingsForm.get('cccExportType')?.value).toBeNull();
      }));
    });

    describe('CCC Export Type Watchers', () => {
      it('should handle cccExportType being changed to Charge Card Transaction', fakeAsync(() => {
        component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
        tick();

        expect(component.exportSettingsForm.get('chargeCard')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.exportSettingsForm.get('cccExportGroup')?.disabled).toBeTrue();
        expect(component.exportSettingsForm.get('cccExportGroup')?.value).toBe(ExpenseGroupingFieldOption.EXPENSE_ID);
      }));

      it('should handle cccExportType being changed to Bill', fakeAsync(() => {
        component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.BILL);
        tick();

        expect(component.exportSettingsForm.get('creditCardVendor')?.hasValidator(Validators.required)).toBeTrue();
      }));

      it('should handle cccExportType being changed to Expense Report', fakeAsync(() => {
        component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT);
        tick();

        expect(component.exportSettingsForm.get('employeeFieldMapping')?.value).toBe(EmployeeFieldMapping.EMPLOYEE);
        expect(component.exportSettingsForm.get('cccExpensePaymentType')?.hasValidator(Validators.required)).toBeTrue();
      }));

      it('should handle cccExportType being changed to Journal Entry', fakeAsync(() => {
        component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.JOURNAL_ENTRY);
        tick();

        expect(component.exportSettingsForm.get('employeeFieldMapping')?.enabled).toBeTrue();
        expect(component.exportSettingsForm.get('creditCard')?.hasValidator(Validators.required)).toBeTrue();
      }));
    });

    describe('Custom Watchers', () => {
      beforeEach(() => {
        brandingConfig.brandId = 'fyle';
      });

      it('should update reimbursable expense grouping date options when group changes', fakeAsync(() => {
        fixture.detectChanges();
        component.exportSettingsForm.get('reimbursableExportGroup')?.setValue(ExpenseGroupingFieldOption.CLAIM_NUMBER);
        tick();

        expect(component.reimbursableExpenseGroupingDateOptions).not.toContain({
          label: 'Spend date',
          value: ExportDateType.SPENT_AT
        });
      }));

      it('should update CCC expense grouping date options when group changes', fakeAsync(() => {
        spyOn<IntacctExportSettingsComponent, any>(component, 'setCCExpenseDateOptions').and.callThrough();
        spyOn(IntacctExportSettingModel, 'getExpenseGroupingDateOptions').and.callThrough();
        spyOn(ExportSettingModel, 'constructGroupingDateOptions').and.callThrough();

        component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
        component.exportSettingsForm.get('cccExportGroup')?.setValue(ExpenseGroupingFieldOption.CLAIM_NUMBER);

        tick();

        expect(IntacctExportSettingModel.getExpenseGroupingDateOptions).toHaveBeenCalledWith();
        expect(ExportSettingModel.constructGroupingDateOptions).toHaveBeenCalledWith(
          ExpenseGroupingFieldOption.CLAIM_NUMBER,
          IntacctExportSettingModel.getExpenseGroupingDateOptions()
        );
        expect(component['setCCExpenseDateOptions']).toHaveBeenCalled();
      }));
    });

    describe('Export Selection Validator', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should invalidate form when neither reimbursable nor credit card expense is selected', () => {
        component.exportSettingsForm.get('reimbursableExpense')?.setValue(false);
        component.exportSettingsForm.get('creditCardExpense')?.setValue(false);

        expect(component.exportSettingsForm.valid).toBeFalse();
      });

      it('should validate the form when at least one export type is selected', () => {
        component.exportSettingsForm.get('reimbursableExpense')?.setValue(true);
        component.exportSettingsForm.get('creditCardExpense')?.setValue(false);

        expect(component.exportSettingsForm.valid).toBeTrue();
      });
    });

    describe('Destination Options Handling', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should handle option search for reimbursable expense payment type', fakeAsync(() => {
        const searchEvent = {
          searchTerm: 'test',
          destinationOptionKey: 'EXPENSE_PAYMENT_TYPE'
        } as ExportSettingOptionSearch;

        mappingService.getPaginatedDestinationAttributes.and.returnValue(
          of(mockPaginatedDestinationAttributes.EXPENSE_PAYMENT_TYPE as unknown as PaginatedintacctDestinationAttribute)
        );

        component.searchOptionsDropdown(searchEvent);
        tick(1000);

        expect(mappingService.getPaginatedDestinationAttributes).toHaveBeenCalledWith('EXPENSE_PAYMENT_TYPE', 'test');
        expect(component.destinationOptions.EXPENSE_PAYMENT_TYPE.every(option => (option.detail ? option.detail.is_reimbursable : true))).toBeTrue();
        expect(component.isOptionSearchInProgress).toBeFalse();
      }));

      it('should handle option search for CCC expense payment type', fakeAsync(() => {
        const searchEvent = {
          searchTerm: 'test',
          destinationOptionKey: 'CCC_EXPENSE_PAYMENT_TYPE'
        };

        mappingService.getPaginatedDestinationAttributes.and.returnValue(
          of(mockPaginatedDestinationAttributes.EXPENSE_PAYMENT_TYPE as unknown as PaginatedintacctDestinationAttribute)
        );

        component.searchOptionsDropdown(searchEvent as ExportSettingOptionSearch);
        tick(1000);

        expect(mappingService.getPaginatedDestinationAttributes).toHaveBeenCalledWith('EXPENSE_PAYMENT_TYPE', 'test');
        expect(component.destinationOptions.CCC_EXPENSE_PAYMENT_TYPE.every(option => (
          option.detail ? !option.detail.is_reimbursable : true
        ))).toBeTrue();
        expect(component.isOptionSearchInProgress).toBeFalse();
      }));
    });


  });

  describe('C1 Specific Behavior', () => {
    it('should handle setup with c1 branding', () => {
      brandingConfig.brandId = 'co';

      fixture = TestBed.createComponent(IntacctExportSettingsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.exportSettingsForm.get('creditCardExpense')?.value).toBeTrue();
      expect(component.exportSettingsForm.get('employeeFieldMapping')?.value).toBe(FyleField.VENDOR);
      expect(component.isMultiLineOption).toBeFalse();
    });

    afterAll(() => {
      brandingConfig.brandId = 'fyle';
    });
  });

  describe('Edge Cases', () => {
    it('should set the correct CCC expense grouping date options when CCC expense object is unset', () => {
      component.exportSettings = {
        configurations: {
          corporate_credit_card_expenses_object: null
        }
      } as ExportSettingGet;
      spyOn<any>(component, 'setCCExpenseDateOptions');

      component['setupCCCExpenseGroupingDateOptions']();
      expect(component['setCCExpenseDateOptions']).toHaveBeenCalledOnceWith(IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
    });

    it('should default CCC expense grouping date options to reimbursable grouping date options for non-charge card transactions', () => {
      fixture.detectChanges();

      component['setCCExpenseDateOptions'](IntacctCorporateCreditCardExpensesObject.BILL);
      expect(component.cccExpenseGroupingDateOptions).toEqual(component.reimbursableExpenseGroupingDateOptions);
    });

    it('should set the correct CCC expense grouping date options when grouping by report', () => {
      fixture.detectChanges();

      component.exportSettingsForm.get('cccExportType')?.setValue(IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION);
      component['updateCCCGroupingDateOptions'](ExpenseGroupingFieldOption.CLAIM_NUMBER);

      expect(component.cccExpenseGroupingDateOptions).toEqual([
        {
          label: brandingContent.common.currentDate,
          value: ExportDateType.CURRENT_DATE
        },
        {
          label: 'Last Spend Date',
          value: ExportDateType.LAST_SPENT_AT
        },
        {
          label: 'Approved Date',
          value: ExportDateType.APPROVAL_DATE
        },
        {
          label: 'Card Transaction Post date',
          value: ExportDateType.POSTED_AT
        }
      ]);
    });

    it('should enable the employeeFieldMapping field when at least one export type is Journal Entry', () => {
      fixture.detectChanges();
      component.exportSettings.configurations.reimbursable_expenses_object = IntacctReimbursableExpensesObject.JOURNAL_ENTRY;
      component.exportSettings.configurations.corporate_credit_card_expenses_object = IntacctCorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION;

      component['exportFieldsWatcher']();

      expect(component.exportSettingsForm.get('employeeFieldMapping')?.enabled).toBeTrue();
    });
  });
});