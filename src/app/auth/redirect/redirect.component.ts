import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowService } from 'src/app/core/services/core/window.service';
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
    console.log('this.route.snapshot.queryParams',this.route.snapshot.queryParams, this.route.snapshot.queryParams?.state, this.route.snapshot.queryParams?.state === 'travelperk_local_redirect', this.route.snapshot.queryParams?.state == 'travelperk_local_redirect')
    if (this.route.snapshot.queryParams?.state === 'travelperk_local_redirect') {
      const url = `http://localhost:4200/integrations/travelperk?code=${this.route.snapshot.queryParams.code}`;
      this.windowService.redirect(url);
    } else {
      this.redirectToFyleOAuth();
    }
  }

  ngOnInit(): void {
    this.setupNavigation();
  }

}
