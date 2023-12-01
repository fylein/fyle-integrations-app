import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowService } from 'src/app/core/services/common/window.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private windowService: WindowService
  ) { }

  private redirectToFyleOAuth(): void {
    const url = `${environment.fyle_app_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
    this.windowService.redirect(url);
  }

  private setupNavigation(): void {
    if (this.route.snapshot.queryParams?.state === 'travelperk_local_redirect') {
      const url = `http://localhost:4200/integrations/travelperk?code=${this.route.snapshot.queryParams.code}`;
      this.windowService.redirect(url);
    } else if (this.route.snapshot.queryParams?.state === 'qbo_local_redirect') {
      const url = `http://localhost:4200/integrations/qbo/oauth_callback?code=${this.route.snapshot.queryParams.code}&realmId=${this.route.snapshot.queryParams.realmId}`;
      this.windowService.redirect(url);
    } else if (this.route.snapshot.queryParams?.state === 'business_central_local_redirect') {
      const url = `http://localhost:4200/integrations/business_central/onboarding/connector?code=${this.route.snapshot.queryParams.code}`;
      this.windowService.redirect(url);
    } else {
      this.redirectToFyleOAuth();
    }
  }

  ngOnInit(): void {
    this.setupNavigation();
  }

}
