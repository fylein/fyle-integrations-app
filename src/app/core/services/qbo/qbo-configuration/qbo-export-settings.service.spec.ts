import { TestBed } from '@angular/core/testing';

import { QboExportSettingsService } from './qbo-export-settings.service';

xdescribe('QboExportSettingsService', () => {
  let service: QboExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
