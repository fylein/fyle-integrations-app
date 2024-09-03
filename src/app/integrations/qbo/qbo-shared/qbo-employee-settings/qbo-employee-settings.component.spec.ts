import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { QboEmployeeSettingsComponent } from './qbo-employee-settings.component';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QBOEmployeeSettingGet, QBOEmployeeSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { AutoMapEmployeeOptions, ConfigurationWarningEvent, EmployeeFieldMapping, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/common/api.service';
import { employeeSettingsPayload, mockDestinationAttributes, mockEmployeeSettingPayload, mockEmployeeSettingResponse, mockEmployeeSettings, mockExportSettings, qboEmployeeSettingResponse } from '../../qbo.fixture';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { fakeAsync, tick } from '@angular/core/testing';

describe('QboEmployeeSettingsComponent', () => {
  let component: QboEmployeeSettingsComponent;
  let fixture: ComponentFixture<QboEmployeeSettingsComponent>;
  let employeeSettingsService: QboEmployeeSettingsService;
  let router: Router;
  let toastService: IntegrationsToastService;
  let workspaceService: WorkspaceService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const workspace_id = 1;

  const toastServiceMock = {
    displayToastMessage: jasmine.createSpy('displayToastMessage')
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const workspaceServiceMock = {
    getWorkspaceId: jasmine.createSpy('getWorkspaceId').and.returnValue(workspace_id),
    setOnboardingState: jasmine.createSpy('setOnboardingState')
  };

  const mockWarning: ConfigurationWarningOut = {
    hasAccepted: true,
    event: ConfigurationWarningEvent.CLONE_SETTINGS
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);
    await TestBed.configureTestingModule({
      declarations: [QboEmployeeSettingsComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        QboEmployeeSettingsService,
        QboExportSettingsService,
        IntegrationsToastService,
        WindowService,
        WorkspaceService,
        { provide: MessageService, useValue: {} },
        { provide: IntegrationsToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: WorkspaceService, useValue: workspaceServiceMock },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboEmployeeSettingsComponent);
    component = fixture.componentInstance;
    employeeSettingsService = TestBed.inject(QboEmployeeSettingsService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(IntegrationsToastService);
    workspaceService = TestBed.inject(WorkspaceService);
  });

  it('should load employee settings, attributes, and export settings', () => {
    apiServiceSpy.get.and.returnValues(
      of(mockEmployeeSettings),
      of(mockDestinationAttributes),
      of(mockExportSettings)
    );

    fixture.detectChanges();

    expect(apiServiceSpy.get.calls.count()).toBe(3);
    expect(component.employeeSetting).toEqual(mockEmployeeSettings);
    expect(component.liveEntityExample).toEqual({
      EMPLOYEE: 'Anish Sinh',
      VENDOR: '1'
    });
    expect(component.reimbursableExportType).toBe(QBOReimbursableExpensesObject.BILL);
  });

  it('should save employee settings successfully', () => {
    component.isOnboarding = true;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });

    spyOn(employeeSettingsService, 'postEmployeeSettings').and.returnValue(of(mockEmployeeSettingResponse));

    component.save();

    component.acceptWarning(mockWarning);

    expect(employeeSettingsService.postEmployeeSettings).toHaveBeenCalledWith(mockEmployeeSettingPayload);
    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Employee settings saved successfully');
    expect(workspaceService.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.EXPORT_SETTINGS);
    expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/export_settings']);
  });

  it('postEmployeeSettings service check', () => {
    apiServiceSpy.put.and.returnValue(of(qboEmployeeSettingResponse));
    employeeSettingsService.postEmployeeSettings(employeeSettingsPayload).subscribe(
      (result) => {
        expect(result).toEqual(qboEmployeeSettingResponse);
      }
    );

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`/v2/workspaces/${workspace_id}/map_employees/`, employeeSettingsPayload);
  });

  it('should save employee settings successfully when not onboarding and export settings are not affected', fakeAsync(() => {
    component.isOnboarding = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });
  
    spyOn(employeeSettingsService, 'postEmployeeSettings').and.returnValue(of(mockEmployeeSettingResponse));
    spyOn(component as any, 'exportSettingAffected').and.returnValue(false);
  
    component.save();
  
    tick();
  
    expect(employeeSettingsService.postEmployeeSettings).toHaveBeenCalledWith(mockEmployeeSettingPayload);
    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Employee settings saved successfully');
  }));
  
  it('should handle error when saving employee settings', fakeAsync(() => {
    component.isOnboarding = true;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });
  
    spyOn(employeeSettingsService, 'postEmployeeSettings').and.returnValue(throwError('Error'));
    spyOn(component as any, 'exportSettingAffected').and.returnValue(false);
  
    component.save();
  
    tick();
  
    expect(employeeSettingsService.postEmployeeSettings).toHaveBeenCalledWith(mockEmployeeSettingPayload);
    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving employee settings, please try again later');
    expect(component.isSaveInProgress).toBeFalse();
  }));

  it('should navigate to the connector page when navigateToPreviousStep is called', () => {
    component.navigateToPreviousStep();
    expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/connector']);
  });

  it('should show warning dialog when exportSettingAffected is true', () => {
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });
  
    spyOn(component as any, 'exportSettingAffected').and.returnValue(true);
  
    component.save();
  
    expect(component.isConfirmationDialogVisible).toBeTrue();
    expect(component.warningDialogText).toContain('You are changing your employee representation');
  });

  it('should navigate to export settings when not onboarding and export settings are affected', fakeAsync(() => {
    component.isOnboarding = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });
  
    spyOn(employeeSettingsService, 'postEmployeeSettings').and.returnValue(of(mockEmployeeSettingResponse));
    spyOn(component as any, 'exportSettingAffected').and.returnValue(true);
  
    component.save();
    expect(component.isConfirmationDialogVisible).toBeTrue();
  
    component.acceptWarning({ hasAccepted: true, event: ConfigurationWarningEvent.CLONE_SETTINGS });
    tick();
  
    expect(employeeSettingsService.postEmployeeSettings).toHaveBeenCalledWith(mockEmployeeSettingPayload);
    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Employee settings saved successfully');
    expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/main/configuration/export_settings']);
  }));

  it('should correctly determine if export settings are affected', () => {
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.VENDOR],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });
  
    expect(component['exportSettingAffected']()).toBeTrue();
  
    component.employeeSettingForm.patchValue({
      employeeMapping: EmployeeFieldMapping.EMPLOYEE
    });
  
    expect(component['exportSettingAffected']()).toBeFalse();
  });
});