import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboOnboardingDoneComponent } from './qbo-onboarding-done.component';

xdescribe('QboOnboardingDoneComponent', () => {
  let component: QboOnboardingDoneComponent;
  let fixture: ComponentFixture<QboOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
