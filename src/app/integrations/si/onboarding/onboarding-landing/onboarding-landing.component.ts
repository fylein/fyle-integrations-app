import { Component, OnInit } from '@angular/core';
import { EmbedVideoLink, RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  redirectLink = 'https://help.fylehq.com/en/articles/8394683-how-to-configure-the-fyle-sage-intacct-integration';

  EmbedVideo = EmbedVideoLink;

  constructor() { }

  ngOnInit(): void {
  }

}
