import { Component, OnInit, Input } from '@angular/core';
import { EmbedVideoLink } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-app-integration-landing',
  templateUrl: './app-integration-landing.component.html',
  styleUrls: ['./app-integration-landing.component.scss']
})
export class AppIntegrationLandingComponent implements OnInit {
  @Input() headerText: string;

  @Input() svgPath: string;

  @Input() redirectLink: string;

  @Input() embedVideo: string;

  constructor(
    public windowService: WindowService
  ) { }

  ngOnInit(): void {
  }
}
