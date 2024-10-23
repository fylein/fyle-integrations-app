import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QbdExportTriggerResponse, QbdAccountingExportDownload } from 'src/app/core/models/qbd/db/qbd-iif-logs.model';
import { environment } from 'src/environments/environment';

import { QbdIifLogsService } from './qbd-iif-logs.service';

xdescribe('QbdIifLogsService', () => {
  let service: QbdIifLogsService;
  let httpMock: HttpTestingController;
  let injector: TestBed;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QbdIifLogsService]
    });
      service = TestBed.inject(QbdIifLogsService);
      injector = getTestBed();
      service = injector.inject(QbdIifLogsService);
      httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQbdAccountingExports service check attributes check', () => {
    const state= 'string', limit= 1, offset= 10, selectedDateFilter=null;
    const response: QbdExportTriggerResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
          {
              id: 2,
              type: "EXPORT_BILLS",
              file_id: "fieZ6GMSmgkb",
              fund_source: 'Reimbursable',
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2023-02-09T12:39:31.005110Z"),
              updated_at: new Date("2023-02-09T12:39:31.005110Z"),
              workspace: 1
          },
          {
              id: 1,
              type: "FETCHING_REIMBURSABLE_EXPENSES",
              fund_source: 'CCC',
              file_id: null,
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2023-02-09T12:39:31.005110Z"),
              updated_at: new Date("2023-02-09T12:39:31.005110Z"),
              workspace: 1
          }

      ]
  };
    service.getQbdAccountingExports(state, limit, offset, selectedDateFilter, null).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/accounting_exports`)
    );

    expect(req.request.params.get('limit')).toBe(limit.toString());
    expect(req.request.params.get('status')).toBe(state);
    expect(req.request.params.get('offset')).toBe(offset.toString());
    req.flush(response);

  });

  it('getQbdAccountingExports service check attributes check', () => {
    const state= ['string'], limit= 1, offset= 10, selectedDateFilter={dateRange: 'This Week', startDate: new Date("2023-02-17"), endDate: new Date("2023-02-27")};
    const response: QbdExportTriggerResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
          {
              id: 2,
              type: "EXPORT_BILLS",
              fund_source: 'Reimbursable',
              file_id: "fieZ6GMSmgkb",
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2023-02-09T12:39:31.005110Z"),
              updated_at: new Date("2023-02-09T12:39:31.005110Z"),
              workspace: 1
          },
          {
              id: 1,
              type: "FETCHING_REIMBURSABLE_EXPENSES",
              fund_source: 'CCC',
              file_id: null,
              task_id: null,
              status: "COMPLETE",
              errors: null,
              created_at: new Date("2023-02-09T12:39:31.005110Z"),
              updated_at: new Date("2023-02-09T12:39:31.005110Z"),
              workspace: 1
          }

      ]
  };
    service.getQbdAccountingExports(state, limit, offset, selectedDateFilter, ['EXPORT_BILLS']).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/accounting_exports`)
    );

    expect(req.request.params.get('limit')).toBe(limit.toString());
    expect(req.request.params.get('status')).toBe(state[0]);
    expect(req.request.params.get('offset')).toBe(offset.toString());
    req.flush(response);
  });


  it('postQbdAccountingExports service check', () => {
    const response={
      accounting_export_id: 2,
      download_url: "fyle_qbd",
      file_id: "fieZ6GMSmgkb",
      workspace_id: 1
    };
    const id = 1;
    service.postQbdAccountingExports(id).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/accounting_exports/${id}/download/`
    });
    req.flush(response);

  });

  it('triggerQBDExport service check', () => {
    const response = {
      "message": "Export triggered successfully",
      "new_expenses_imported": false
  };
    service.triggerQBDExport().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/trigger_export/`
    });
    req.flush(response);
  });

});
