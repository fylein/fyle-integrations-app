import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkOnboardingDoneComponent } from './travelperk-onboarding-done.component';

xdescribe('TravelperkOnboardingDoneComponent', () => {
  let component: TravelperkOnboardingDoneComponent;
  let fixture: ComponentFixture<TravelperkOnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelperkOnboardingDoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelperkOnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
