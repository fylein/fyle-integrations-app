import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingAdvancedSettingsComponent } from './qbd-direct-onboarding-advanced-settings.component';

xdescribe('QbdDirectOnboardingAdvancedSettingsComponent', () => {
  let component: QbdDirectOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingAdvancedSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
