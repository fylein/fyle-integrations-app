import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { QBDScheduleFrequency } from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';

import { QbdAdvancedSettingsService } from './qbd-advanced-settings.service';
import { QBDAdvancedSettingsGet, QBDAdvancedSettingsPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdAdvancedSettingsService', () => {
  let service: QbdAdvancedSettingsService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;
  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
    imports: [],
    providers: [QbdAdvancedSettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    injector = getTestBed();
    service = injector.inject(QbdAdvancedSettingsService);
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
    service.getQbdAdvancedSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/advanced_settings/`
    });
    req.flush(response);

  });

  it('postQbdAdvancedSettings service check', () => {
    const AdvancedSettingPayload: QBDAdvancedSettingsPost = {
      expense_memo_structure: [
        "employee_email",
        "merchant",
        "purpose",
        "report_number",
        "expense_link"
      ],
      top_memo_structure: [
        "purpose"
      ],
      schedule_is_enabled: false,
      emails_selected: [{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}],
      day_of_month: null,
      day_of_week: "MONDAY",
      frequency: QBDScheduleFrequency.WEEKLY,
      time_of_day: "00:00:00"
    };
    const response={
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
      interval_hours: 100,
      schedule_id: null,
      emails_selected: [{name: 'shwetabh', email: "shwetabh.kumar@fylehq.com"}],
      day_of_month: null,
      day_of_week: "MONDAY",
      frequency: QBDScheduleFrequency.WEEKLY,
      time_of_day: "00:00:00",
      workspace: 1
  };
    service.postQbdAdvancedSettings(AdvancedSettingPayload).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/advanced_settings/`
    });
    req.flush(response);

  });

});

