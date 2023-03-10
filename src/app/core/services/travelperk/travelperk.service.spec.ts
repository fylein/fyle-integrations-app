import { TestBed } from '@angular/core/testing';

import { TravelperkService } from './travelperk.service';

describe('TravelperkService', () => {
  let service: TravelperkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelperkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
