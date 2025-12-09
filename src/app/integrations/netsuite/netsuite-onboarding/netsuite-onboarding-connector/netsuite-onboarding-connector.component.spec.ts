import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingConnectorComponent } from './netsuite-onboarding-connector.component';

xdescribe('NetsuiteOnboardingConnectorComponent', () => {
  let component: NetsuiteOnboardingConnectorComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteOnboardingConnectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
