import { TestBed, getTestBed } from '@angular/core/testing';

import { QbdMappingService } from './qbd-mapping.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import { QBDMapping, QBDMappingPost, QBDMappingResponse, QBDMappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';
import { QBDExportSettingResponse, QBDExportSettingResponse2 } from 'src/app/integrations/qbd/qbd-shared/qbd-export-setting/qbd-export-setting.fixture';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('QbdMappingService', () => {
  let service: QbdMappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 4;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '4');
    TestBed.configureTestingModule({
    imports: [],
    providers: [QbdMappingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    injector = getTestBed();
    service = TestBed.inject(QbdMappingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMapping function check', () => {
    const mappingResponse:QBDMappingResponse = {
      "count": 16,
      "next": "http://localhost:8008/api/workspaces/4/qbd_mappings/?attribute_type=CORPORATE_CARD&limit=10&offset=10",
      "previous": "null",
      "results": [
        {
            "id": 59,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "Bank of America - 1319",
            "source_id": "baccK5ssSzxv1g",
            "destination_value": "eefs",
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        },
        {
            "id": 61,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "American Express - 58057",
            "source_id": "baccsWbRJpSbnB",
            "destination_value": null,
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        },
        {
            "id": 62,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "American Express - 83167",
            "source_id": "baccAGZQWkwSnZ",
            "destination_value": null,
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        }
      ]
    };
    service.getMappings(10, 0, 'CORPORATE_CARD', MappingState.ALL, 'Anish').subscribe((value) => {
      expect(value).toEqual(mappingResponse);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/?limit=10&offset=0&attribute_type=CORPORATE_CARD`
    });
    req.flush(mappingResponse);
  });

    it('getMapping function check', () => {
    const mappingResponse:QBDMappingResponse = {
      "count": 16,
      "next": "http://localhost:8008/api/workspaces/4/qbd_mappings/?attribute_type=CORPORATE_CARD&limit=10&offset=10",
      "previous": "null",
      "results": [
        {
            "id": 59,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "Bank of America - 1319",
            "source_id": "baccK5ssSzxv1g",
            "destination_value": "eefs",
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        },
        {
            "id": 61,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "American Express - 58057",
            "source_id": "baccsWbRJpSbnB",
            "destination_value": null,
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        },
        {
            "id": 62,
            "attribute_type": "CORPORATE_CARD",
            "source_value": "American Express - 83167",
            "source_id": "baccAGZQWkwSnZ",
            "destination_value": null,
            "created_at": new Date("2023-09-01T08:32:40.176736Z"),
            "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
            "workspace": 4
        }
      ]
    };
    service.getMappings(10, 0, 'CORPORATE_CARD', MappingState.ALL, 'Anish').subscribe((value) => {
      expect(value).toEqual(mappingResponse);
    });
    service.getMappings(10, 0, 'CORPORATE_CARD', MappingState.MAPPED, 'Anish').subscribe((value) => {
      expect(value).toEqual(mappingResponse);
    });
    service.getMappings(10, 0, 'CORPORATE_CARD', MappingState.UNMAPPED, 'Anish').subscribe((value) => {
      expect(value).toEqual(mappingResponse);
    });
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/?limit=10&offset=0&attribute_type=CORPORATE_CARD`
    });
    const req2 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/?limit=10&offset=0&attribute_type=CORPORATE_CARD&destination_value__isnull=false`
    });
    const req3 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/?limit=10&offset=0&attribute_type=CORPORATE_CARD&destination_value__isnull=true`
    });
    req1.flush(mappingResponse);
    req2.flush(mappingResponse);
    req3.flush(mappingResponse);
  });

  it('postMapping function check', () => {
    const postMappingResponse: QBDMapping = {
      "id": 59,
      "attribute_type": "CORPORATE_CARD",
      "source_value": "Bank of America - 1319",
      "source_id": "baccK5ssSzxv1g",
      "destination_value": "eefw",
      "created_at": new Date("2023-09-01T08:32:40.176736Z"),
      "updated_at": new Date("2023-09-01T08:32:40.176736Z"),
      "workspace": 4
    };

    const postMappingPayload: QBDMappingPost = {
      attribute_type: "CORPORATE_CARD",
      destination_value: "eefw",
      source_id: "baccK5ssSzxv1g",
      source_value: "Bank of America - 1319"
    };
    service.postMappings(postMappingPayload).subscribe((value) => {
      expect(value).toEqual(postMappingResponse);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/`
    });
    req.flush(postMappingResponse);
  });

  it('getMappingStats function check', () => {
    const mappingStat: QBDMappingStats = {
      "all_attributes_count": 16,
      "unmapped_attributes_count": 12
    };

    service.getMappingStats('CORPORATE_CARD').subscribe((value) => {
      expect(value).toEqual(mappingStat);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbd_mappings/stats/?source_type=CORPORATE_CARD`
    });
    req.flush(mappingStat);
  });

  it('refreshMappingPages function check', () => {
    expect(service.refreshMappingPages()).toBeUndefined();
    const req1 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_settings/`
    });
    req1.flush(QBDExportSettingResponse);

    expect(service.refreshMappingPages()).toBeUndefined();
    const req2 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/export_settings/`
    });
    req2.flush(QBDExportSettingResponse2);
  });
});
