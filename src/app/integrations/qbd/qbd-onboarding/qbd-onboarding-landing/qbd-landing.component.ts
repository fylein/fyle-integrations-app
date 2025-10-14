import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-qbd-landing',
  templateUrl: './qbd-landing.component.html',
  styleUrls: ['./qbd-landing.component.scss']
})
export class QbdLandingComponent implements OnInit {

  brandingKbArticles = brandingKbArticles;

  isQBDSetupInProgress: boolean = false;

  isQBDConnected: boolean = false;

  isLoading: boolean = false;

  appName: AppName = AppName.QBD;

  readonly brandingConfig = brandingConfig;

  constructor(public brandingService: BrandingService) { }

  ngOnInit(): void {
  }

}
