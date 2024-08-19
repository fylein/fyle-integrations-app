//// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//// import { getTestBed, TestBed } from '@angular/core/testing';
//// import { environment } from 'src/environments/environment';
//// import { OrgService } from '../org/org.service';
//// import { bambooHRMockConfiguration, bambooHRMockConfigurationPayload, bambooHRMockConnectionPayload, bambooHrMockData } from './bamboo-hr.fixture';
//
//// import { BambooHrService } from './bamboo-hr.service';
//
//// describe('BambooHrService', () => {
////   let service: BambooHrService;
////   let injector: TestBed;
////   let httpMock: HttpTestingController;
////   let orgService: OrgService;
////   const API_BASE_URL = environment.api_url;
////   const service1 = {
////     getOrgId: () => 1
////   };
//
////   beforeEach(() => {
////     TestBed.configureTestingModule({
////       imports: [
////         HttpClientTestingModule
////       ],
////       providers: [
////         { provide: OrgService, useValue: service1 }
////       ]
////     });
////     injector = getTestBed();
////     service = TestBed.inject(BambooHrService);
////     orgService = injector.inject(OrgService);
////     httpMock = injector.inject(HttpTestingController);
////   });
//
////   it('should be created', () => {
////     expect(service).toBeTruthy();
////   });
//
////   it('should get bamboo hr data', () => {
////     service.getBambooHRData().subscribe((res) => {
////       expect(res).toEqual(bambooHrMockData);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'GET',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/`
////     });
//
////     req.flush(bambooHrMockData);
////   });
//
////   it('should create folder', () => {
////     service.createFolder().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/folder/`
////     });
//
////     req.flush({});
////   });
//
////   it('should upload package', () => {
////     service.uploadPackage().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/packages/`
////     });
//
////     req.flush({});
////   });
//
////   it('should connect bamboo hr', () => {
////     service.connectBambooHR(bambooHRMockConnectionPayload).subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/bamboo_connection/`
////     });
//
////     req.flush({});
////   });
//
////   it('should get configurations', () => {
////     service.getConfigurations().subscribe((res) => {
////       expect(res).toEqual(bambooHRMockConfiguration);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'GET',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/configuration/?org_id=1`
////     });
//
////     expect(req.request.params.get('org_id')).toEqual('1');
//
////     req.flush(bambooHRMockConfiguration);
////   });
//
////   it('should post configuration', () => {
////     service.postConfigurations(bambooHRMockConfigurationPayload).subscribe((res) => {
////       expect(res).toEqual(bambooHRMockConfiguration);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/configuration/`
////     });
//
////     req.flush(bambooHRMockConfiguration);
////   });
//
////   it('should disconnect bamboo hr', () => {
////     service.disconnectBambooHr().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/disconnect/`
////     });
//
////     req.flush({});
////   });
//
////   it('should refresh employees', () => {
////     service.syncEmployees().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/bamboohr/refresh_employees/`
////     });
//
////     req.flush({});
////   });
//// });
