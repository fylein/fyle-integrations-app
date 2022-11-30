import { TestBed } from '@angular/core/testing';

import { BambooHrService } from './bamboo-hr.service';

describe('BambooHrService', () => {
  let service: BambooHrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BambooHrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
