import { TestBed } from '@angular/core/testing';

import { NetsuiteAuthService } from './netsuite-auth.service';

xdescribe('NetsuiteAuthService', () => {
  let service: NetsuiteAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
