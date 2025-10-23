import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';

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

  @Input() embedVideo: string;

  @Input() appName: string;

  @Input() embedImage: string;

  embedVideoUrl: SafeResourceUrl;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly AppName = AppName;

  brandingStyle = brandingStyle;

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
