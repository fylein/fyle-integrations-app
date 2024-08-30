import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { QboExportSettingsComponent } from './qbo-export-settings.component';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { HttpClientModule } from '@angular/common/http';
import { mockExportSettings, mockPaginatedDestinationAttributes } from '../../qbo.fixture';
import { QBOCorporateCreditCardExpensesObject, QboExportSettingDestinationOptionKey, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';

describe('QboExportSettingsComponent', () => {
  let component: QboExportSettingsComponent;
  let fixture: ComponentFixture<QboExportSettingsComponent>;
  let exportSettingsServiceSpy: jasmine.SpyObj<QboExportSettingsService>;
  let helperServiceSpy: jasmine.SpyObj<HelperService>;
  let qboHelperServiceSpy: jasmine.SpyObj<QboHelperService>;
  let mappingServiceSpy: jasmine.SpyObj<MappingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let windowServiceSpy: jasmine.SpyObj<WindowService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;

  beforeEach(async () => {
    const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'postExportSettings', 'setupDynamicValidators', 'setExportTypeValidatorsAndWatchers']);
    const helperService = jasmine.createSpyObj('HelperService', [
      'addExportSettingFormValidator',
      'setConfigurationSettingValidatorsAndWatchers',
      'setOrClearValidators',
      'enableFormField',
      'addDefaultDestinationAttributeIfNotExists'
    ]);
    const qboHelperService = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const mappingService = jasmine.createSpyObj('MappingService', ['getPaginatedDestinationAttributes']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const toastService = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const windowService = jasmine.createSpyObj('WindowService', ['nativeWindow']);
    const workspaceService = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'setOnboardingState']);

    await TestBed.configureTestingModule({
      declarations: [ QboExportSettingsComponent ],
      imports: [ ReactiveFormsModule, HttpClientModule ],
      providers: [
        FormBuilder,
        { provide: QboExportSettingsService, useValue: exportSettingsService },
        { provide: HelperService, useValue: helperService },
        { provide: QboHelperService, useValue: qboHelperService },
        { provide: MappingService, useValue: mappingService },
        { provide: Router, useValue: router },
        { provide: IntegrationsToastService, useValue: toastService },
        { provide: WindowService, useValue: windowService },
        { provide: WorkspaceService, useValue: workspaceService }
      ]
    }).compileComponents();

    exportSettingsServiceSpy = TestBed.inject(QboExportSettingsService) as jasmine.SpyObj<QboExportSettingsService>;
    helperServiceSpy = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    qboHelperServiceSpy = TestBed.inject(QboHelperService) as jasmine.SpyObj<QboHelperService>;
    mappingServiceSpy = TestBed.inject(MappingService) as jasmine.SpyObj<MappingService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(IntegrationsToastService) as jasmine.SpyObj<IntegrationsToastService>;
    windowServiceSpy = TestBed.inject(WindowService) as jasmine.SpyObj<WindowService>;
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jasmine.SpyObj<WorkspaceService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboExportSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call refreshQBODimensions when refreshDimensions is called', () => {
    qboHelperServiceSpy.refreshQBODimensions.and.returnValue(of({}));
    component.refreshDimensions();
    expect(qboHelperServiceSpy.refreshQBODimensions).toHaveBeenCalled();
  });

  xit('should initialize component and setup form', fakeAsync(() => {
    exportSettingsServiceSpy.getExportSettings.and.returnValue(of(mockExportSettings));
    workspaceServiceSpy.getWorkspaceGeneralSettings.and.returnValue(of({ employee_field_mapping: 'EMPLOYEE' }));
    mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValue(of(mockPaginatedDestinationAttributes));
    windowServiceSpy.nativeWindow.location = {} as any; // Initialize the location object
    windowServiceSpy.nativeWindow.location.pathname = '/onboarding'; // Set the pathname property

    component.ngOnInit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.exportSettings).toEqual(mockExportSettings);
    expect(component.employeeFieldMapping).toEqual('EMPLOYEE');
    expect(component.bankAccounts.length).toBeGreaterThan(0);
    expect(component.exportSettingForm).toBeDefined();
  }));

  it('should save export settings successfully', fakeAsync(() => {
    component.exportSettings = mockExportSettings;
    component.exportSettingForm = new FormBuilder().group({
      reimbursableExportType: ['BILL'],
      creditCardExportType: ['BILL']
    });
    exportSettingsServiceSpy.postExportSettings.and.returnValue(of(mockExportSettings));
    
    component.save();
    tick();

    expect(exportSettingsServiceSpy.postExportSettings).toHaveBeenCalled();
    expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Export settings saved successfully');
  }));

  it('should navigate to import settings page after saving during onboarding', fakeAsync(() => {
    component.isOnboarding = true;
    component.exportSettings = mockExportSettings;
    component.exportSettingForm = new FormBuilder().group({
      reimbursableExportType: ['BILL'],
      creditCardExportType: ['BILL']
    });
    exportSettingsServiceSpy.postExportSettings.and.returnValue(of(mockExportSettings));
    
    component.save();
    tick();

    expect(workspaceServiceSpy.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.IMPORT_SETTINGS);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/import_settings']);
  }));

  it('should update CCC expense grouping date options when credit card export type changes', () => {
    component.exportSettingForm = new FormBuilder().group({
      creditCardExportType: ['CREDIT_CARD_PURCHASE'],
      creditCardExportGroup: ['']
    });
    
    component['updateCCCExpenseGroupingDateOptions'](QBOCorporateCreditCardExpensesObject.CREDIT_CARD_PURCHASE);
    
    expect(component.cccExpenseGroupingDateOptions.length).toBeGreaterThan(0);
    expect(component.exportSettingForm.get('creditCardExportGroup')?.value).toEqual('expense_id');
    expect(component.exportSettingForm.get('creditCardExportGroup')?.disabled).toBeTrue();
  });

  xit('should handle option search', fakeAsync(() => {
    const mockResponse = { results: [{ id: '1', name: 'Test Account' }] };
    mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValue(of(mockPaginatedDestinationAttributes));
    
    component.searchOptionsDropdown({ destinationOptionKey: QboExportSettingDestinationOptionKey.BANK_ACCOUNT, searchTerm: 'test', destinationAttributes: [],});
    tick(1000);

    expect(component.bankAccounts.some(account => account.name === 'Test Account')).toBeTrue();
    expect(component.isOptionSearchInProgress).toBeFalse();
  }));
});