import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdOnboardingAdvancedSettingComponent } from './qbd-onboarding-advanced-setting.component';

xdescribe('QbdOnboardingAdvancedSettingComponent', () => {
  let component: QbdOnboardingAdvancedSettingComponent;
  let fixture: ComponentFixture<QbdOnboardingAdvancedSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QbdOnboardingAdvancedSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingAdvancedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
