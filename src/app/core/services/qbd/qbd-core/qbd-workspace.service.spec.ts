import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';

import { QbdWorkspaceService } from './qbd-workspace.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdWorkspaceService', () => {
  let service: QbdWorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
    imports: [],
    providers: [QbdWorkspaceService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    injector = getTestBed();
    service = TestBed.inject(QbdWorkspaceService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('postQBDWorkspace service check', () => {
    const workspaceResponse = {
      "id": 1,
      "name": "Anagha Org",
      "org_id": "orHVw3ikkCxJ",
      "currency": "EUR",
      "reimbursable_last_synced_at": null,
      "ccc_last_synced_at": null,
      "created_at": "2023-01-23T05:37:56.907997Z",
      "updated_at": "2023-01-23T05:37:56.908051Z",
      "user": [1]
    };
    service.postQBDWorkspace().subscribe((value) => {
      const responseKeys = Object.keys(workspaceResponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
    req.flush(workspaceResponse);
  });

  it('getQBDWorkspace service check', () => {
    const workspaceResponse = {
      "id": 1,
      "name": "Anagha Org",
      "org_id": "orHVw3ikkCxJ",
      "currency": "EUR",
      "reimbursable_last_synced_at": null,
      "ccc_last_synced_at": null,
      "created_at": "2023-01-23T05:37:56.907997Z",
      "updated_at": "2023-01-23T05:37:56.908051Z",
      "user": [1]
    };
    service.getQBDWorkspace("orHVw3ikkCxJ").subscribe((value) => {
      const responseKeys = Object.keys(workspaceResponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=orHVw3ikkCxJ`
    });
    req.flush(workspaceResponse);
  });

  it('getWorkspaceid service', () => {
    const workspaceId = localStorage.getItem('workspaceId');
    const workspace_id = workspaceId  ? JSON.parse(workspaceId) : null;
    const id = service.getWorkspaceId();
    const org = workspace_id;
    expect(id).toEqual(org);
  });

  it('setOnboardingState and getOnboardingState service', () => {
    service.setOnboardingState(QBDOnboardingState.COMPLETE);
    const state = 'COMPLETE';
    const response = service.getOnboardingState();
    expect(state).toEqual(response);
  });

  it('setOnboardingState and getOnboardingState service', () => {
    localStorage.removeItem('QBDOnboardingState');
    const state = 'EXPORT_SETTINGS';
    const response = service.getOnboardingState();
    expect(state).toEqual(response);
  });

  it('syncFyleDimensions function check', () => {
    service.syncFyleDimensions().subscribe((value) => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/1/fyle/sync_dimensions/`
    });
    req.flush({});
  });

});
