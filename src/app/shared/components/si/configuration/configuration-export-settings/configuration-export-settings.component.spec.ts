import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationExportSettingsComponent } from './configuration-export-settings.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiExportSettingService } from 'src/app/core/services/si/si-configuration/si-export-setting.service';
import { Router } from '@angular/router';
import { CCCExpenseState, CorporateCreditCardExpensesObject, ExpenseState, ExportDateType, IntacctOnboardingState, IntacctReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { of } from 'rxjs';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExportSettingGet } from 'src/app/core/models/si/si-configuration/export-settings.model';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConfigurationExportSettingsComponent', () => {
  let component: ConfigurationExportSettingsComponent;
  let fixture: ComponentFixture<ConfigurationExportSettingsComponent>;
  let siExportSettingService: SiExportSettingService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  const emptyDestinationAttribute: DefaultDestinationAttribute = { id: '1', name: 'abcd' };
  const mockSettings: ExportSettingGet = {
    configurations: {
      employee_field_mapping: 'EMPLOYEE',
      auto_map_employees: 'NAME',
      reimbursable_expenses_object: IntacctReimbursableExpensesObject.EXPENSE_REPORT,
      corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BILL
    },
    expense_group_settings: {
      expense_state: ExpenseState.PAID,
      ccc_expense_state: CCCExpenseState.PAID,
      reimbursable_expense_group_fields: ["report_id"],
      reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
      corporate_credit_card_expense_group_fields: ["expense_id"],
      ccc_export_date_type: ExportDateType.LAST_SPENT_AT
    },
    general_mappings: {
      default_gl_account: emptyDestinationAttribute,
      default_credit_card: emptyDestinationAttribute,
      default_charge_card: emptyDestinationAttribute,
      default_ccc_expense_payment_type: emptyDestinationAttribute,
      default_reimbursable_expense_payment_type: {id: '1', name: 'check'},
      default_ccc_vendor: {id: '2', name: 'check2'}
    },
    workspace_id: 1
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [ConfigurationExportSettingsComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: IntegrationsToastService, useValue: {} },
        { provide: SiExportSettingService, useValue: { getExportSettings: () => of(mockSettings) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationExportSettingsComponent);
    component = fixture.componentInstance;
    siExportSettingService = TestBed.inject(SiExportSettingService);
    fixture.detectChanges();
  });

  it('should initialize export settings form with data', async () => {
    const mappingServiceSpy = TestBed.inject(SiMappingsService);
    const exportSettingServiceSpy = TestBed.inject(SiExportSettingService);
    const httpMock = TestBed.inject(HttpTestingController);

    spyOn(mappingServiceSpy, 'getGroupedDestinationAttributes').and.returnValue(of({
      ACCOUNT: [],
      EXPENSE_PAYMENT_TYPE: [],
      VENDOR: [],
      CHARGE_CARD_NUMBER: []
    }));
    spyOn(exportSettingServiceSpy, 'getExportSettings').and.returnValue(of(mockSettings));

    component.ngOnInit();

    await fixture.whenStable();

    // Expect the HTTP request and provide a mock response
    const req = httpMock.expectOne('/api/workspaces/1/sage_intacct/destination_attributes/?attribute_types=ACCOUNT,EXPENSE_PAYMENT_TYPE,VENDOR,CHARGE_CARD_NUMBER');
    req.flush({ /* Your mock response data here */ });

    expect(component.exportSettingsForm).toBeDefined();
  });

  afterEach(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

});