import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOnboardingHeaderComponent } from './post-onboarding-header.component';

describe('PostOnboardingHeaderComponent', () => {
  let component: PostOnboardingHeaderComponent;
  let fixture: ComponentFixture<PostOnboardingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOnboardingHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOnboardingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
