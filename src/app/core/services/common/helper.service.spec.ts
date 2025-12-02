import { TestBed } from '@angular/core/testing';

import { HelperService } from './helper.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HelperService', () => {
  let service: HelperService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: 'localhost/path/intacct' };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: Router, useValue: routerSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setBaseApiURL function check', () => {
    expect(service.setBaseApiURL()).toBeUndefined();
  });
});
