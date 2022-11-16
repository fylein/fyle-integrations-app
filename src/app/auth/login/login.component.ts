import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  private saveUserProfileAndNavigate(code: string): void {
    console.log('final block before /login', code)
    this.authService.login(code).subscribe(response => {
      console.log('got response', response)
      const user: MinimalUser = {
        'email': response.user.email,
        'access_token': response.access_token,
        'refresh_token': response.refresh_token,
        'full_name': response.user.full_name,
        'user_id': response.user.user_id,
        'org_id': response.user.org_id,
        'org_name': response.user.org_name
      };
      this.userService.storeUserProfile(user);

      console.log('pre navigate')
      this.router.navigate(['/integrations']);
    });
  }

  private login(): void {
    console.log('login is called')
    this.route.queryParams.subscribe(params => {
      console.log('params', params)
      console.log('params.code', params.code)
      if (params.code) {
        this.saveUserProfileAndNavigate(params.code);
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();
    this.login();
  }

}
