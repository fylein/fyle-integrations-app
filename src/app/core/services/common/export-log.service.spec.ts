import { TestBed } from '@angular/core/testing';

import { ExportLogService } from './si-export-log.service';

xdescribe('ExportLogService', () => {
  let service: ExportLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
