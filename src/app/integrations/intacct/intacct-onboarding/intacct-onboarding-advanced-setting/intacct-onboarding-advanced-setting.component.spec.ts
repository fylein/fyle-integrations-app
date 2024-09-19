import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctOnboardingAdvancedSettingComponent } from './intacct-onboarding-advanced-setting.component';

xdescribe('IntacctOnboardingAdvancedSettingComponent', () => {
  let component: IntacctOnboardingAdvancedSettingComponent;
  let fixture: ComponentFixture<IntacctOnboardingAdvancedSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctOnboardingAdvancedSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctOnboardingAdvancedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
