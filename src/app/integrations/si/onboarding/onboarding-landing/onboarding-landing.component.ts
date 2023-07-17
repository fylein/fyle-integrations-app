import { Component, OnInit } from '@angular/core';
import { EmbedVideoLink, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  RedirectLink = RedirectLink;

  EmbedVideo = EmbedVideoLink;

  constructor() { }

  ngOnInit(): void {
  }

}
