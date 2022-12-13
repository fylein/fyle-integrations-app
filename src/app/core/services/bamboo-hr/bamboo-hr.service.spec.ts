import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BambooHrService } from './bamboo-hr.service';

describe('BambooHrService', () => {
  let service: BambooHrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BambooHrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
