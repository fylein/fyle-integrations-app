import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingPreRequisiteComponent } from './qbd-direct-onboarding-pre-requisite.component';

describe('QbdDirectOnboardingPreRequisiteComponent', () => {
  let component: QbdDirectOnboardingPreRequisiteComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingPreRequisiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingPreRequisiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingPreRequisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
