import { TestBed } from '@angular/core/testing';

import { QboImportSettingsService } from './qbo-import-settings.service';

xdescribe('QboImportSettingsService', () => {
  let service: QboImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
