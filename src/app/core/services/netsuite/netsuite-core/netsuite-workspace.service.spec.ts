import { TestBed } from '@angular/core/testing';

import { NetsuiteWorkspaceService } from './netsuite-workspace.service';

xdescribe('NetsuiteWorkspaceService', () => {
  let service: NetsuiteWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
