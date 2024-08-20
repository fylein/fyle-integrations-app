import { TestBed } from '@angular/core/testing';

import { AppcuesService } from './appcues.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UserService } from '../misc/user.service';
import { minimalUser } from '../../interceptor/jwt.fixture';

xdescribe('AppcuesService', () => {
  let service: AppcuesService;

  beforeEach(() => {
    const service2 = {
      getUserProfile: () => of(minimalUser)
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppcuesService,
        { provide: UserService, useValue: service2 }
      ]
    });
    service = TestBed.inject(AppcuesService);
    (window as any).Appcues = {
      identify: () => undefined
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get function check', () => {
    expect(service.appcues).toBeDefined();
  });

  it('initialiseAppcues function check', () => {
    // @ts-ignore: force this private property value for testing.
    expect(service.initialiseAppcues()).toBeUndefined();
  });
});
