import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdPostOnboardingHeaderComponent } from './qbd-post-onboarding-header.component';

describe('PostOnboardingHeaderComponent', () => {
  let component: QbdPostOnboardingHeaderComponent;
  let fixture: ComponentFixture<QbdPostOnboardingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdPostOnboardingHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdPostOnboardingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
