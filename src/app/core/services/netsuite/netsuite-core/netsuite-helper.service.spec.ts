import { TestBed } from '@angular/core/testing';

import { NetsuiteHelperService } from './netsuite-helper.service';

xdescribe('NetsuiteHelperService', () => {
  let service: NetsuiteHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
