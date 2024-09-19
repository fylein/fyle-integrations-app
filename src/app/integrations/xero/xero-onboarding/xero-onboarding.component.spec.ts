import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroOnboardingComponent } from './xero-onboarding.component';

xdescribe('XeroOnboardingComponent', () => {
  let component: XeroOnboardingComponent;
  let fixture: ComponentFixture<XeroOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
