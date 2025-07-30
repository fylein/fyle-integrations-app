import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-zero-state',
    templateUrl: './zero-state.component.html',
    styleUrls: ['./zero-state.component.scss'],
    standalone: false
})
export class ZeroStateComponent implements OnInit {

  @Input() zeroStateImageURL: string;

  @Input() headerText: string;

  @Input() subHeaderText: string;

  illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  constructor() { }

  ngOnInit(): void {
  }

}
