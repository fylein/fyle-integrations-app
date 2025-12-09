import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingAdvancedSettingsComponent } from './netsuite-onboarding-advanced-settings.component';

xdescribe('NetsuiteOnboardingAdvancedSettingsComponent', () => {
  let component: NetsuiteOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteOnboardingAdvancedSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
