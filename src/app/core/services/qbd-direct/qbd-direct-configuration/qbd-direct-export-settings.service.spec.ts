import { TestBed } from '@angular/core/testing';

import { QbdDirectExportSettingsService } from './qbd-direct-export-settings.service';

describe('QbdDirectExportSettingsService', () => {
  let service: QbdDirectExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
