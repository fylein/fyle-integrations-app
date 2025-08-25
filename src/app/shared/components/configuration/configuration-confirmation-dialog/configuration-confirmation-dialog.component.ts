import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ButtonSize, ButtonType, ConfigurationWarningEvent } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-configuration-confirmation-dialog',
  templateUrl: './configuration-confirmation-dialog.component.html',
  styleUrls: ['./configuration-confirmation-dialog.component.scss']
})
export class ConfigurationConfirmationDialogComponent implements OnInit {

  @Input() isWarningVisible: boolean;

  @Input() headerText: string;

  @Input() contextText: string;

  @Input() confirmBtnText: string;

  @Input() showSecondaryCTA: boolean = true;

  @Input() event: ConfigurationWarningEvent;

  @Input() appName: string;

  @Input() subLable: string;

  @Input() redirectLink: string;

  @Output() warningAccepted = new EventEmitter<ConfigurationWarningOut>();

  readonly brandingConfig = brandingConfig;

  readonly brandingKbArticles = brandingKbArticles;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  buttonType = ButtonType;

  buttonSize = ButtonSize;

  AppName = AppName;

  brandIcon: string;

  constructor(
    private windowService: WindowService
  ) { }

  acceptWarning(isWarningAccepted: boolean) {
    this.warningAccepted.emit({hasAccepted: isWarningAccepted, event: this.event});
  }

  redirect() {
    this.windowService.openInNewTab(brandingKbArticles.onboardingArticles.QBD_DIRECT.HELPER_ARTICLE);
  }

  ngOnInit(): void {
    this.brandIcon = `assets/${brandingConfig.brandId}/favicon.png`;
  }

}
