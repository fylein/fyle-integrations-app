import { TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingService } from './business-central-onboarding.service';

xdescribe('BusinessCentralOnboardingService', () => {
  let service: BusinessCentralOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
