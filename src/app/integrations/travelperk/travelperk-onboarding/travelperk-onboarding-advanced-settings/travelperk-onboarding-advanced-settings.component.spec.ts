import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkOnboardingAdvancedSettingsComponent } from './travelperk-onboarding-advanced-settings.component';

xdescribe('TravelperkOnboardingAdvancedSettingsComponent', () => {
  let component: TravelperkOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<TravelperkOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkOnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
