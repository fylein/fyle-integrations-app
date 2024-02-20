import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-configuration-toggle-field',
  templateUrl: './configuration-toggle-field.component.html',
  styleUrls: ['./configuration-toggle-field.component.scss']
})
export class ConfigurationToggleFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() isSectionHeader: boolean;

  @Input() redirectLink: string;

  @Input() iconPath: string;

  @Input() hasDependentFields: boolean;

  @Input() hideToggle: boolean = false;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingConfig = brandingConfig;

  constructor(
    public windowService: WindowService
  ) { }

  ngOnInit(): void {
  }

}
