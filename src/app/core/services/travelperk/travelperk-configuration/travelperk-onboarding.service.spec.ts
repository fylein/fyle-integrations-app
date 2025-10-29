import { TestBed } from '@angular/core/testing';

import { TravelperkOnboardingService } from './travelperk-onboarding.service';

xdescribe('TravelperkOnboardingService', () => {
  let service: TravelperkOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelperkOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
