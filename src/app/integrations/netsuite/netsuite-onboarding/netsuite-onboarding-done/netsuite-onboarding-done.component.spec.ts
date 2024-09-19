import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingDoneComponent } from './netsuite-onboarding-done.component';

xdescribe('NetsuiteOnboardingDoneComponent', () => {
  let component: NetsuiteOnboardingDoneComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteOnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
