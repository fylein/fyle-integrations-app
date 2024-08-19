//// import { ComponentFixture, TestBed } from '@angular/core/testing';
//// import { Router } from '@angular/router';
//// import { AccountingIntegrationApp, InAppIntegration, IntegrationView } from 'src/app/core/models/enum/enum.model';
//// import { EventsService } from 'src/app/core/services/common/events.service';
//// import { LandingComponent } from './landing.component';
//// import { HttpClientModule } from '@angular/common/http';
//// import { HttpClientTestingModule } from '@angular/common/http/testing';
//// import { OrgService } from 'src/app/core/services/org/org.service';
//// import { orgMockData } from 'src/app/core/services/org/org.fixture';
//// import { environment } from 'src/environments/environment';
//// import { of } from 'rxjs';
//// import { EventEmitter } from '@angular/core';
//
//// xdescribe('LandingComponent', () => {
////   let component: LandingComponent;
////   let fixture: ComponentFixture<LandingComponent>;
////   let eventsService: EventsService;
////   const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/integrations/bamboo_hr' };
//
////   const service1 = {
////     postEvent: () => null
////   };
//
////   const service2 = {
////     getCachedOrg: () => orgMockData
////   };
//
////   beforeEach(async () => {
////     await TestBed.configureTestingModule({
////       declarations: [ LandingComponent ],
////       imports: [
////         HttpClientModule, HttpClientTestingModule
////       ],
////       providers: [
////         { provide: EventsService, useValue: service1 },
////         { provide: OrgService, useValue: service2 },
////         { provide: Router, useValue: routerSpy }
////       ]
////     })
////     .compileComponents();
//
////     fixture = TestBed.createComponent(LandingComponent);
////     component = fixture.componentInstance;
////     eventsService = TestBed.inject(EventsService);
////     fixture.detectChanges();
////   });
//
////   it('should create', () => {
////     expect(component).toBeTruthy();
////   });
//
////   it('should switch view based on selection', () => {
////     expect(component.integrationTabs.ALL).toBeTrue();
////     component.switchView(IntegrationView.ACCOUNTING);
////     expect(component.integrationTabs.ACCOUNTING).toBeTrue();
////     expect(component.integrationTabs.ALL).toBeFalse();
////   });
//
////   it('should open In App Integration', () => {
////     component.openInAppIntegration(InAppIntegration.BAMBOO_HR);
////     expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/bamboo_hr/']);
////   });
//
////   it('openAccountingIntegrationApp function should open the correct app', () => {
////     expect(component.openAccountingIntegrationApp(AccountingIntegrationApp.NETSUITE)).toBeUndefined();
////   });
//// });
