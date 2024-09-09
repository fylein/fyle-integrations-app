import { TestBed } from '@angular/core/testing';

import { QbdDirectImportSettingsService } from './qbd-direct-import-settings.service';

describe('QbdDirectImportSettingsService', () => {
  let service: QbdDirectImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
