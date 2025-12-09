import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  QBDCorporateCreditCardExpensesObject,
  QBDEntity,
  QBDExpenseGroupedBy,
  ExpenseState,
  CCCExpenseState,
  QBDExportDateType,
  QBDReimbursableExpensesObject,
} from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';

import { QbdExportSettingsService } from './qbd-export-settings.service';
import {
  QBDExportSettingGet,
  QBDExportSettingPost,
} from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdExportSettingsService', () => {
  let service: QbdExportSettingsService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
      imports: [],
      providers: [QbdExportSettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    injector = getTestBed();
    service = injector.inject(QbdExportSettingsService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQbdExportSettings service check attributes check', () => {
    const response: QBDExportSettingGet = {
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      reimbursable_expenses_export_type: QBDReimbursableExpensesObject.BILL,
      bank_account_name: 'string',
      mileage_account_name: 'string',
      reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
      reimbursable_expense_date: QBDExportDateType.SPENT_AT,
      reimbursable_expense_grouped_by: QBDExpenseGroupedBy.REPORT,
      credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
      credit_card_expense_state: CCCExpenseState.PAID,
      credit_card_entity_name_preference: QBDEntity.VENDOR,
      credit_card_account_name: 'string',
      credit_card_expense_grouped_by: QBDExpenseGroupedBy.EXPENSE,
      credit_card_expense_date: QBDExportDateType.LAST_SPENT_AT,
      workspace: 1,
    };
    service.getQbdExportSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_settings/`,
    });
    req.flush(response);
  });

  it('postQbdExportSettings service check', () => {
    const exportSettingPayload: QBDExportSettingPost = {
      reimbursable_expenses_export_type: QBDReimbursableExpensesObject.BILL,
      bank_account_name: 'string',
      mileage_account_name: 'string',
      reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
      reimbursable_expense_date: QBDExportDateType.SPENT_AT,
      reimbursable_expense_grouped_by: QBDExpenseGroupedBy.REPORT,
      credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
      credit_card_expense_state: CCCExpenseState.PAID,
      credit_card_entity_name_preference: QBDEntity.VENDOR,
      credit_card_account_name: 'string',
      credit_card_expense_grouped_by: QBDExpenseGroupedBy.EXPENSE,
      credit_card_expense_date: QBDExportDateType.LAST_SPENT_AT,
    };
    const response = {
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      reimbursable_expenses_export_type: QBDReimbursableExpensesObject.BILL,
      bank_account_name: 'string',
      mileage_account_name: 'string',
      reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
      reimbursable_expense_date: QBDExportDateType.SPENT_AT,
      reimbursable_expense_grouped_by: QBDExpenseGroupedBy.REPORT,
      credit_card_expense_export_type: QBDCorporateCreditCardExpensesObject.JOURNAL_ENTRY,
      credit_card_expense_state: CCCExpenseState.PAID,
      credit_card_entity_name_preference: QBDEntity.VENDOR,
      credit_card_account_name: 'string',
      credit_card_expense_grouped_by: QBDExpenseGroupedBy.EXPENSE,
      credit_card_expense_date: QBDExportDateType.LAST_SPENT_AT,
      workspace: 1,
    };
    service.postQbdExportSettings(exportSettingPayload).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_settings/`,
    });
    req.flush(response);
  });
});
