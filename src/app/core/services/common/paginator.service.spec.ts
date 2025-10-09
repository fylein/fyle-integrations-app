import { TestBed } from '@angular/core/testing';

import { PaginatorService } from './paginator.service';

xdescribe('PaginatorService', () => {
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
