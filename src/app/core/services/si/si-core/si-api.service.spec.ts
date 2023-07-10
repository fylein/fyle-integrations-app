import { TestBed } from '@angular/core/testing';

import { SiApiService } from './si-api.service';

describe('SiApiService', () => {
  let service: SiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
