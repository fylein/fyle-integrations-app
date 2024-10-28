import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingComponent } from './qbd-direct-onboarding.component';

xdescribe('QbdDirectOnboardingComponent', () => {
  let component: QbdDirectOnboardingComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
