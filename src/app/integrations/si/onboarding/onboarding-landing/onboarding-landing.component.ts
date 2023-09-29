import { Component, OnInit } from '@angular/core';
import { EmbedVideoLink, IntacctLink, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  redirectLink = IntacctLink.LANDING;

  EmbedVideo = EmbedVideoLink;

  constructor() { }

  ngOnInit(): void {
  }

}
