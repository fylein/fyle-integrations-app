import { getTestBed, TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { minimalUser } from '../../interceptor/jwt.fixture';

xdescribe('UserService', () => {
  let service: UserService;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [UserService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    injector = getTestBed();
    service = injector.inject(UserService);
  });

  it('should store and retrieve user profile', () => {
    service.storeUserProfile(minimalUser);

    const storedUser = service.getUserProfile();
    expect(storedUser).toEqual(minimalUser);
  });
});
