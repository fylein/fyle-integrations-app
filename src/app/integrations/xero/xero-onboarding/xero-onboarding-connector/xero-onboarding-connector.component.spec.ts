import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroOnboardingConnectorComponent } from './xero-onboarding-connector.component';

xdescribe('XeroOnboardingConnectorComponent', () => {
  let component: XeroOnboardingConnectorComponent;
  let fixture: ComponentFixture<XeroOnboardingConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
