import { TestBed } from '@angular/core/testing';

import { SiUserService } from './si-user.service';

xdescribe('SiUserService', () => {
  let service: SiUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
