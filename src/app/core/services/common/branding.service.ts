import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { brandingConfig } from 'src/app/branding/branding-config';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private title: Title
  ) { }

  private setupBrandingConfig(): void {
    this.title.setTitle(brandingConfig.webpageTitle);
    this.document.getElementById('appFavicon')?.setAttribute('href', `assets/${brandingConfig.brandId}/favicon.ico`);
    this.document.documentElement.setAttribute('data-theme', brandingConfig.brandId);
  }

  init(): void {
    this.setupBrandingConfig();
  }
}
