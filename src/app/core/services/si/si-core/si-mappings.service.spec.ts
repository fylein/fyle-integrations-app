import { TestBed } from '@angular/core/testing';

import { SiMappingsService } from './si-mappings.service';

describe('SiMappingsService', () => {
  let service: SiMappingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiMappingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
