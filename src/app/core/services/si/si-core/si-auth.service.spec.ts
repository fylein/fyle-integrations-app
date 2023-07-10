import { TestBed } from '@angular/core/testing';

import { SiAuthService } from './si-auth.service';

describe('SiAuthService', () => {
  let service: SiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
