import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'primeng/api';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctStepperComponent } from './intacct-stepper.component';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

describe('IntacctStepperComponent', () => {
  let component: IntacctStepperComponent;
  let fixture: ComponentFixture<IntacctStepperComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  let router: Router;
  let service2: any;

  beforeEach(async () => {
    service2 = {
      getIntacctOnboardingState: () => IntacctOnboardingState.CONNECTION
    };
    localStorage.setItem('IntacctOnboardingState', JSON.stringify('EXPORT_SETTINGS'));
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ IntacctStepperComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SiWorkspaceService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctStepperComponent);
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
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/intacct/onboarding/export_settings']);
  });
});
