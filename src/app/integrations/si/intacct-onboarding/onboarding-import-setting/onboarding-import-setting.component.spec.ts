import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingImportSettingComponent } from './onboarding-import-setting.component';

describe('OnboardingImportSettingComponent', () => {
  let component: OnboardingImportSettingComponent;
  let fixture: ComponentFixture<OnboardingImportSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingImportSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingImportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
