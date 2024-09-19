import { getTestBed, TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { minimalUser } from '../../interceptor/jwt.fixture';

xdescribe('UserService', () => {
  let service: UserService;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [UserService]
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
