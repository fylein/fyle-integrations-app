//// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//// import { getTestBed, TestBed } from '@angular/core/testing';
//// import { environment } from 'src/environments/environment';
//// import { AppName } from '../../models/enum/enum.model';
//// import { bambooHRMockConfigurationPayload } from '../bamboo-hr/bamboo-hr.fixture';
//// import { StorageService } from '../common/storage.service';
//// import { orgMockData, generateTokenData } from './org.fixture';
//
//// import { OrgService } from './org.service';
//
//// describe('OrgService', () => {
////   let service: OrgService;
////   let injector: TestBed;
////   let httpMock: HttpTestingController;
////   let storageService: StorageService;
////   const API_BASE_URL = environment.api_url;
//
////   const service1 = {
////     get: () => '1'
////   };
//
////   beforeEach(() => {
////     TestBed.configureTestingModule({
////       imports: [
////         HttpClientTestingModule
////       ],
////       providers: [
////         { provide: StorageService, useValue: service1 }
////       ]
////     });
////     injector = getTestBed();
////     service = TestBed.inject(OrgService);
////     storageService = injector.inject(StorageService);
////     httpMock = injector.inject(HttpTestingController);
////   });
//
////   it('should be created', () => {
////     expect(service).toBeTruthy();
////   });
//
////   it('should create org', () => {
////     service.createOrg().subscribe((res) => {
////       expect(res).toEqual(orgMockData);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'PATCH',
////       url: `${API_BASE_URL}/orgs/`
////     });
//
////     req.flush(orgMockData);
////   });
//
////   it('should create workato workspace', () => {
////     spyOn(service, 'getOrgId').and.returnValue('1');
////     service.createWorkatoWorkspace().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'PATCH',
////       url: `${API_BASE_URL}/orgs/1/workato_workspace/`
////     });
//
////     req.flush({});
////   });
//
////   it('should connect Fyle', () => {
////     spyOn(service, 'getOrgId').and.returnValue('1');
////     service.connectFyle().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/connect_fyle/`
////     });
//
////     req.flush({});
////   });
//
////   it('should connect Fyle', () => {
////     spyOn(service, 'getOrgId').and.returnValue('1');
////     service.connectFyle(AppName.BAMBOO_HR).subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/connect_fyle/`
////     });
//
////     req.flush({});
////   });
//
////   it('should connect sendgrid', () => {
////     spyOn(service, 'getOrgId').and.returnValue('1');
////     service.connectSendgrid().subscribe((res) => {
////       expect(res).toEqual({});
////     });
//
////     const req = httpMock.expectOne({
////       method: 'POST',
////       url: `${API_BASE_URL}/orgs/1/sendgrid_connection/`
////     });
//
////     req.flush({});
////   });
//
////   it('should get additional emails', () => {
////     spyOn(service, 'getOrgId').and.returnValue('1');
////     service.getAdditionalEmails().subscribe((res) => {
////       expect(res).toEqual(bambooHRMockConfigurationPayload.additional_email_options);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'GET',
////       url: `${API_BASE_URL}/orgs/1/admins/`
////     });
//
////     req.flush(bambooHRMockConfigurationPayload.additional_email_options);
////   });
//
////   it('should get org', () => {
////     const orgId = service.getOrgId();
////     expect(orgId).toEqual('1');
////   });
//
////   it('should get orgs', () => {
////     service.getOrgs('loloi').subscribe((res) => {
////       expect(res).toEqual(orgMockData);
////     });
//
////     const req = httpMock.expectOne({
////       method: 'GET',
////       url: `${API_BASE_URL}/orgs/?org_id=loloi`
////     });
//
////     expect(req.request.params.get('org_id')).toEqual('loloi');
//
////     req.flush(orgMockData);
////   });
//
////   it("getCachedOrg service check", () => {
////     const org = service.getCachedOrg();
////     if (org === null) {
////       expect(org).toBeNull;
////     } else {
////       expect(org).toBeGreaterThan(0);
////     }
////   });
//
////   it("get token for iframe", () => {
////     service.generateToken('25').subscribe((res) => {
////       expect(res).toEqual(generateTokenData);
////     });
//
////     const req = httpMock.expectOne(
////       req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/orgs/1/generate_token/`)
////     );
//
////     req.flush(generateTokenData);
////   });
//
//
////   it('sanitizeUrl function check', () => {
////     expect(service.sanitizeUrl('fyke')).toBeDefined();
////   });
//
//// });
