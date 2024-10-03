import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

xdescribe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get data - local storage', () => {
    const data = { name: 'Fyle' };
    service.set('test-data', data);
    const result = service.get('test-data');
    expect(result).toEqual(data);
  });

  it('should return null if data is not found', () => {
    const result = service.get('dummy');
    expect(result).toEqual(null);
  });
});
