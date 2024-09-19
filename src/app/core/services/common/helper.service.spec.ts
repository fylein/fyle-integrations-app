import { TestBed } from '@angular/core/testing';

import { HelperService } from './helper.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

xdescribe('HelperService', () => {
  let service: HelperService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: 'localhost/path/intacct' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: Router, useValue: routerSpy }
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
