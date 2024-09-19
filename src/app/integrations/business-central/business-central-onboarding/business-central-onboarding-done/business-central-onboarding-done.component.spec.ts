import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingDoneComponent } from './business-central-onboarding-done.component';

xdescribe('BusinessCentralOnboardingDoneComponent', () => {
  let component: BusinessCentralOnboardingDoneComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralOnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
