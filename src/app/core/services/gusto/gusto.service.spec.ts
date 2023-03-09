import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GustoService } from './gusto.service';

describe('GustoService', () => {
  let service: GustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
