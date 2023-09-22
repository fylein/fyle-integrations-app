import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingDoneComponent } from './onboarding-done.component';
import { Router } from '@angular/router';

describe('OnboardingDoneComponent', () => {
  let component: OnboardingDoneComponent;
  let fixture: ComponentFixture<OnboardingDoneComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingDoneComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingDoneComponent);
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
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/intacct/main']);
  });
});
