import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
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

  @Output() importCodeEnabled = new EventEmitter<boolean>();

  AppName = AppName;

  isConfigToggleLeftAligned = brandingFeatureConfig.qbdDirect.configToggleLeftAligned;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly isAsterikAllowed: boolean = brandingFeatureConfig.isAsterikAllowed;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

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
