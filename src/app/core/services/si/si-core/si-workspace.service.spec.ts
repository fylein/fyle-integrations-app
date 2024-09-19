import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { environment } from 'src/environments/environment';

import { SiWorkspaceService } from './si-workspace.service';

xdescribe('SiWorkspaceService', () => {
  let service: SiWorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.si_api_url;
  beforeEach(() => {
    localStorage.setItem('si.workspaceId', '1');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiWorkspaceService]
    });
    injector = getTestBed();
    service = TestBed.inject(SiWorkspaceService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('postSiWorkspace service check', () => {
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
    service.postWorkspace().subscribe((value) => {
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

  it('getSiWorkspace service check', () => {
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
    service.getWorkspace("orHVw3ikkCxJ").subscribe((value) => {
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
    const workspaceId = localStorage.getItem('si.workspaceId');
    const workspace_id = workspaceId  ? JSON.parse(workspaceId) : null;
    const id = service.getWorkspaceId();
    const org = workspace_id;
    expect(id).toEqual(org);
  });

  it('setOnboardingState and getOnboardingState service', () => {
    service.setIntacctOnboardingState(IntacctOnboardingState.COMPLETE);
    const state = 'COMPLETE';
    const response = service.getIntacctOnboardingState();
    expect(state).toEqual(response);
  });

  it('setOnboardingState and getOnboardingState service', () => {
    localStorage.removeItem('onboarding-state');
    const state = 'CONNECTION';
    const response = service.getIntacctOnboardingState();
    expect(state).toEqual(response);
  });

});
