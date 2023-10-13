import { Component, OnInit } from '@angular/core';
import { Sage300Link, EmbedVideoLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-sage300-onboarding-landing',
  templateUrl: './sage300-onboarding-landing.component.html',
  styleUrls: ['./sage300-onboarding-landing.component.scss']
})
export class Sage300OnboardingLandingComponent implements OnInit {

  redirectLink = Sage300Link.LANDING;

  EmbedVideo = EmbedVideoLink;

  constructor() { }

  ngOnInit(): void {
  }

}
