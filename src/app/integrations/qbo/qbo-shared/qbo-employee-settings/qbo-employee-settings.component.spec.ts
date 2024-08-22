import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QboEmployeeSettingsComponent } from './qbo-employee-settings.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboEmployeeSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-employee-settings.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QBOEmployeeSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-employee-setting.model';
import { AutoMapEmployeeOptions, EmployeeFieldMapping, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { QBOExportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';

describe('QboEmployeeSettingsComponent', () => {
  let component: QboEmployeeSettingsComponent;
  let fixture: ComponentFixture<QboEmployeeSettingsComponent>;
  let employeeSettingServiceSpy: jasmine.SpyObj<QboEmployeeSettingsService>;
  let exportSettingServiceSpy: jasmine.SpyObj<QboExportSettingsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;
  let windowServiceMock: Partial<WindowService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;

  beforeEach(async () => {
    employeeSettingServiceSpy = jasmine.createSpyObj('QboEmployeeSettingsService', ['getEmployeeSettings', 'postEmployeeSettings']);
    exportSettingServiceSpy = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    windowServiceMock = {
      get nativeWindow() {
        return window;
      }
    };
    workspaceServiceSpy = jasmine.createSpyObj('WorkspaceService', ['setOnboardingState']);

    await TestBed.configureTestingModule({
      declarations: [QboEmployeeSettingsComponent],
      providers: [
        { provide: QboEmployeeSettingsService, useValue: employeeSettingServiceSpy },
        { provide: QboExportSettingsService, useValue: exportSettingServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy },
        { provide: WindowService, useValue: windowServiceMock },
        { provide: WorkspaceService, useValue: workspaceServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboEmployeeSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form on init', () => {
    const employeeSetting: QBOEmployeeSettingGet = {
      workspace_id: 1,
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployeeOptions.EMAIL
      }
    };
    const destinationAttributes: DestinationAttribute[] = [
      {
        id: 1,
        display_name: 'some_display_name',
        destination_id: 'some_destination_id',
        active: true,
        attribute_type: 'EMPLOYEE',
        value: 'some_value',
        created_at: new Date('2022-01-01T00:00:00.000Z'),
        updated_at: new Date('2022-01-01T00:00:00.000Z'),
        workspace: 1
      },
      {
        id: 2,
        display_name: 'some_display_name',
        destination_id: 'some_destination_id',
        active: true,
        attribute_type: 'VENDOR',
        value: 'some_value',
        created_at: new Date('2022-01-01T00:00:00.000Z'),
        updated_at: new Date('2022-01-01T00:00:00.000Z'),
        workspace: 2
      }
    ];

    employeeSettingServiceSpy.getEmployeeSettings.and.returnValue(of(employeeSetting));
    employeeSettingServiceSpy.getDistinctQBODestinationAttributes.and.returnValue(of(destinationAttributes));

    fixture.detectChanges();

    expect(component.employeeSettingForm).toBeDefined();
    expect(component.existingEmployeeFieldMapping).toBe('some_mapping');
    expect(component.liveEntityExample).toBeDefined();
  });


});