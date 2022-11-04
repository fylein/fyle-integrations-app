import { Component, OnInit } from '@angular/core';
import { WindowService } from 'src/app/core/services/core/window.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(
    private windowService: WindowService
  ) { }

  redirectToFyleOAuth(): void {
    console.log('asd')
    const url = `${environment.fyle_app_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
    this.windowService.redirect(url);
  }

  ngOnInit(): void {
    console.log('asd')
    this.redirectToFyleOAuth();    
  }

}
