import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QbdOnboardingFieldSettingComponent } from './qbd-onboarding-field-setting.component';

xdescribe('QbdOnboardingFieldSettingComponent', () => {
  let component: QbdOnboardingFieldSettingComponent;
  let fixture: ComponentFixture<QbdOnboardingFieldSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdOnboardingFieldSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingFieldSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
