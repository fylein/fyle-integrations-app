import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  @Input() embedVideo: EmbedVideoLink;

  embedVideoUrl: SafeResourceUrl;

  constructor(
    public windowService: WindowService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.updateEmbedVideoUrl();
  }

  private updateEmbedVideoUrl(): void {
    this.embedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedVideo);
  }
}
