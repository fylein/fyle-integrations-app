import { TestBed } from '@angular/core/testing';

import { AccountingExportService } from './accounting-export.service';

xdescribe('AccountingExportService', () => {
  let service: AccountingExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
