import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingDoneComponent } from './qbd-direct-onboarding-done.component';

xdescribe('QbdDirectOnboardingDoneComponent', () => {
  let component: QbdDirectOnboardingDoneComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingDoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
