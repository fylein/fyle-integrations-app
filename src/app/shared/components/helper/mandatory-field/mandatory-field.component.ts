import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-mandatory-field',
  templateUrl: './mandatory-field.component.html',
  styleUrls: ['./mandatory-field.component.scss']
})
export class MandatoryFieldComponent implements OnInit {

  @Input() noSpacing: boolean;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
