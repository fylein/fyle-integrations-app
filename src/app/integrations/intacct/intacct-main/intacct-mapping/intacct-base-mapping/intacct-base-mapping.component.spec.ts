/* eslint-disable dot-notation */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IntacctBaseMappingComponent } from './intacct-base-mapping.component';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { FyleField, IntacctCategoryDestination, IntacctCorporateCreditCardExpensesObject, IntacctReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { mockConfigurationResponse, mockMappingSettingsResponse, mockDestinationAttributesResponse } from '../../../intacct.fixture';
import { MappingSettingResponse } from 'src/app/core/models/intacct/db/mapping-setting.model';
import { DestinationAttribute, PaginatedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { SharedModule } from 'src/app/shared/shared.module';


describe('IntacctBaseMappingComponent', () => {
  let component: IntacctBaseMappingComponent;
  let fixture: ComponentFixture<IntacctBaseMappingComponent>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;
  let mappingServiceSpy: jasmine.SpyObj<MappingService>;
  let workspaceServiceSpy: jasmine.SpyObj<WorkspaceService>;
  let toastServiceSpy: jasmine.SpyObj<IntegrationsToastService>;

  beforeEach(async () => {
    routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ source_field: 'employee' }),
      snapshot: { params: { source_field: 'employee' } }
    });
    mappingServiceSpy = jasmine.createSpyObj('MappingService', ['getMappingSettings', 'getPaginatedDestinationAttributes', 'triggerAutoMapEmployees']);
    workspaceServiceSpy = jasmine.createSpyObj('WorkspaceService', ['getConfiguration']);
    toastServiceSpy = jasmine.createSpyObj('IntegrationsToastService', ['displayToastMessage']);

    await TestBed.configureTestingModule({
      declarations: [IntacctBaseMappingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: MappingService, useValue: mappingServiceSpy },
        { provide: WorkspaceService, useValue: workspaceServiceSpy },
        { provide: IntegrationsToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntacctBaseMappingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', fakeAsync(() => {
    workspaceServiceSpy.getConfiguration.and.returnValue(of(mockConfigurationResponse));
    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettingsResponse as MappingSettingResponse));
    mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValue(of(mockDestinationAttributesResponse as PaginatedDestinationAttribute));

    fixture.detectChanges();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.sourceField).toBe(FyleField.EMPLOYEE);
    expect(component.destinationField).toBe('EMPLOYEE');
    expect(component.destinationOptions).toEqual(mockDestinationAttributesResponse.results as DestinationAttribute[]);
    expect(component.showAutoMapEmployee).toBeTrue();
  }));

  it('should handle category mapping', fakeAsync(() => {
    routeSpy.params = of({ source_field: 'category' });
    routeSpy.snapshot.params.source_field = 'category';

    workspaceServiceSpy.getConfiguration.and.returnValue(of(mockConfigurationResponse));
    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettingsResponse as MappingSettingResponse));
    mappingServiceSpy.getPaginatedDestinationAttributes.and.returnValue(of(mockDestinationAttributesResponse as PaginatedDestinationAttribute));

    fixture.detectChanges();
    tick();

    expect(component.sourceField).toBe('CATEGORY');
    expect(component.destinationField).toBe(IntacctCategoryDestination.ACCOUNT);
  }));

  it('should trigger auto map employees', () => {
    mappingServiceSpy.triggerAutoMapEmployees.and.returnValue(of(null));
    component.triggerAutoMapEmployees();

    expect(component.isLoading).toBeFalse();
    expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.INFO, 'Auto mapping of employees may take few minutes');
  });

  it('should handle error when triggering auto map employees', () => {
    mappingServiceSpy.triggerAutoMapEmployees.and.returnValue(throwError(() => new Error('Error')));
    component.triggerAutoMapEmployees();

    expect(component.isLoading).toBeFalse();
    expect(toastServiceSpy.displayToastMessage).toHaveBeenCalledWith(ToastSeverity.ERROR, 'Something went wrong, please try again');
  });

  describe('getDestinationField', () => {
    it('should return employee field mapping when source field is EMPLOYEE', () => {
      component.sourceField = FyleField.EMPLOYEE;
      const intacctConfiguration = { employee_field_mapping: 'EMPLOYEE' } as any;
      const mappingSettings = [] as any;

      const result = component['getDestinationField'](intacctConfiguration, mappingSettings);
      expect(result).toBe('EMPLOYEE');
    });

    it('should return EXPENSE_TYPE when source field is CATEGORY and reimbursable_expenses_object is EXPENSE_REPORT', () => {
      component.sourceField = FyleField.CATEGORY;
      const intacctConfiguration = { reimbursable_expenses_object: IntacctReimbursableExpensesObject.EXPENSE_REPORT } as any;
      const mappingSettings = [] as any;

      const result = component['getDestinationField'](intacctConfiguration, mappingSettings);
      expect(result).toBe(IntacctCategoryDestination.EXPENSE_TYPE);
    });

    it('should return EXPENSE_TYPE when source field is CATEGORY and corporate_credit_card_expenses_object is EXPENSE_REPORT', () => {
      component.sourceField = FyleField.CATEGORY;
      const intacctConfiguration = { corporate_credit_card_expenses_object: IntacctCorporateCreditCardExpensesObject.EXPENSE_REPORT } as any;
      const mappingSettings = [] as any;

      const result = component['getDestinationField'](intacctConfiguration, mappingSettings);
      expect(result).toBe(IntacctCategoryDestination.EXPENSE_TYPE);
    });

    it('should return ACCOUNT when source field is CATEGORY and neither expenses_object is EXPENSE_REPORT', () => {
      component.sourceField = FyleField.CATEGORY;
      const intacctConfiguration = { reimbursable_expenses_object: 'OTHER', corporate_credit_card_expenses_object: 'OTHER' } as any;
      const mappingSettings = [] as any;

      const result = component['getDestinationField'](intacctConfiguration, mappingSettings);
      expect(result).toBe(IntacctCategoryDestination.ACCOUNT);
    });
  });
});