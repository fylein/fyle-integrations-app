import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';

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

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
