import { TestBed } from '@angular/core/testing';

import { QboAdvancedSettingsService } from './qbo-advanced-settings.service';

xdescribe('QboAdvancedSettingsService', () => {
  let service: QboAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
