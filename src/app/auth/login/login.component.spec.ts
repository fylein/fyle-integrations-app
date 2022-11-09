import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { loginResponse } from 'src/app/core/interceptor/jwt.fixture';
import { AuthService } from 'src/app/core/services/core/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const service1 = {
    checkLoginStatusAndLogout: () => undefined,
    login: () => of(loginResponse),
    logout: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, RouterTestingModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              code: 'dummy-auth-code'
            })
          }
        },
        { provide: AuthService, useValue: service1}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
