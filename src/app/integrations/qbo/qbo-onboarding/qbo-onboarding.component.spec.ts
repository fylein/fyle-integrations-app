import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboOnboardingComponent } from './qbo-onboarding.component';

xdescribe('QboOnboardingComponent', () => {
  let component: QboOnboardingComponent;
  let fixture: ComponentFixture<QboOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
