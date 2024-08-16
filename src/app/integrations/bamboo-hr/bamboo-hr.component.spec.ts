// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { MessageService } from 'primeng/api';
// import { of, throwError } from 'rxjs';
// import { bambooHRMockConfiguration, bambooHRMockConfigurationPayload, bambooHrMockData, bambooHrMockWithoutToken } from 'src/app/core/services/bamboo-hr/bamboo-hr.fixture';
// import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';
// import { orgMockData } from 'src/app/core/services/org/org.fixture';
// import { OrgService } from 'src/app/core/services/org/org.service';

// import { BambooHrComponent } from './bamboo-hr.component';

// describe('BambooHrComponent', () => {
//   let component: BambooHrComponent;
//   let fixture: ComponentFixture<BambooHrComponent>;
//   let formBuilder: FormBuilder;
//   let orgService: OrgService;
//   let bambooHrService: BambooHrService;

//   const service1 = {
//     getCachedOrg: () => of(orgMockData),
//     getAdditionalEmails: () => of(bambooHRMockConfiguration.additional_email_options),
//     createWorkatoWorkspace: () => of({}),
//     connectSendgrid: () => of({}),
//     connectFyle: () => of({})
//   };

//   const service2 = {
//     connectBambooHR: () => of({}),
//     getBambooHRData: () => of(bambooHrMockData),
//     getConfigurations: () => of(bambooHRMockConfiguration),
//     createFolder: () => of({}),
//     uploadPackage: () => of({}),
//     disconnectBambooHr: () => of({}),
//     syncEmployees: () => of({}),
//     postConfigurations: () => of(bambooHRMockConfigurationPayload)
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ BambooHrComponent ],
//       imports: [
//         HttpClientModule, HttpClientTestingModule
//       ],
//       providers: [
//         FormBuilder,
//         MessageService,
//         { provide: OrgService, useValue: service1 },
//         { provide: BambooHrService, useValue: service2 }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(BambooHrComponent);
//     formBuilder = TestBed.inject(FormBuilder);
//     component = fixture.componentInstance;
//     orgService = TestBed.inject(OrgService);
//     bambooHrService = TestBed.inject(BambooHrService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should get Bamboo HR Data', () => {
//     (component as any).setupPage();
//     expect(component.bambooHrData).toBe(bambooHrMockData);
//     expect(component.isBambooConnected).toBe(true);

//     const bambooHrMockData2 = { ...bambooHrMockData };
//     bambooHrMockData2.api_token = '';
//     spyOn(bambooHrService, 'getBambooHRData').and.returnValue(of(bambooHrMockData2));
//     (component as any).setupPage();
//     expect(component.bambooHrData).toBe(bambooHrMockData2);
//     expect(component.isBambooConnected).toBe(false);
//   });

//   it('should start syncing data for new logins', () => {
//     spyOn(bambooHrService, 'getBambooHRData').and.returnValue(throwError({}));
//     (component as any).setupPage();
//     expect(component.isBambooConnected).toBe(false);
//   });

//   it('should sync bamboo hr data based on data', () => {
//     component.bambooHrData = bambooHrMockWithoutToken;
//     (component as any).setupBambooHr();
//     expect(component.showErrorScreen).toBeUndefined();

//     spyOn(bambooHrService, 'createFolder').and.returnValue(throwError({}));
//     (component as any).setupBambooHr();
//     expect(component.showErrorScreen).toBeTrue();
//   });

//   it(`get emails shoudn't fail incase of new orgs`, () => {
//     spyOn(bambooHrService, 'getConfigurations').and.returnValue(throwError({}));
//     (component as any).getBambooHrConfiguration();

//     expect(component.additionalEmails).toEqual(bambooHRMockConfiguration.additional_email_options);
//   });

//   it('should disconnect Bamboo HR', () => {
//     component.isLoading = true;
//     component.disconnectBambooHr();

//     expect(component.isBambooConnected).toBeFalse();
//     expect(component.isLoading).toBeFalse();
//   });

//   it('should sync employees', () => {
//     component.isLoading = false;
//     component.syncEmployees();

//     expect(component.isLoading).toBeFalse();
//   });

//   it('should update/create configurations', () => {
//     component.isConfigurationSaveInProgress = true;
//     component.configurationUpdatesHandler(bambooHRMockConfigurationPayload);
//     expect(component.isConfigurationSaveInProgress).toBeFalse();
//   });

//   it('should open dialog', () => {
//     component.showDialog = false;
//     component.openDialog();

//     expect(component.showDialog).toBeTrue();
//   });

//   it('should connect to Bamboo HR account', () => {
//     component.isBambooConnectionInProgress = true;
//     component.bambooConnectionForm = formBuilder.group({
//       subdomain: ['real domain'],
//       apiToken: ['loloxoxo']
//     });
//     component.connectBambooHR();

//     expect(component.isBambooConnectionInProgress).toBeFalse();

//     spyOn(bambooHrService, 'connectBambooHR').and.returnValue(throwError({}));
//     component.connectBambooHR();
//     expect(component.isBambooConnectionInProgress).toBeFalse();
//   });

//   it('closeToast function check', () => {
//     expect(component.closeToast()).toBeUndefined();
//   });

//   it('setupbambooHr function else case', () => {
//     component.org = orgMockData;
//     component.org.is_fyle_connected = true;
//     fixture.detectChanges();
//     expect((component as any).setupBambooHr()).toBeUndefined();
//   });
// });
