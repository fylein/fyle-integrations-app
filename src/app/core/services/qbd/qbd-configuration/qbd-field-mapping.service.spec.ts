import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { QbdFieldMappingService } from './qbd-field-mapping.service';
import { QBDFieldMappingGet, QBDFieldMappingPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdFieldMappingService', () => {
  let service: QbdFieldMappingService;
  let httpMock: HttpTestingController;
  let injector: TestBed;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
    imports: [],
    providers: [QbdFieldMappingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
      service = TestBed.inject(QbdFieldMappingService);
      injector = getTestBed();
      service = injector.inject(QbdFieldMappingService);
      httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getQbdFieldMappings service check attributes check', () => {
    const response: QBDFieldMappingGet = {
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      class_type: null,
      project_type: "PROJECT",
      item_type: "Anish",
      custom_fields: ["Anish"],
      workspace: 1
  };
    service.getQbdFieldMapping().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/field_mappings/`
    });
    req.flush(response);

  });

  it('postQbdFieldMappings service check', () => {
    const FieldMappingPayload: QBDFieldMappingPost = {
      class_type: null,
      project_type: "PROJECT",
      item_type: "Anish"
    };
    const response={
      id: 1,
      created_at: new Date('2023-02-01T08:42:45.803382Z'),
      updated_at: new Date('2023-02-01T08:42:45.803382Z'),
      class_type: null,
      project_type: "PROJECT",
      workspace: 1
  };
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/field_mappings/`
    });
    req.flush(response);

  });
});
