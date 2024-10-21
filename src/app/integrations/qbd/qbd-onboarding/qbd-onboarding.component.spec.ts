import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdOnboardingComponent } from './qbd-onboarding.component';

xdescribe('QbdOnboardingComponent', () => {
  let component: QbdOnboardingComponent;
  let fixture: ComponentFixture<QbdOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
