import { TestBed } from '@angular/core/testing';

import { SiWorkspaceService } from './si-workspace.service';

describe('SiWorkspaceService', () => {
  let service: SiWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
