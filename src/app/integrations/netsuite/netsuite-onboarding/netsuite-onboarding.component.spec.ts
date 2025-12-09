import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingComponent } from './netsuite-onboarding.component';

xdescribe('NetsuiteOnboardingComponent', () => {
  let component: NetsuiteOnboardingComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteOnboardingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
