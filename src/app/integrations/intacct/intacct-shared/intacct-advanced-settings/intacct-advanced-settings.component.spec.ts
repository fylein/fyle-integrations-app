import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { IntacctAdvancedSettingsComponent } from './intacct-advanced-settings.component';
import { SiAdvancedSettingService } from 'src/app/core/services/si/si-configuration/si-advanced-setting.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SkipExportComponent } from 'src/app/shared/components/si/helper/skip-export/skip-export.component';
import { adminEmails, advancedSettings, configurationForAddvancedSettings, expenseFilter, groupedAttributes } from '../../intacct.fixture';
import { ExpenseFilterResponse } from 'src/app/core/models/intacct/intacct-configuration/advanced-settings.model';
import { SharedModule } from 'src/app/shared/shared.module';

describe('IntacctAdvancedSettingsComponent', () => {
  let component: IntacctAdvancedSettingsComponent;
  let fixture: ComponentFixture<IntacctAdvancedSettingsComponent>;
  let advancedSettingsService: jasmine.SpyObj<SiAdvancedSettingService>;
  let router: Router;
  let toastService: jasmine.SpyObj<IntegrationsToastService>;
  let trackingService: jasmine.SpyObj<TrackingService>;
  let workspaceService: jasmine.SpyObj<SiWorkspaceService>;
  let mappingService: jasmine.SpyObj<SiMappingsService>;


  beforeEach(async () => {
    const advancedSettingsServiceSpy = jasmine.createSpyObj('SiAdvancedSettingService', ['getAdvancedSettings', 'getExpenseFilter', 'getAdditionalEmails']);
    const toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const trackingServiceSpy = jasmine.createSpyObj('TrackingService', ['trackTimeSpent', 'integrationsOnboardingCompletion', 'intacctUpdateEvent']);
    const workspaceServiceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getIntacctOnboardingState', 'setIntacctOnboardingState']);
    const mappingServiceSpy = jasmine.createSpyObj('SiMappingsService', ['getGroupedDestinationAttributes', 'getConfiguration', 'refreshSageIntacctDimensions', 'refreshFyleDimensions']);
    await TestBed.configureTestingModule({
      declarations: [ IntacctAdvancedSettingsComponent, SkipExportComponent ],
      imports: [ SharedModule, ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: SiAdvancedSettingService, useValue: advancedSettingsServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: TrackingService, useValue: trackingServiceSpy },
        { provide: SiWorkspaceService, useValue: workspaceServiceSpy },
        { provide: SiMappingsService, useValue: mappingServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    advancedSettingsService = TestBed.inject(SiAdvancedSettingService) as jasmine.SpyObj<SiAdvancedSettingService>;
    toastService = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    trackingService = TestBed.inject(TrackingService) as jasmine.SpyObj<TrackingService>;
    workspaceService = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
    mappingService = TestBed.inject(SiMappingsService) as jasmine.SpyObj<SiMappingsService>;
    router = TestBed.inject(Router);

    advancedSettingsService.getAdditionalEmails.and.returnValue(of(adminEmails));
    advancedSettingsService.getAdvancedSettings.and.returnValue(of(advancedSettings));
    advancedSettingsService.getExpenseFilter.and.returnValue(of(expenseFilter as ExpenseFilterResponse));
    mappingService.getGroupedDestinationAttributes.and.returnValue(of(groupedAttributes));
    mappingService.getConfiguration.and.returnValue(of(configurationForAddvancedSettings));

    fixture = TestBed.createComponent(IntacctAdvancedSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.adminEmails).toEqual(adminEmails.concat(advancedSettings.workspace_schedules.additional_email_options));
    expect(component.advancedSettings).toEqual(advancedSettings);
    expect(component.sageIntacctLocations).toEqual(groupedAttributes.LOCATION);
    expect(component.sageIntacctDefaultItem).toEqual(groupedAttributes.ITEM);
    expect(component.sageIntacctDepartments).toEqual(groupedAttributes.DEPARTMENT);
    expect(component.sageIntacctProjects).toEqual(groupedAttributes.PROJECT);
    expect(component.sageIntacctClasses).toEqual(groupedAttributes.CLASS);
    expect(component.sageIntacctPaymentAccount).toEqual(groupedAttributes.PAYMENT_ACCOUNT);
    expect(component.reimbursableExpense).toEqual(configurationForAddvancedSettings.reimbursable_expenses_object);
    expect(component.corporateCreditCardExpense).toEqual(configurationForAddvancedSettings.corporate_credit_card_expenses_object);
    expect(component.importVendorsAsMerchants).toEqual(configurationForAddvancedSettings.import_vendors_as_merchants);
    expect(component.useMerchantInJournalLine).toEqual(configurationForAddvancedSettings.use_merchant_in_journal_line);
    expect(component.employeeFieldMapping).toEqual(configurationForAddvancedSettings.employee_field_mapping);
  }));

  it('should initialize forms correctly', () => {
    fixture.detectChanges();

    expect(component.advancedSettingsForm).toBeDefined();
    expect(component.skipExportForm).toBeDefined();

    expect(component.advancedSettingsForm.get('exportSchedule')?.value).toBeTrue();
    expect(component.advancedSettingsForm.get('exportScheduleFrequency')?.value).toBe(12);
    expect(component.advancedSettingsForm.get('setDescriptionField')?.value).toEqual(['employee_email', 'merchant', 'purpose']);
  });

  it('should handle onboarding state correctly', () => {
    spyOnProperty(router, 'url').and.returnValue('/integrations/intacct/onboarding/advanced_settings');
    fixture.detectChanges();

    expect(component.isOnboarding).toBeTrue();
  });

  it('should handle non-onboarding state correctly', () => {
    spyOnProperty(router, 'url').and.returnValue('/integrations/intacct/advanced_settings');
    fixture.detectChanges();

    expect(component.isOnboarding).toBeFalse();
  });

  it('should create memo preview correctly', () => {
    fixture.detectChanges();

    const expectedPreview = 'john.doe@acme.com - Pizza Hut - Client Meeting';
    expect(component.memoPreviewText).toBe(expectedPreview);
  });
});