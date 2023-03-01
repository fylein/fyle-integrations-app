import { Component, OnInit } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  RedirectLink = RedirectLink;

  isQBDSetupInProgress: boolean = false;

  isQBDConnected: boolean = false;

  isLoading: boolean = false;

  constructor(
    public windowService: WindowService
  ) { }

  openReadMore(): void {
    this.windowService.openInNewTab(RedirectLink.QBD);
  }

  ngOnInit(): void {
  }

}
