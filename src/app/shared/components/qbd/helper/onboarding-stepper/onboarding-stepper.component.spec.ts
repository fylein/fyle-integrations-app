import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'primeng/api';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { OnboardingStepperComponent } from './onboarding-stepper.component';

xdescribe('OnboardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  let router: Router;
  let service2: any;

  beforeEach(async () => {
    service2 = {
      getOnboardingState: () => QBDOnboardingState.FIELD_MAPPINGS
    };
    localStorage.setItem('QBDOnboardingState', JSON.stringify('EXPORT_SETTINGS'));
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ OnboardingStepperComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: QbdWorkspaceService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateActiveAndCompletedSteps function check', () => {
    component.currentStep = 'Export Settings';
    expect((component as any).updateActiveAndCompletedSteps()).toBeUndefined();
  });

  it('navigation function check', () => {
    expect(component.navigate(true, 'export_settings')).toBeUndefined;
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbd/onboarding/export_settings']);
  });
});
