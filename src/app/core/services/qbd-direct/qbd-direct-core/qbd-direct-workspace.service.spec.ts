import { TestBed } from '@angular/core/testing';

import { QbdDirectWorkspaceService } from './qbd-direct-workspace.service';

describe('QbdDirectWorkspaceService', () => {
  let service: QbdDirectWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
