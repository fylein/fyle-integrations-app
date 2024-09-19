import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppLandingPageHeaderComponent } from './app-landing-page-header.component';

xdescribe('AppLandingPageHeaderComponent', () => {
  let component: AppLandingPageHeaderComponent;
  let fixture: ComponentFixture<AppLandingPageHeaderComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppLandingPageHeaderComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule // Added RouterTestingModule for navigation testing
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLandingPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync employees', () => {
    spyOn(component.syncEmployees, 'emit');

    component.syncData();
    expect(component.syncEmployees.emit).toHaveBeenCalled();
  });

  it('should disconnect Bamboo HR connection', () => {
    spyOn(component.disconnectIntegration, 'emit');

    component.disconnect();
    expect(component.disconnectIntegration.emit).toHaveBeenCalled();
  });

  it('should navigate to onboarding page', fakeAsync(() => {
    component.postConnectionRoute = 'qbd/onboarding/export_settings';
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbd/onboarding/export_settings']);
    component.postConnectionRoute = 'intacct/onboarding/connector';
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/connector']);
  }));
});
