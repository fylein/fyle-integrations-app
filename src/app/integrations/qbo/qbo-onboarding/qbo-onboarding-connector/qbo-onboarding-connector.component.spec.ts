import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboOnboardingConnectorComponent } from './qbo-onboarding-connector.component';

xdescribe('QboOnboardingConnectorComponent', () => {
  let component: QboOnboardingConnectorComponent;
  let fixture: ComponentFixture<QboOnboardingConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QboOnboardingConnectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QboOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
