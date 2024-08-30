import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { QBOExportSettingGet, QBOExportSettingModel, QBOExportSettingPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { ConfigurationWarningEvent, QBOReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';

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
    const exportSettingsService = jasmine.createSpyObj('QboExportSettingsService', ['getExportSettings', 'postExportSettings']);
    const helperService = jasmine.createSpyObj('HelperService', ['addExportSettingFormValidator', 'setConfigurationSettingValidatorsAndWatchers', 'setOrClearValidators', 'enableFormField']);
    const qboHelperService = jasmine.createSpyObj('QboHelperService', ['refreshQBODimensions']);
    const mappingService = jasmine.createSpyObj('MappingService', ['getPaginatedDestinationAttributes']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const toastService = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    const windowService = jasmine.createSpyObj('WindowService', ['nativeWindow']);
    const workspaceService = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings', 'setOnboardingState']);

    await TestBed.configureTestingModule({
      declarations: [ QboExportSettingsComponent ],
      imports: [ ReactiveFormsModule ],
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
});