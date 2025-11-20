import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { loginResponse } from 'src/app/core/interceptor/jwt.fixture';
import { AuthService } from 'src/app/core/services/common/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };

  const service1 = {
    checkLoginStatusAndLogout: () => undefined,
    login: () => of(loginResponse),
    logout: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [RouterTestingModule],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                queryParams: of({
                    code: 'dummy-auth-code'
                })
            }
        },
        { provide: AuthService, useValue: service1 },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations']);
  });
});
