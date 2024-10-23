import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingConnectorComponent } from './qbd-direct-onboarding-connector.component';

describe('QbdDirectOnboardingConnectorComponent', () => {
  let component: QbdDirectOnboardingConnectorComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingConnectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
