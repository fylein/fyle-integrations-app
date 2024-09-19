import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingComponent } from './business-central-onboarding.component';

xdescribe('BusinessCentralOnboardingComponent', () => {
  let component: BusinessCentralOnboardingComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
