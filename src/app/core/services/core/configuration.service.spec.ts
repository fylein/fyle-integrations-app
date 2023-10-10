import { TestBed, getTestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { CCCExpenseState, ExpenseState, QBDCorporateCreditCardExpensesObject, QBDEntity, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject, QBDScheduleFrequency } from '../../models/enum/enum.model';
import { QBDAdvancedSettingsGet } from '../../models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingGet } from '../../models/qbd/qbd-configuration/export-setting.model';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;
  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService]
    });
    injector = getTestBed();
    service = injector.inject(ConfigurationService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQbdAdvancedSettings service check attributes check', () => {
    const response: QBDAdvancedSettingsGet = {
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-07T06:44:09.958562Z'),
      top_memo_structure: [
        "purpose"
      ],
      expense_memo_structure: [
        "employee_email",
        "merchant",
        "purpose",
        "report_number",
        "expense_link"
      ],
      schedule_is_enabled: false,
      schedule_id: null,
      emails_selected: [{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}],
      workspace: 1,
      day_of_month: null,
      day_of_week: "MONDAY",
      frequency: QBDScheduleFrequency.WEEKLY,
      time_of_day: "00:00:00"
    };
    service.getAdvancedSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/advanced_settings/`
    });
    req.flush(response);

  });

  it('getQbdExportSettings service check attributes check', () => {
    const response: QBDExportSettingGet = {
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      reimbursable_expenses_export_type: QBDReimbursableExpensesObject.BILL,
      bank_account_name: "string",
      mileage_account_name: "string",
      reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
      reimbursable_expense_date: QBDExportDateType.SPENT_AT,
      reimbursable_expense_grouped_by: QBDExpenseGroupedBy.REPORT,
      credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
      credit_card_expense_state: CCCExpenseState.PAID,
      credit_card_entity_name_preference: QBDEntity.VENDOR,
      credit_card_account_name: "string",
      credit_card_expense_grouped_by: QBDExpenseGroupedBy.EXPENSE,
      credit_card_expense_date: QBDExportDateType.LAST_SPENT_AT,
      workspace: 1,
      is_simplify_report_closure_enabled: true
  };
    service.getExportSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_settings/`
    });
    req.flush(response);

  });

});
