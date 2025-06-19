/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QboBaseMappingComponent } from './qbo-base-mapping.component';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { AccountingDisplayName, AccountingField, FyleField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { mockCreditCardAccounts, mockGeneralSettings, mockImportSettings, mockMappingSetting } from '../../../qbo.fixture';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { QBOImportSettingGet } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { TranslocoService } from '@jsverse/transloco';

describe('QboBaseMappingComponent', () => {
  let component: QboBaseMappingComponent;
  let fixture: ComponentFixture<QboBaseMappingComponent>;
  let mockActivatedRoute: any;
  let mockMappingService: jasmine.SpyObj<MappingService>;
  let mockToastService: jasmine.SpyObj<IntegrationsToastService>;
  let mockWorkspaceService: jasmine.SpyObj<WorkspaceService>;
  let mockImportSettingsService: jasmine.SpyObj<QboImportSettingsService>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ source_field: 'EMPLOYEE' }),
      snapshot: {
        params: { source_field: 'EMPLOYEE' }
      }
    };
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    mockMappingService = jasmine.createSpyObj('MappingService', ['triggerAutoMapEmployees', 'getMappingSettings', 'getPaginatedDestinationAttributes']);
    mockToastService = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);
    mockWorkspaceService = jasmine.createSpyObj('WorkspaceService', ['getWorkspaceGeneralSettings']);
    mockImportSettingsService = jasmine.createSpyObj('QboImportSettingsService', ['getImportSettings']);

    await TestBed.configureTestingModule({
      declarations: [ QboBaseMappingComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MappingService, useValue: mockMappingService },
        { provide: IntegrationsToastService, useValue: mockToastService },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        { provide: QboImportSettingsService, useValue: mockImportSettingsService },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboBaseMappingComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger auto map employees successfully', () => {
    mockMappingService.triggerAutoMapEmployees.and.returnValue(of(null));
    translocoService.translate.and.returnValue('Auto mapping of employees may take few minutes');
    component.triggerAutoMapEmployees();

    expect(component.isLoading).toBeFalse();
    expect(mockToastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.INFO, 'Auto mapping of employees may take few minutes');
  });

  it('should handle error when triggering auto map employees', () => {
    mockMappingService.triggerAutoMapEmployees.and.returnValue(throwError('Error'));
    translocoService.translate.and.returnValue('Something went wrong, please try again');
    component.triggerAutoMapEmployees();

    expect(component.isLoading).toBeFalse();
    expect(mockToastService.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Something went wrong, please try again');
  });

  it('should handle route parameter changes', () => {
    mockWorkspaceService.getWorkspaceGeneralSettings.and.returnValue(of(mockGeneralSettings));
    mockMappingService.getMappingSettings.and.returnValue(of({ count: 1, next: null, previous: null, results: mockImportSettings.mapping_settings }));
    mockImportSettingsService.getImportSettings.and.returnValue(of(mockImportSettings));
    mockMappingService.getPaginatedDestinationAttributes.and.returnValue(of(mockCreditCardAccounts));

    mockActivatedRoute.params = of({ source_field: 'Vendor' });
    fixture.detectChanges();

    expect(component.sourceField).toBe(FyleField.EMPLOYEE);
    expect(component.isLoading).toBeFalse();
  });

  it('should return employee_field_mapping when sourceField is EMPLOYEE', () => {
    component.sourceField = FyleField.EMPLOYEE;
    const workspaceGeneralSetting = { employee_field_mapping: 'VENDOR' } as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe('VENDOR');
  });

  it('should return ACCOUNT when sourceField is CATEGORY', () => {
    component.sourceField = FyleField.CATEGORY;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe(AccountingField.ACCOUNT);
  });

  it('should return destination_field from mappingSettings for other sourceFields', () => {
    component.sourceField = FyleField.CATEGORY;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [
      {
        source_field: FyleField.CATEGORY,
        destination_field: AccountingField.ACCOUNT,
        id: 0,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 0,
        import_to_fyle: false,
        is_custom: false,
        source_placeholder: null
      }
    ];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe('ACCOUNT');
  });

  it('should return empty string if no matching mapping setting is found', () => {
    component.sourceField = FyleField.VENDOR;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe('');
  });

  it('should return employee_field_mapping when sourceField is EMPLOYEE', () => {
    component.sourceField = FyleField.EMPLOYEE;
    const workspaceGeneralSetting = { employee_field_mapping: 'VENDOR' } as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe('VENDOR');
  });

  it('should return ACCOUNT when sourceField is CATEGORY', () => {
    component.sourceField = FyleField.CATEGORY;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe(AccountingField.ACCOUNT);
  });

  it('should return destination_field from mappingSettings for VENDOR sourceField', () => {
    component.sourceField = FyleField.VENDOR;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mockMappingSetting);
    expect(result).toBe(AccountingField.ACCOUNT);
  });

  it('should return empty string if no matching mapping setting is found', () => {
    component.sourceField = FyleField.VENDOR;
    const workspaceGeneralSetting = {} as QBOWorkspaceGeneralSetting;
    const mappingSettings: MappingSetting[] = [];

    const result = (component as any).getDestinationField(workspaceGeneralSetting, mappingSettings);
    expect(result).toBe('');
  });
});
