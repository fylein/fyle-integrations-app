import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkOnboardingPaymentProfileSettingsComponent } from './travelperk-onboarding-payment-profile-settings.component';

xdescribe('TravelperkOnboardingPaymentProfileSettingsComponent', () => {
  let component: TravelperkOnboardingPaymentProfileSettingsComponent;
  let fixture: ComponentFixture<TravelperkOnboardingPaymentProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelperkOnboardingPaymentProfileSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelperkOnboardingPaymentProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
