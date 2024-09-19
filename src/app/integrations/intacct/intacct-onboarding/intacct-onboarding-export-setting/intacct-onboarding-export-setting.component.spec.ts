import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctOnboardingExportSettingComponent } from './intacct-onboarding-export-setting.component';

xdescribe('IntacctOnboardingExportSettingComponent', () => {
  let component: IntacctOnboardingExportSettingComponent;
  let fixture: ComponentFixture<IntacctOnboardingExportSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctOnboardingExportSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctOnboardingExportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
