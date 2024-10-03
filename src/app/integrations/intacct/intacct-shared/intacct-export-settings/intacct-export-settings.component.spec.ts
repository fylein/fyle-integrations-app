import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IntacctExportSettingsComponent } from './intacct-export-settings.component';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { mockExportSettings, mockPaginatedDestinationAttributes } from '../../intacct.fixture';
import { IntacctOnboardingState, Page, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ExportSettingOptionSearch } from 'src/app/core/models/common/export-settings.model';
import { IntacctDestinationAttribute, PaginatedintacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import { SharedModule } from 'src/app/shared/shared.module';

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

    const copy =  structuredClone(mockPaginatedDestinationAttributes);
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
});