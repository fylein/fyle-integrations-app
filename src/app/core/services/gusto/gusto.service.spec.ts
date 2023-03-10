import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { OrgService } from '../org/org.service';

import { GustoService } from './gusto.service';
import { GustoMockConfiguration, GustoMockConfigurationPayload, GustoMockData } from './gusto.service.fixture';

describe('GustoService', () => {
  let service: GustoService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let orgService: OrgService;
  const API_BASE_URL = environment.api_url;
  const service1 = {
    getOrgId: () => 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: OrgService, useValue: service1 }
      ]
    });
    injector = getTestBed();
    service = TestBed.inject(GustoService);
    orgService = injector.inject(OrgService);
    httpMock = injector.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get bamboo hr data', () => {
    service.getGustoData().subscribe((res) => {
      expect(res).toEqual(GustoMockData);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/orgs/1/gusto/home/`
    });

    req.flush(GustoMockData);
  });

  it('should create folder', () => {
    service.createFolder().subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/gusto/folder/`
    });

    req.flush({});
  });

  it('should upload package', () => {
    service.uploadPackage().subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/gusto/packages/`
    });

    req.flush({});
  });

  it('should get configurations', () => {
    service.getConfigurations().subscribe((res) => {
      expect(res).toEqual(GustoMockConfiguration);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/orgs/1/gusto/configuration/?org_id=1`
    });

    expect(req.request.params.get('org_id')).toEqual('1');

    req.flush(GustoMockConfiguration);
  });

  it('should post configuration', () => {
    service.postConfigurations(GustoMockConfigurationPayload).subscribe((res) => {
      expect(res).toEqual(GustoMockConfiguration);
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/gusto/configuration/`
    });

    req.flush(GustoMockConfiguration);
  });

  it('should disconnect bamboo hr', () => {
    service.disconnectGusto().subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/gusto/disconnect/`
    });

    req.flush({});
  });

  it('should refresh employees', () => {
    service.syncEmployees().subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/gusto/refresh_employees/`
    });

    req.flush({});
  });

});
