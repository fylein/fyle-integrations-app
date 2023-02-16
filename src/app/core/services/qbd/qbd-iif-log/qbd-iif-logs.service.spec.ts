import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QbdAccountingExportsGet, QbdAccountingExportsPost } from 'src/app/core/models/qbd/db/iif-logs.model';
import { environment } from 'src/environments/environment';

import { QbdIifLogsService } from './qbd-iif-logs.service';

describe('QbdIifLogsService', () => {
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
    const accountingExportsPayload = {
      id: 1,
      type: "FETCHING_REIMBURSABLE_EXPENSES",
      status: 'COMPLETE'
    };
    const response: QbdAccountingExportsGet = {
      count: 2,
      next: null,
      previous: null,
      results: [
          {
              id: 2,
              type: "EXPORT_BILLS",
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
    service.getQbdAccountingExports(accountingExportsPayload).subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/accounting_exports/?id=1&type=FETCHING_REIMBURSABLE_EXPENSES&status=COMPLETE`
    });
    req.flush(response);

  });

  it('postQbdAccountingExports service check', () => {
    const response={
      accounting_export_id: 2,
      download_url: "https://fyle-storage-mumbai-3.s3.amazonaws.com/2023-02-09/orHVw3ikkCxJ/integrations/fieZ6GMSmgkb.Anagha%2520Org2bills20230209.iif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA54Z3LIXTX6CFH4VG%2F20230216%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230216T124434Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=34b35a8aa7a56ba3642896d9e19df1f9b687de3afa3ce7bc3ab86ffcdf17ca0f",
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

});
