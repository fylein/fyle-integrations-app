import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroOnboardingDoneComponent } from './xero-onboarding-done.component';

xdescribe('XeroOnboardingDoneComponent', () => {
  let component: XeroOnboardingDoneComponent;
  let fixture: ComponentFixture<XeroOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
