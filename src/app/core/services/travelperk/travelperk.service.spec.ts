// import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// import { getTestBed, TestBed } from '@angular/core/testing';
// import { environment } from 'src/environments/environment';
// import { OrgService } from '../org/org.service';
// import { travelperkMockData, connectTravelperkMockData, connectAwsS3MockData, travelperkConfigurationMockData } from './travelperk.fixture';

// import { TravelperkService } from './travelperk.service';

// describe('TravelperkService', () => {
//   let service: TravelperkService;
//   let injector: TestBed;
//   let httpMock: HttpTestingController;
//   let orgService: OrgService;
//   const API_BASE_URL = environment.api_url;
//   const service1 = {
//     getOrgId: () => 1
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule
//       ],
//       providers: [
//         { provide: OrgService, useValue: service1 }
//       ]
//     });
//     injector = getTestBed();
//     service = TestBed.inject(TravelperkService);
//     orgService = injector.inject(OrgService);
//     httpMock = injector.inject(HttpTestingController);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should get travelperk data', () => {
//     service.getTravelperkData().subscribe((res) => {
//       expect(res).toEqual(travelperkMockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'GET',
//       url: `${API_BASE_URL}/orgs/1/travelperk/`
//     });

//     req.flush(travelperkMockData);
//   });

//   it('should create folder', () => {
//     service.createFolder().subscribe((res) => {
//       expect(res).toEqual({});
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/folder/`
//     });

//     req.flush({});
//   });

//   it('should upload package', () => {
//     service.uploadPackage().subscribe((res) => {
//       expect(res).toEqual({});
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/packages/`
//     });

//     req.flush({});
//   });

//   it('should connect travelperk', () => {
//     service.connectTravelperk().subscribe((res) => {
//       expect(res).toEqual(connectTravelperkMockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/travelperk_connection/`
//     });

//     req.flush(connectTravelperkMockData);
//   });

//   it('should connect aws', () => {
//     service.connectAwsS3().subscribe((res) => {
//       expect(res).toEqual(connectAwsS3MockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/s3_connection/`
//     });

//     req.flush(connectAwsS3MockData);
//   });

//   it('should get travelperk configurations', () => {
//     service.getConfigurations().subscribe((res) => {
//       expect(res).toEqual(travelperkConfigurationMockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'GET',
//       url: `${API_BASE_URL}/orgs/1/travelperk/configurations/?org_id=1`
//     });

//     req.flush(travelperkConfigurationMockData);
//   });

//   it('should post travelperk configurations', () => {
//     service.postConfigurations().subscribe((res) => {
//       expect(res).toEqual(travelperkConfigurationMockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/configurations/`
//     });

//     req.flush(travelperkConfigurationMockData);
//   });

//   it('should patch travelperk configurations', () => {
//     service.patchConfigurations(true).subscribe((res) => {
//       expect(res).toEqual(travelperkConfigurationMockData);
//     });

//     const req = httpMock.expectOne({
//       method: 'PATCH',
//       url: `${API_BASE_URL}/orgs/1/travelperk/recipe_status/`
//     });

//     req.flush(travelperkConfigurationMockData);
//   });

//   it('connect function check', () => {
//     service.connect('deded').subscribe((value) => {
//       expect(value).toEqual({});
//     });

//     const req = httpMock.expectOne({
//       method: 'POST',
//       url: `${API_BASE_URL}/orgs/1/travelperk/connect/`
//     });

//     req.flush({});
//   });
// });
