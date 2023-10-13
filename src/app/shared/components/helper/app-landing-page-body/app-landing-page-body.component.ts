import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmbedVideoLink } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-landing-page-body',
  templateUrl: './app-landing-page-body.component.html',
  styleUrls: ['./app-landing-page-body.component.scss']
})
export class AppLandingPageBodyComponent implements OnInit {

  @Input() headlineText: string;

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
