import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroOnboardingAdvancedSettingsComponent } from './xero-onboarding-advanced-settings.component';

xdescribe('XeroOnboardingAdvancedSettingsComponent', () => {
  let component: XeroOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<XeroOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
