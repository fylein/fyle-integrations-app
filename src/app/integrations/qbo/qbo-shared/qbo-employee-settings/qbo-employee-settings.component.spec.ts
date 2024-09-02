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
import { AutoMapEmployeeOptions, EmployeeFieldMapping, QBOOnboardingState, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/common/api.service';

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

  const mockEmployeeSettingResponse: QBOEmployeeSettingGet = {
    workspace_general_settings: {
      employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
      auto_map_employees: AutoMapEmployeeOptions.EMAIL
    },
    workspace_id: workspace_id
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
    const mockEmployeeSettings: QBOEmployeeSettingGet = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployeeOptions.EMAIL
      },
      workspace_id: 1
    };

    const mockDestinationAttributes = [
      {
        id: 253183,
        attribute_type: 'EMPLOYEE',
        display_name: 'employee',
        value: 'Anish Sinh',
        destination_id: '104',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 1
      },
      {
        id: 253195,
        attribute_type: 'VENDOR',
        display_name: 'vendor',
        value: '1',
        destination_id: '215',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 1
      }
    ];

    const mockExportSettings = {
      workspace_general_settings: {
        reimbursable_expenses_object: QBOReimbursableExpensesObject.BILL
      }
    };

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

  it('postEmployeeSettings service check', () => {
    const employeeSettingsPayload: QBOEmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.VENDOR,
        auto_map_employees: AutoMapEmployeeOptions.NAME
      }
    };

    const response: QBOEmployeeSettingGet = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.VENDOR,
        auto_map_employees: AutoMapEmployeeOptions.NAME
      },
      workspace_id: workspace_id
    };

    apiServiceSpy.put.and.returnValue(of(response));

    employeeSettingsService.postEmployeeSettings(employeeSettingsPayload).subscribe(
      (result) => {
        expect(result).toEqual(response);
      }
    );

    expect(apiServiceSpy.put).toHaveBeenCalledWith(`/v2/workspaces/${workspace_id}/map_employees/`, employeeSettingsPayload);
  });

  it('should save employee settings successfully', () => {
    const mockEmployeeSettingPayload: QBOEmployeeSettingPost = {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployeeOptions.EMAIL
      }
    };

    component.isOnboarding = true;
    component.employeeSettingForm = TestBed.inject(FormBuilder).group({
      employeeMapping: [EmployeeFieldMapping.EMPLOYEE],
      autoMapEmployee: [AutoMapEmployeeOptions.EMAIL],
      searchOption: ['']
    });

    spyOn(employeeSettingsService, 'postEmployeeSettings').and.returnValue(of(mockEmployeeSettingResponse));

    component.save();

    expect(employeeSettingsService.postEmployeeSettings).toHaveBeenCalledWith(mockEmployeeSettingPayload);
    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.SUCCESS, 'Employee settings saved successfully');
    expect(workspaceService.setOnboardingState).toHaveBeenCalledWith(QBOOnboardingState.EXPORT_SETTINGS);
    expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/onboarding/export_settings']);
  });

  it('should navigate to export settings when exportSettingAffected is true', () => {
    component.isOnboarding = false;
    component.existingEmployeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.employeeSettingForm.patchValue({
      employeeMapping: EmployeeFieldMapping.VENDOR
    });

    (employeeSettingsService.postEmployeeSettings as jasmine.Spy).and.returnValue(of({}));

    component.save();

    expect(router.navigate).toHaveBeenCalledWith(['/integrations/qbo/main/configuration/export_settings']);
  });

  it('should display error toast when saving fails', () => {
    (employeeSettingsService.postEmployeeSettings as jasmine.Spy).and.returnValue(throwError(() => new Error('Save failed')));

    component.save();

    expect(toastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Error saving employee settings, please try again later');
    expect(component.isSaveInProgress).toBeFalse();
  });
});