import { TestBed } from '@angular/core/testing';

import { SkipExportService } from './skip-export.service';

xdescribe('SkipExportService', () => {
  let service: SkipExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkipExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
