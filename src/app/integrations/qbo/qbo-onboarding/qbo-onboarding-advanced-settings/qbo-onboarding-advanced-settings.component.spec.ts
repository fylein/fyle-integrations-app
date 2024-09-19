import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboOnboardingAdvancedSettingsComponent } from './qbo-onboarding-advanced-settings.component';

xdescribe('QboOnboardingAdvancedSettingsComponent', () => {
  let component: QboOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<QboOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
