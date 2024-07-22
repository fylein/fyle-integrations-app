import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-configuration-toggle-field',
  templateUrl: './configuration-toggle-field.component.html',
  styleUrls: ['./configuration-toggle-field.component.scss']
})
export class ConfigurationToggleFieldComponent implements OnInit, OnChanges {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() isSectionHeader: boolean;

  @Input() redirectLink: string;

  @Input() iconPath: string;

  @Input() hasDependentFields: boolean;

  @Input() hideToggle: boolean = false;

  @Input() disabled: boolean = false;

  @Input() appName: string;

  AppName = AppName;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingContent = brandingContent.common;

  readonly brandingConfig = brandingConfig;

  readonly brandingXeroContent = brandingContent.xero.configuration.importSetting.toggleToastMessage;

  constructor(
    public windowService: WindowService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled?.currentValue) {
      this.form.get(this.formControllerName)?.disable();
    } else if (!changes.disabled?.currentValue) {
      this.form.get(this.formControllerName)?.enable();
    }
  }

}
