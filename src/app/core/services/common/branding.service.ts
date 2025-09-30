import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrandingConfiguration } from '../../models/branding/branding-configuration.model';
import { updateBrandingConfigRegistry, updateFeatureConfigRegistry, defaultBrandingConfig } from 'src/app/branding/branding-config';
import { FeatureConfiguration } from '../../models/branding/feature-configuration.model';

const faviconMap = {
  'fyle': 'favicon.ico',
  'co': 'favicon.png'
};

@Injectable({
  providedIn: 'root'
})
export class BrandingService {

  isOrgRebranded: boolean = false;

  private defaultBrandingConfig: BrandingConfiguration = defaultBrandingConfig;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private title: Title
  ) { }

  get brandingConfig(): BrandingConfiguration {
    return this.defaultBrandingConfig;
  }

  getAssetsBrandId(): string {
    if (this.defaultBrandingConfig.brandId === 'fyle' && this.isOrgRebranded) {
      return 'sage';
    }

    return this.defaultBrandingConfig.brandId;
  }

  setOrgRebranded(isOrgRebranded: boolean): void {
    this.isOrgRebranded = isOrgRebranded;
  }

  updateBrandingConfig(config: Partial<BrandingConfiguration>): void {
    const brandingConfig = { ...this.defaultBrandingConfig, ...config };
    this.defaultBrandingConfig = brandingConfig;
    updateBrandingConfigRegistry(brandingConfig);
  }

  updateFeatureConfig(featureUpdates: Partial<FeatureConfiguration[string]>): void {
    updateFeatureConfigRegistry(featureUpdates);
  }

  private setupBrandingConfig(): void {
    this.title.setTitle(this.brandingConfig.webpageTitle);
    this.document.getElementById('appFavicon')?.setAttribute('href', `assets/${this.brandingConfig.brandId}/${faviconMap[this.brandingConfig.brandId]}`);
    this.document.documentElement.setAttribute('data-theme', this.brandingConfig.brandId);
  }

  init(): void {
    this.setupBrandingConfig();
  }
}
