import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkOnboardingComponent } from './travelperk-onboarding.component';

xdescribe('TravelperkOnboardingComponent', () => {
  let component: TravelperkOnboardingComponent;
  let fixture: ComponentFixture<TravelperkOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelperkOnboardingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelperkOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
