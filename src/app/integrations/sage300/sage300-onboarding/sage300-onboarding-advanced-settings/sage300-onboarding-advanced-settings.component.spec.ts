import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300OnboardingAdvancedSettingsComponent } from './sage300-onboarding-advanced-settings.component';

xdescribe('Sage300OnboardingAdvancedSettingsComponent', () => {
  let component: Sage300OnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<Sage300OnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300OnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300OnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
