import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  brandingKbArticles = brandingKbArticles;

  isQBDSetupInProgress: boolean = false;

  isQBDConnected: boolean = false;

  isLoading: boolean = false;

  appName: AppName = AppName.QBD;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
