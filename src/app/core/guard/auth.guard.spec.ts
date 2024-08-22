import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/common/auth.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    const service1 = {
      isLoggedIn: () => true
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: AuthService, useValue: service1},
        {provide: Router, useValue: router}
      ]
    });

    authService = TestBed.inject(AuthService);
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow user to proceed', () => {
    spyOn(authService, 'isLoggedIn').and.callThrough();

    const result = guard.canActivate().valueOf();
    expect(result).toBeTrue();

    expect(authService.isLoggedIn).toHaveBeenCalled();
  });

  it('should block user to proceed', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);

    const result = guard.canActivate().valueOf();
    expect(result).toBeFalse();

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
