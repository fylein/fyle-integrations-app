import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdAutoOnboardingComponent } from './qbd-auto-onboarding.component';

describe('QbdAutoOnboardingComponent', () => {
  let component: QbdAutoOnboardingComponent;
  let fixture: ComponentFixture<QbdAutoOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdAutoOnboardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdAutoOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
