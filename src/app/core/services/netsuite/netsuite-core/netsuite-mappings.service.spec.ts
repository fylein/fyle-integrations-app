import { TestBed } from '@angular/core/testing';

import { NetsuiteMappingsService } from './netsuite-mappings.service';

xdescribe('NetsuiteMappingsService', () => {
  let service: NetsuiteMappingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteMappingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
