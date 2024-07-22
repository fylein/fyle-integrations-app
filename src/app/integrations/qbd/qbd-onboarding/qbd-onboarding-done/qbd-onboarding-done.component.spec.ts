import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { QbdOnboardingDoneComponent } from './qbd-onboarding-done.component';

describe('QbdOnboardingDoneComponent', () => {
  let component: QbdOnboardingDoneComponent;
  let fixture: ComponentFixture<QbdOnboardingDoneComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdOnboardingDoneComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingDoneComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateToDashboard function check', () => {
    expect(component.navigateToDashboard()).toBeUndefined();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbd/main']);
  });
});
